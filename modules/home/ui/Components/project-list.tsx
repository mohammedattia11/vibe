"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const ProjectList = () => {
  const trpc = useTRPC();

  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions(),
  );

  return (
    <section className="w-full border-t py-12 px-4">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-2xl font-bold">Saved Vibes</h2>

        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading projects...</p>
        )}

        {!isLoading && projects?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <Image
              src="/empty-state.svg"
              alt="No Projects"
              width={150}
              height={150}
            />
            <p className="text-center text-muted-foreground">
              No projects yet. Create your first vibe ✨
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {projects?.map((project) => (
            <Button
              key={project.id}
              asChild
              variant="outline"
              className="h-auto p-0 text-left"
            >
              <Link href={`/projects/${project.id}`}>
                <div className="flex w-full flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Image src="/logo.svg" alt="Vibe" width={36} height={36} />
                    <div className="flex flex-col">
                      <span className="font-semibold">{project.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};
