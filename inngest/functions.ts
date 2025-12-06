import { Sandbox } from "@e2b/code-interpreter";

import { createAgent, gemini } from "@inngest/agent-kit";

import { inngest } from "./client";
import { getsandbox } from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () =>{
    const sb = await Sandbox.create("vibe-nextjs-rahma-2");
    return sb.sandboxId;

    });

    const codeAgent = createAgent({
      name: "codeAgent",
      system:
        "You are an expert next.js developer. you write readable, maintainable code. you write simple Next.js & React snippets",
      model: gemini({
        model: "gemini-2.5-flash",
        apiKey: process.env.GEMINI_API_KEY,
      }),
    });
    const { output } = await codeAgent.run(
      `Write the following snippet : ${event.data.value}`
    );
    const sandboxUrl = await step.run("get-sandbox-url",async () =>{
      const sandbox =await getsandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    })

    console.log(output,sandboxUrl);
    return { output,sandboxUrl};
  }
);
