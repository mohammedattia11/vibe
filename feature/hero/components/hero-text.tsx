"use client";

import { motion } from "framer-motion";
import { containerVariants, wordVariants } from "../constants/text-variants";

export default function HeroText() {
  const title = "Build something with vibe";
  const description =
    "Vibe is a free and open source component library for building modern web applications.";

  const titleWords = title.split(" ");
  const descriptionWords = description.split(" ");

  return (
    <div className="space-y-4">
      <motion.h1
        className="text-2xl md:text-5xl font-bold text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {titleWords.map((word, index) =>
          word === "vibe" ? (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-2 bg-linear-to-r from-blue-400 to-blue-700 text-transparent bg-clip-text"
            >
              {word}
            </motion.span>
          ) : (
            <motion.span
              key={index}
              variants={wordVariants}
              className="inline-block mr-2"
            >
              {word}
            </motion.span>
          ),
        )}
      </motion.h1>

      <motion.p
        className="text-lg md:text-xl text-muted-foreground text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {descriptionWords.map((word, index) => (
          <motion.span
            key={index}
            variants={wordVariants}
            className="inline-block mr-1"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}
