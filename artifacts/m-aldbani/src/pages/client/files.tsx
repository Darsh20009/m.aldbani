import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyFiles } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { FolderOpen, FileText, Download } from "lucide-react";

export default function ClientFiles() {
  const { t } = useLanguage();
  const { data: rawFiles, isLoading } = useGetMyFiles();
  const files = Array.isArray(rawFiles) ? rawFiles : [];

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1">{t("Shared Files", "الملفات المشتركة")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("Documents and resources shared by the consultant.", "المستندات والموارد التي شاركها المستشار.")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 bg-card border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="bg-card border border-border border-dashed p-16 text-center rounded-xl flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <FolderOpen className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-bold mb-2 font-heading">{t("No files yet", "لا توجد ملفات بعد")}</h3>
          <p className="text-muted-foreground text-sm max-w-sm">{t("Files shared with you will appear here.", "ستظهر الملفات التي تمت مشاركتها معك هنا.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map(file => (
            <div key={file.id} className="bg-card border border-border shadow-sm p-6 rounded-xl flex flex-col items-center text-center group hover:border-primary/30 transition-all hover:shadow-md">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-sm mb-1.5 line-clamp-2 w-full text-foreground leading-tight h-10" title={file.name}>{file.name}</h4>
              <p className="text-xs text-muted-foreground font-medium mb-6 uppercase tracking-wider bg-muted px-2.5 py-1 rounded-md">
                {file.type.split('/')[1] || file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button asChild variant="outline" className="w-full mt-auto border-border hover:bg-primary/5 hover:text-primary transition-colors text-sm">
                <a href={file.url} download target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                  {t("Download", "تحميل")}
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </ClientLayout>
  );
}
