import { TreeItemType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* =========================
   cn helper (tailwind utils)
========================= */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItemType[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }
  const tree: TreeNode = {};
  const sortedPath = Object.keys(files).sort();
  for (const filePath of sortedPath) {
    const parts = filePath.split("/");
    let current = tree;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    const fileName = parts[parts.length - 1];
    current[fileName] = null;
  }

  function sortEntries(
    entries: [string, TreeNode | null][],
  ): [string, TreeNode | null][] {
    return entries.sort((a, b) => {
      const [keyA, valueA] = a;
      const [keyB, valueB] = b;

      const isDirA = valueA !== null;
      const isDirB = valueB !== null;
      const isHiddenA = keyA.startsWith(".");
      const isHiddenB = keyB.startsWith(".");

      // Directories come first
      if (isDirA && !isDirB) return -1;
      if (!isDirA && isDirB) return 1;

      // Both are directories or both are files
      // Hidden files come last
      if (!isDirA && !isDirB) {
        if (isHiddenA && !isHiddenB) return 1;
        if (!isHiddenA && isHiddenB) return -1;
      }

      // Sort alphabetically
      return keyA.localeCompare(keyB);
    });
  }

  function convertNode(
    node: TreeNode,
    name?: string,
  ): TreeItemType[] | TreeItemType {
    const entries = Object.entries(node);

    if (entries.length === 0) {
      return name || "";
    }

    // Sort entries: directories first, then files, hidden files last
    const sortedEntries = sortEntries(entries as [string, TreeNode | null][]);
    const children: TreeItemType[] = [];

    for (const [key, value] of sortedEntries) {
      if (value === null) {
        // this is a file
        children.push(key);
      } else {
        // this is a folder
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }
    return children;
  }
  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}
