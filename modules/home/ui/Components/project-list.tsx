"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";

export const ProjectList = () => {
  const trpc = useTRPC();
  const {user} =useUser();
  const { data: projects } = useQuery(trpc.projects.getMany.queryOptions());
  if (!user) return null;
  return (
    <div className="w-full bg-white dark:bg-sidebar rounded-xl p-8 border flex flex-col gap-y-6 sm:gap-y-8">
      <h2 className="text-2xl font-semibold">
          {user?.firstName}&apos;s Vibes
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {projects?.length === 0 && (
          <div className="cols-span-4 text-center">
            <p>No projects found. Create your first project!</p>
          </div>
        )}
        {projects?.map((project) => (
          <Button
            key={project.id}
            asChild
            variant="outline"
            className="font-normal h-auto justify-start h-20 w-full text-start  p-4"
          >
            <Link href={`/projects/${project.id}`} className="w-full">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.svg"
                  alt="Vibe Project"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col ">
                  <h3 className="truncate font-medium">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};
