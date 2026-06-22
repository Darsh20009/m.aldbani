import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyFiles } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";

export default function ClientFiles() {
  const { t } = useLanguage();
  const { data: files = [], isLoading } = useGetMyFiles();

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-2">{t("Shared Files", "الملفات المشتركة")}</h1>
        <p className="text-white/60 text-sm">
          {t("Documents and resources shared by the consultant.", "المستندات والموارد التي شاركها المستشار.")}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 glass-card rounded-xl animate-pulse" />
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-xl">
          <div className="text-4xl mb-4">📂</div>
          <h3 className="text-lg font-bold mb-2">{t("No files yet", "لا توجد ملفات بعد")}</h3>
          <p className="text-white/50">{t("Files shared with you will appear here.", "ستظهر الملفات التي تمت مشاركتها معك هنا.")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {files.map(file => (
            <div key={file.id} className="glass-card p-6 rounded-xl flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                📄
              </div>
              <h4 className="font-bold text-sm mb-1 line-clamp-1 w-full" title={file.name}>{file.name}</h4>
              <p className="text-xs text-white/50 mb-6 uppercase">
                {file.type.split('/')[1] || file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <Button asChild variant="outline" className="w-full mt-auto border-white/10 hover:bg-primary/20 hover:text-primary transition-colors">
                <a href={file.url} download target="_blank" rel="noopener noreferrer">
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
