"use client";
import { ProjectForm } from "@/modules/home/ui/Components/project-form";
import { ProjectList } from "@/modules/home/ui/Components/project-list";
import Image from "next/image";
import { motion } from "framer-motion";
const Page = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-blue-500 to-slate-500 opacity-20 blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-pink-500 to-red-500 opacity-20 blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", right: "10%" }}
      />
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 opacity-20 blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, -100, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "50%", left: "50%" }}
      />
      <div className="flex flex-col max-w-5xl mx-auto w-full">
        <section className="space-y-6 py-[16vh] 2xl:py-48">
          {/*<div className="flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="Vibe"
              width={50}
              height={50}
              className="hidden md:block"
            />
          </div>*/}

          <h1 className="text-2xl md:text-5xl font-bold text-center ">
            Build something with Vibe
          </h1>
          <p className="text-lg  md:text-xl text-muted-foreground text-center ">
            Vibe is a free and open source component library for building modern
            web applications.
          </p>
          <div className="max-w-3xl mx-auto w-full">
            <ProjectForm />
          </div>
        </section>
        <ProjectList />
      </div>
    </div>
  );
};
export default Page;
