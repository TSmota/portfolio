import { FileItem } from "@/components/ide/file-tree-item";

export const fileStructure: FileItem[] = [
  {
    name: 'portfolio-project',
    path: '/',
    type: 'folder',
    children: [
      {
        name: 'src',
        path: '/src',
        type: 'folder',
        children: [
          {
            name: 'pages',
            path: '/src/pages',
            type: 'folder',
            children: [
              { name: 'about.tsx', path: '/', type: 'file', extension: 'tsx' },
              { name: 'projects.json', path: '/projects', type: 'file', extension: 'json' },
              { name: 'contact.md', path: '/contact', type: 'file', extension: 'md' },
            ]
          },
          {
            name: 'data',
            path: '/src/data',
            type: 'folder',
            children: [
              { name: 'skills.ts', path: '/#skills', type: 'file', extension: 'ts' },
              { name: 'experience.json', path: '/#experience', type: 'file', extension: 'json' },
              { name: 'education.yaml', path: '/#education', type: 'file', extension: 'yaml' },
            ]
          }
        ]
      }
    ]
  }
];
