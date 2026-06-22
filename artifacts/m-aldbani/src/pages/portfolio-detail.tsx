import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function PortfolioDetail() {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();
  
  const { data: project, isLoading } = useGetProject(id, {
    query: {
      enabled: !!id,
      queryKey: getGetProjectQueryKey(id)
    }
  });

  if (isLoading) {
    return (
      <RootLayout>
        <div className="container mx-auto px-4 py-24 animate-pulse">
          <div className="h-12 bg-primary/10 rounded w-1/2 mb-6"></div>
          <div className="h-96 bg-primary/10 rounded w-full mb-12"></div>
        </div>
      </RootLayout>
    );
  }

  if (!project) return null;

  return (
    <RootLayout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20 text-sm py-1 px-4">
              {project.category}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
              {language === "ar" ? project.titleAr : project.title}
            </h1>
          </div>

          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-16 border border-border">
            <img 
              src={project.image || "https://placehold.co/1200x675/0A0A0A/2563EB?text=Project"} 
              alt={language === "ar" ? project.titleAr : project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2 prose prose-invert prose-lg max-w-none">
              <h2 className="font-heading">{t("Project Overview", "نظرة عامة على المشروع")}</h2>
              <p>{language === "ar" ? project.descriptionAr : project.description}</p>
              
              {project.results && (
                <>
                  <h2 className="font-heading mt-12">{t("Results & Impact", "النتائج والأثر")}</h2>
                  <p>{project.results}</p>
                </>
              )}
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4 border-b border-border pb-4">
                  {t("Technologies", "التقنيات المستخدمة")}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-sm text-white/80 bg-primary/10 px-3 py-1.5 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RootLayout>
  );
}
