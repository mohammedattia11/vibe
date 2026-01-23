import Image from "next/image";
import { ProjectForm } from "@/modules/home/ui/Components/project-form";
import { ProjectList } from "@/modules/home/ui/Components/project-list";

const Page = () => {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4">
      <section className="flex w-full flex-col items-center gap-6 py-[16vh]">
        {/* Logo */}
        <Image src="/logo.svg" alt="Vibe" width={48} height={48} priority />

        {/* Title */}
        <h1 className="text-center text-4xl font-bold tracking-tight md:text-5xl">
          Build something with Vibe
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl text-center text-muted-foreground">
          Create a project by entering a brief description of what you want to
          build. Vibe will generate a complete codebase for you in seconds.
        </p>

        {/* Form */}
        <ProjectForm />
      </section>
      <ProjectList />
    </div>
  );
};

export default Page;
