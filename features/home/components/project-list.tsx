"use client";

import { Button } from "@/components/ui/button";
import { ProjectTypes } from "@/types";
import { useUser } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

type ProjectListProps = {
  projects: ProjectTypes[];
};

export const ProjectList = ({ projects }: ProjectListProps) => {
  const { user } = useUser();
  if (!user) return null;
  return (
    <div className="dark:bg-sidebar flex w-full flex-col gap-y-6 rounded-xl border bg-white p-8 sm:gap-y-8">
      <h2 className="text-2xl font-semibold tracking-wide">{user?.firstName}&apos;s Vibes</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
            className="h-20 h-auto w-full justify-start p-4 text-start font-normal"
          >
            <Link href={`/projects/${project.id}`} className="w-full">
              <div className="flex items-center gap-4">
                <Image
                  src="/logo.png"
                  alt="Vibe Project"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <div className="flex flex-col">
                  <h3 className="text-lg tracking-wide">{project.name}</h3>
                  <p className="text-muted-foreground text-sm">
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
