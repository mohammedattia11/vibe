"use client";

import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { MainBackground } from "@/features/home/components/main-background";
import { useCurrentTheme } from "@/hooks/use-current-theme";

const Page = () => {
  const currentTheme = useCurrentTheme();
  return (
    <MainBackground>
      <div className="mx-auto flex w-full max-w-3xl flex-col">
        <section className="space-y-6 pt-[16vh] 2xl:pt-48">
          <div className="flex flex-col items-center">
            <SignUp
              appearance={{
                baseTheme: currentTheme === "dark" ? dark : undefined,
                elements: {
                  cardBox: "border! shadow-none! rounded-lg!",
                },
              }}
            />
          </div>
        </section>
      </div>
    </MainBackground>
  );
};

export default Page;
