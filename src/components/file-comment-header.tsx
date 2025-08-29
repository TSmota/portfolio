interface FileCommentHeaderProps {
  filename: string;
  className?: string;
}

export function FileCommentHeader({ filename, className = "" }: FileCommentHeaderProps) {
  return (
    <div className={`text-muted-foreground font-mono text-xs mb-4 ${className}`}>
      {`// ${filename}`}
    </div>
  );
}
