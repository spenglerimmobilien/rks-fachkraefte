"use client";

import { useRef, useState } from "react";
import { Upload, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  onFilesChange: (files: File[]) => void;
  maxSizeMB?: number;
}

export function FileUpload({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  multiple = false,
  onFilesChange,
  maxSizeMB = 5,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    setError("");
    const valid: File[] = [];
    for (const file of Array.from(newFiles)) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`Max. ${maxSizeMB} MB`);
        continue;
      }
      valid.push(file);
    }
    const updated = multiple ? [...files, ...valid] : valid;
    setFiles(updated);
    onFilesChange(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-navy">{label}</p>
      <div
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-gold transition-colors",
          files.length > 0 && "border-gold/50 bg-gold/5"
        )}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-8 w-8 text-muted mx-auto mb-2" />
        <p className="text-sm text-muted">PDF, JPG (max. {maxSizeMB} MB)</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {files.map((file, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-sand rounded-lg">
          <FileText className="h-4 w-4 text-navy" />
          <span className="text-sm flex-1 truncate">{file.name}</span>
          <span className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB</span>
          <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(i)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
