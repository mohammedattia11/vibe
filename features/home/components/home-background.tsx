import React from "react";

interface HomeBackgroundProps {
  children: React.ReactNode;
}

export const HomeBackground = ({ children }: HomeBackgroundProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-2">
      {children}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(80% 100% at 0% 100%, #f97316 50%, #3b82f6 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, transparent 60%)",
          maskImage: "linear-gradient(to top, black 0%, transparent 60%)",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
    </div>
  );
};
