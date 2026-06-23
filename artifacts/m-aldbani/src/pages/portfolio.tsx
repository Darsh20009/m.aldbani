import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function Portfolio() {
  const { t, language } = useLanguage();
  const { data: rawProjects, isLoading } = useListProjects();
  const projects = Array.isArray(rawProjects) ? rawProjects : [];

  return (
    <RootLayout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h1 className="text-4xl font-bold font-heading mb-4">
              {t("Selected Works", "الأعمال المختارة")}
            </h1>
            <p className="text-foreground/60 text-lg">
              {t("A curated selection of high-impact technical executions and strategic consulting engagements.", "مجموعة مختارة من التنفيذات التقنية عالية التأثير والاستشارات الاستراتيجية.")}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="glass-card rounded-xl h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project, i) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={`/portfolio/${project.id}`}>
                    <div className="glass-card rounded-xl overflow-hidden group cursor-pointer h-full flex flex-col">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img 
                          src={project.image || "https://placehold.co/800x450/0A0A0A/2563EB?text=Project"} 
                          alt={language === "ar" ? project.titleAr : project.title}
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl font-bold font-heading group-hover:text-primary transition-colors">
                            {language === "ar" ? project.titleAr : project.title}
                          </h3>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {project.category}
                          </Badge>
                        </div>
                        <p className="text-foreground/60 mb-6 flex-1 line-clamp-3">
                          {language === "ar" ? project.descriptionAr : project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {project.technologies.slice(0, 4).map(tech => (
                            <span key={tech} className="text-xs text-foreground/50 bg-white/5 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 4 && (
                            <span className="text-xs text-foreground/50 bg-white/5 px-2 py-1 rounded">
                              +{project.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </RootLayout>
  );
}
