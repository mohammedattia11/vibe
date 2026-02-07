import { Sandbox } from "@e2b/code-interpreter";
import { AgentResult, Message, TextMessage } from "@inngest/agent-kit";

export async function getsandbox(sandboxId: string) {
  const sandbox = await Sandbox.connect(sandboxId);
  await sandbox.setTimeout(60_000 * 10 * 3);
  return sandbox;
}

// Recursively read all files from sandbox, excluding node_modules and build artifacts
export async function readAllSandboxFiles(
  sandbox: Sandbox,
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};
  const directoriesToProcess: string[] = ["/home/user"];
  const excludeDirs = [
    "node_modules",
    ".next",
    ".git",
    ".cache",
    "dist",
    "build",
    "nextjs-app",
  ];
  const excludeFiles = [
    ".DS_Store",
    "Thumbs.db",
    ".env.local",
    ".env",
    ".profile",
    ".bashrc",
    ".bash_logout",
    ".wh.nextjs-app",
  ];
  const binaryExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".mp4",
    ".mp3",
    ".webm",
  ];

  while (directoriesToProcess.length > 0) {
    const currentDir = directoriesToProcess.pop()!;

    try {
      const entries = await sandbox.files.list(currentDir);

      for (const entry of entries) {
        const fullPath = `${currentDir}/${entry.name}`.replace(/\/+/g, "/");

        // Skip excluded directories (check both path and directory name)
        if (
          excludeDirs.some(
            (dir) =>
              fullPath.includes(`/${dir}/`) ||
              entry.name === dir ||
              fullPath.endsWith(`/${dir}`),
          )
        ) {
          continue;
        }

        // Skip excluded files
        if (excludeFiles.includes(entry.name)) {
          continue;
        }

        if (entry.type === "dir") {
          directoriesToProcess.push(fullPath);
        } else {
          const ext = entry.name.includes(".")
            ? entry.name.substring(entry.name.lastIndexOf("."))
            : "";
          if (binaryExtensions.includes(ext)) {
            files[fullPath.replace("/home/user/", "")] =
              "[Binary file - content not included]";
            continue;
          }

          try {
            const content = await sandbox.files.read(fullPath);
            if (typeof content === "string") {
              files[fullPath.replace("/home/user/", "")] = content;
            }
          } catch (e) {
            console.warn(`Failed to read file ${fullPath}:`, e);
          }
        }
      }
    } catch (e) {
      console.warn(`Failed to list directory ${currentDir}:`, e);
    }
  }

  return files;
}

export function lastAssistantTextMessageContent(result: AgentResult) {
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant",
  );
  const message = result.output[lastAssistantTextMessageIndex] as
    | TextMessage
    | undefined;

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}

export const parseAgentOutput = (value: Message[]) => {
  const output = value[0];
  if (output.type !== "text") {
    return "Fragment";
  }
  if (Array.isArray(output.content)) {
    return output.content.map((txt) => txt).join("");
  } else {
    return output.content;
  }
};
