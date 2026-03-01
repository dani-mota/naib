"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSV_TEMPLATE_EXAMPLE } from "@/lib/csv-templates";

interface CsvUploadProps {
  onUpload: (content: string) => void;
}

export function CsvUpload({ onUpload }: CsvUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onUpload(content);
      };
      reader.readAsText(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE_EXAMPLE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aci-invitation-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Upload CSV</p>
        <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Download Template
        </Button>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-aci-gold bg-aci-gold/5"
            : "border-border hover:border-aci-gold/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {fileName ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5 text-aci-gold" />
            <span className="text-xs font-medium text-foreground">{fileName}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFileName(null);
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              Drop a CSV file here or click to browse
            </p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Required columns: first_name, last_name, email, role_slug
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
