"use client";

import { ToggleThemeButton } from "@/components/toggle-theme-button";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const isScrolled = useScroll();

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-50 border-b border-transparent bg-transparent p-4 transition-all duration-200",
        isScrolled && "bg-background border-border",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="items-centre flex">
          <Image src="/logo.png" alt="vibe" width={30} height={30} />
          <span className="text-xl font-bold">ibe</span>
        </Link>
        {/* Visible when signed out */}
        <div className="flex items-center gap-2">
          <SignedOut>
            <div className="flex gap-2">
              <SignUpButton>
                <Button variant="outline" size="sm">
                  Sign up
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button size="sm">Sign in</Button>
              </SignInButton>
            </div>
          </SignedOut>
          {/* Visible when signed in */}
          <SignedIn>
            <UserControl showName />
          </SignedIn>
          <ToggleThemeButton />
        </div>
      </div>
    </nav>
  );
};
