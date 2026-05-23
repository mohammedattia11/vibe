"use client";

import { useCurrentTheme } from "@/hooks/use-current-theme";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";

const Page = () => {
  const currentTheme = useCurrentTheme();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="Vibe"
            width={80}
            height={80}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-center text-xl font-bold md:text-3xl">Pricing</h1>
        <p className="text-muted-foreground text-center text-sm md:text-base">
          Choose The Plan That Fits Your Needs.
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-non! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  );
};

export default Page;
