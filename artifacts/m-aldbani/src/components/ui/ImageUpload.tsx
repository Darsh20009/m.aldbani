import { useRef, useState, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Film, CheckCircle2, Loader2 } from "lucide-react";

function getToken() { return localStorage.getItem("token") ?? ""; }

interface Props {
  value?: string;
  onChange: (url: string) => void;
  accept?: string; // e.g. "image/*,video/*"
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({
  value, onChange, accept = "image/*", label, placeholder = "Click or drag & drop to upload", className = ""
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const doUpload = useCallback(async (file: File) => {
    setUploading(true); setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch (e: any) {
      setError(e.message ?? "Upload failed");
    } finally { setUploading(false); }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) doUpload(file);
  }, [doUpload]);

  const isVideo = value && (value.endsWith(".mp4") || value.endsWith(".webm") || value.endsWith(".mov") || value.includes("video"));

  return (
    <div className={`grid gap-1.5 ${className}`}>
      {label && <label className="text-sm text-muted-foreground font-medium">{label}</label>}

      {/* Preview */}
      {value && (
        <div className="relative group rounded-xl overflow-hidden border border-border/60 bg-muted/20" style={{ maxHeight: 180 }}>
          {isVideo ? (
            <video src={value} className="w-full object-cover" style={{ maxHeight: 180 }} controls />
          ) : (
            <img src={value} alt="" className="w-full object-cover" style={{ maxHeight: 180 }} />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed cursor-pointer transition-all select-none py-5 px-4
          ${dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border/50 bg-muted/20 hover:border-primary/50 hover:bg-primary/5"}`}
      >
        {uploading ? (
          <>
            <Loader2 size={22} className="animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Uploading…</p>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-muted-foreground">
              {accept.includes("video") ? <Film size={20} /> : <ImageIcon size={20} />}
              <Upload size={16} />
            </div>
            <p className="text-xs text-center text-muted-foreground">{placeholder}</p>
            <p className="text-[10px] text-muted-foreground/60">Max 50 MB</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) doUpload(f); }}
        />
      </div>

      {/* URL fallback */}
      <div className="flex gap-2 items-center">
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">or paste URL</span>
        <input
          type="url"
          value={value ?? ""}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 border border-border rounded-md px-2 py-1.5 text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
