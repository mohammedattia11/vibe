"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

/* ================= TYPES ================= */

export interface TreeItem {
  id: string;
  name: string;
  children?: TreeItem[];
}

/* ================= DATA -> TREE ================= */

export function convertFilesToTreeItems(
  files: Record<string, string>,
): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};
  const sortedPaths = Object.keys(files).sort();

  for (const filePath of sortedPaths) {
    const parts = filePath.split("/").filter(Boolean);
    let current = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] ??= {};
      current = current[parts[i]] as TreeNode;
    }

    current[parts.at(-1)!] = null;
  }

  const toItems = (node: TreeNode, base = ""): TreeItem[] =>
    Object.entries(node).map(([name, value]) => ({
      id: base ? `${base}/${name}` : name,
      name,
      ...(value
        ? { children: toItems(value, base ? `${base}/${name}` : name) }
        : {}),
    }));

  return toItems(tree);
}

/* ================= TREE VIEW ================= */

interface TreeViewProps {
  data: TreeItem[];
  value: string | null;
  onFileSelect: (file: string) => void;
}

export const TreeView = ({ data, value, onFileSelect }: TreeViewProps) => {
  return (
    <div className="space-y-1 text-sm">
      {data.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          value={value}
          onFileSelect={onFileSelect}
          level={0}
        />
      ))}
    </div>
  );
};

/* ================= TREE NODE ================= */

const TreeNode = ({
  item,
  value,
  onFileSelect,
  level,
}: {
  item: TreeItem;
  value: string | null;
  onFileSelect: (file: string) => void;
  level: number;
}) => {
  const [open, setOpen] = useState(true);
  const isFolder = !!item.children?.length;
  const isActive = value === item.id;

  return (
    <div>
      <div
        className={`flex items-center gap-1 cursor-pointer rounded px-2 py-1 hover:bg-muted ${
          isActive ? "bg-accent" : ""
        }`}
        style={{ paddingLeft: level * 16 + 8 }}
        onClick={() => (isFolder ? setOpen(!open) : onFileSelect(item.id))}
      >
        {/* Arrow */}
        {isFolder ? (
          open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )
        ) : (
          <span className="w-4" />
        )}

        {/* Name */}
        <span className="truncate">{item.name}</span>
      </div>

      {/* Children */}
      {isFolder && open && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              value={value}
              onFileSelect={onFileSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
