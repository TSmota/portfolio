import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileItem } from "@/components/ide/file-tree-item";
import { fileStructure } from "@/constants/file-structure";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getFileIcon = (extension?: string) => {
  switch (extension) {
    case 'tsx':
      return '📄';
    case 'json':
      return '📋';
    case 'md':
      return '📝';
    case 'ts':
      return '⚡';
    case 'yaml':
      return '📊';
    default:
      return '📁';
  }
};

export const getFileFromPath = (path: string): FileItem | null => {
  const findFile = (items: FileItem[]): FileItem | null => {
    for (const item of items) {
      if (item.type === 'file' && item.path === path) {
        return item;
      }
      if (item.children) {
        const found = findFile(item.children);
        if (found) return found;
      }
    }
    return null;
  };

  return findFile(fileStructure);
};
