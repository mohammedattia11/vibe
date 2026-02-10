"use client";
import HeroText from "@/features/home/components/hero-text";
import { sectionVariants } from "@/features/home/constants/section-variant";
import { ProjectForm } from "@/features/home/components/project-form";
import { ProjectList } from "@/features/home/components/project-list";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { HomeBackground } from "@/features/home/components/home-background";

const HomePage = () => {
  const trpc = useTRPC();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  return (
    <HomeBackground>
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={sectionVariants}
          className="space-y-6 py-[16vh] xl:py-32"
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
          <div className="mx-auto w-full max-w-3xl">
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
    </HomeBackground>
  );
};
export default HomePage;
