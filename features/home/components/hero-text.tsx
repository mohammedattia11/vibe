"use client";

import { motion } from "framer-motion";
import { containerVariants, wordVariants } from "../constants/text-variants";

export default function HeroText() {
  const title = "From imagination to implementation";
  const description =
    "Vibe turns your ideas into fully working web apps. Just write a prompt and get your application in minutes.";
  const titleWords = title.split(" ");
  const descriptionWords = description.split(" ");

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-center text-2xl font-bold text-zinc-300 sm:text-4xl md:text-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {titleWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="mr-1 inline-block md:mr-2"
          >
            {word}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-center text-xs sm:text-base md:text-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {descriptionWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="mr-1 inline-block"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}
