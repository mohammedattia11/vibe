import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* =========================
   cn helper (tailwind utils)
========================= */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// /* =========================
//    Tree Types
// ========================= */

// export interface TreeItem {
//   id: string;
//   name: string;
//   children?: TreeItem[];
// }

// /* =========================
//    convertFilesToTreeItems
// ========================= */

// /**
//  * Convert a record of files to a tree structure.
//  *
//  * @param files - Record of file paths to content
//  * @returns Tree structure for TreeView component
//  *
//  * @example
//  * Input:
//  * {
//  *   "src/Button.tsx": "...",
//  *   "README.md": "..."
//  * }
//  *
//  * Output:
//  * [
//  *   {
//  *     id: "src",
//  *     name: "src",
//  *     children: [
//  *       {
//  *         id: "src/Button.tsx",
//  *         name: "Button.tsx"
//  *       }
//  *     ]
//  *   },
//  *   {
//  *     id: "README.md",
//  *     name: "README.md"
//  *   }
//  * ]
//  */
// export function convertFilesToTreeItems(
//   files: Record<string, string>,
// ): TreeItem[] {
//   interface TreeNode {
//     [key: string]: TreeNode | null;
//   }

//   // Build a tree structure first
//   const tree: TreeNode = {};

//   // Sort files for consistent order
//   const sortedPaths = Object.keys(files).sort();

//   for (const filePath of sortedPaths) {
//     const parts = filePath.split("/").filter(Boolean);
//     let current = tree;

//     // Navigate/create folder structure
//     for (let i = 0; i < parts.length - 1; i++) {
//       const part = parts[i];
//       if (!current[part]) {
//         current[part] = {};
//       }
//       current = current[part] as TreeNode;
//     }

//     // Add file (leaf)
//     const fileName = parts[parts.length - 1];
//     current[fileName] = null;
//   }

//   // Convert raw tree to TreeItem[]
//   function convertNode(node: TreeNode, parentPath = ""): TreeItem[] {
//     return Object.entries(node).map(([name, value]) => {
//       const id = parentPath ? `${parentPath}/${name}` : name;

//       if (value === null) {
//         // File
//         return {
//           id,
//           name,
//         };
//       }

//       // Folder
//       return {
//         id,
//         name,
//         children: convertNode(value, id),
//       };
//     });
//   }

//   return convertNode(tree);
// }
