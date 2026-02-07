import { z } from "zod";
import { Sandbox } from "@e2b/code-interpreter";
import {
  createAgent,
  createNetwork,
  createTool,
  openai,
  type Tool,
  type Message,
  createState,
} from "@inngest/agent-kit";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { inngest } from "./client";
import {
  getsandbox,
  lastAssistantTextMessageContent,
  parseAgentOutput,
  readAllSandboxFiles,
} from "./utils";
import { prisma } from "@/lib/db";

interface AgentState {
  summary: string;
  files: { [path: string]: string };
}

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sb = await Sandbox.create("vibe-nextjs-rahma-2");
      await sb.setTimeout(60_000 * 10 * 3);
      return sb.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages: Message[] = [];

        const messages = await prisma.message.findMany({
          where: {
            projectId: event.data.projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        for (const message of messages) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: message.content,
          });
        }

        return formattedMessages;
      },
    );

    const state = createState<AgentState>(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );

    const codeAgent = createAgent<AgentState>({
      name: "codeAgent",
      description: "An expert coding agent",
      system: PROMPT,
      model: openai({
        model: "gpt-4o-mini",
        defaultParameters: {
          temperature: 0.1,
        },
      }),
      tools: [
        // Terminal tool
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await getsandbox(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (e) {
                console.error(
                  `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`,
                );
                return `Command failed: ${e} \nstdout: ${buffers.stdout}\nstderror: ${buffers.stderr}`;
              }
            });
          },
        }),
        // create and update files tool
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),
          handler: async (
            { files },
            { step, network }: Tool.Options<AgentState>,
          ) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = network.state.data.files || {};
                  const sandbox = await getsandbox(sandboxId);
                  for (const file of files) {
                    await sandbox.files.write(file.path, file.content);
                    updatedFiles[file.path] = file.content;
                  }
                  return updatedFiles;
                } catch (e) {
                  return "Error: " + e;
                }
              },
            );

            if (typeof newFiles === "object") {
              network.state.data.files = newFiles;
            }
          },
        }),
        // read files tool
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await getsandbox(sandboxId);
                const contents = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (e) {
                return "Error: " + e;
              }
            });
          },
        }),
      ],
      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);
          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }
          return result;
        },
      },
    });

    const network = createNetwork<AgentState>({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      defaultState: state,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value, { state });

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "a fragment title",
      system: FRAGMENT_TITLE_PROMPT,
      model: openai({
        model: "gpt-4o-mini",
      }),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "A response generator",
      system: RESPONSE_PROMPT,
      model: openai({
        model: "gpt-4o-mini",
      }),
    });

    const { output: fragmentTitleOutput } = await fragmentTitleGenerator.run(
      result.state.data.summary,
    );
    const { output: responseOutput } = await responseGenerator.run(
      result.state.data.summary,
    );

    const isError =
      !result.state.data.summary ||
      Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await getsandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    await step.run("save-result", async () => {
      // Get all files from sandbox (boilerplate + AI generated)
      const sandbox = await getsandbox(sandboxId);
      const allSandboxFiles = await readAllSandboxFiles(sandbox);

      // Merge: AI-generated files take precedence over boilerplate
      const mergedFiles = {
        ...allSandboxFiles,
        ...result.state.data.files, // AI files override boilerplate
      };

      if (isError) {
        return await prisma.message.create({
          data: {
            projectId: event.data.projectId,
            content: "Something went wrong. please try again.",
            role: "ASSISTANT",
            type: "ERROR",
          },
        });
      }
      return await prisma.message.create({
        data: {
          projectId: event.data.projectId,
          content: parseAgentOutput(responseOutput),
          role: "ASSISTANT",
          type: "RESULT",
          fragment: {
            create: {
              sandboxUrl: sandboxUrl,
              title: parseAgentOutput(fragmentTitleOutput),
              files: mergedFiles, // Use merged files instead of just AI files
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: "Fragment",
      files: result.state.data.files,
      summary: result.state.data.summary,
    };
  },
);
