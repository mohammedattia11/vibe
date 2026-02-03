"use client";
import HeroText from "@/feature/hero/components/hero-text";
import { sectionVariants } from "@/feature/hero/constants/section-variant";
import { ProjectForm } from "@/modules/home/ui/Components/project-form";
import { ProjectList } from "@/modules/home/ui/Components/project-list";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";

const HomePage = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  return (
    <div className="relative min-h-screen overflow-hidden px-2">
      <motion.div
        className="absolute h-96 w-96 rounded-full bg-linear-to-r from-blue-500 to-slate-500 opacity-20 blur-3xl"
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
        className="absolute h-96 w-96 rounded-full bg-linear-to-r from-pink-500 to-red-500 opacity-20 blur-3xl"
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
        className="absolute h-96 w-96 rounded-full bg-linear-to-r from-green-500 to-cyan-500 opacity-20 blur-3xl"
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
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="space-y-6 py-[16vh] 2xl:py-48"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
            className="flex flex-col items-center"
          >
            <Image
              src="/logo.png"
              alt="Vibe"
              width={100}
              height={100}
              className="hidden md:block"
            />
          </motion.div>

          <HeroText />
          <div className="max-w-3xl mx-auto w-full">
            <ProjectForm />
          </div>
        </motion.section>
        {projects && projects?.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={sectionVariants}
          >
            <ProjectList projects={projects} />
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
