"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePresence, motion } from "framer-motion";
import { GithubIcon, Loader2Icon } from "lucide-react";

interface GitHubPublishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repoName: string;
  onRepoNameChange: (value: string) => void;
  commitMessage: string;
  onCommitMessageChange: (value: string) => void;
  isExistingRepo: boolean;
  isPublishing: boolean;
  onPublish: () => void;
}

export function GitHubPublishModal({
  open,
  onOpenChange,
  repoName,
  onRepoNameChange,
  commitMessage,
  onCommitMessageChange,
  isExistingRepo,
  isPublishing,
  onPublish,
}: GitHubPublishModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GithubIcon className="h-5 w-5" />
            {isExistingRepo ? "Push Update to GitHub" : "Create Repository"}
          </DialogTitle>
          <DialogDescription>
            {isExistingRepo
              ? "Sync your latest changes to the connected GitHub repository."
              : "Create a new public repository on GitHub for this project."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <AnimatePresence mode="popLayout">
            {!isExistingRepo && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid gap-2 overflow-hidden"
              >
                <Label htmlFor="repo-name">Repository Name</Label>
                <Input
                  id="repo-name"
                  value={repoName}
                  onChange={(e) => onRepoNameChange(e.target.value)}
                  placeholder="e.g. my-awesome-app"
                  disabled={isPublishing}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-2"
          >
            <Label htmlFor="commit-message">Commit Message</Label>
            <Input
              id="commit-message"
              value={commitMessage}
              onChange={(e) => onCommitMessageChange(e.target.value)}
              placeholder="e.g. Initial commit"
              disabled={isPublishing}
            />
          </motion.div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPublishing}
          >
            Cancel
          </Button>
          <Button onClick={onPublish} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                {isExistingRepo ? "Pushing..." : "Creating..."}
              </>
            ) : isExistingRepo ? (
              "Push Changes"
            ) : (
              "Create & Push"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
