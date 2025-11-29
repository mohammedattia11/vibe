import { createAgent, gemini } from "@inngest/agent-kit";

import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeAgent = createAgent({
      name: "codeAgent",
      system: "You are an expert next.js developer. you write readable, maintainable code. you write simple Next.js & React snippets",
      model: gemini({ model: "gemini-2.5-flash", apiKey:process.env.GEMINI_API_KEY }),
    });
    const { output } =  await codeAgent.run(`Write the following snippet : ${event.data.value}`);
    console.log(output);
    return { output };
  }
);
