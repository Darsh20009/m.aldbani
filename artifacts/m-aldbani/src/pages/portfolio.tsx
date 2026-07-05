import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink, Globe, Sparkles, Briefcase } from "lucide-react";

function ProjectCard({ project, i }: { project: any; i: number }) {
  const { t, language } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/portfolio/${project.slug}`}>
        <div className="group bg-white rounded-3xl overflow-hidden cursor-pointer h-full flex flex-col"
          style={{
            border: "1px solid rgba(37,99,235,0.1)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            transition: "all 0.35s ease",
          }}>

          {/* Cover image */}
          <div className="relative overflow-hidden h-52">
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.08))" }}>
                <Briefcase size={36} className="text-[#2563EB] opacity-30" />
              </div>
            )}

            {/* Category badge */}
            {project.category && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm"
                style={{ background: "rgba(37,99,235,0.85)", color: "white" }}>
                {project.category}
              </span>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </div>

          {/* Top gradient bar */}
          <div className="h-1 w-full bg-brand-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="p-6 flex-1 flex flex-col">
            <h3 className="font-black text-slate-900 text-lg font-heading mb-2 group-hover:text-[#2563EB] transition-colors">
              {language === "ar" ? (project.titleAr || project.title) : project.title}
            </h3>

            {project.description && (
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                {language === "ar" ? (project.descriptionAr || project.description) : project.description}
              </p>
            )}

            {/* Tags */}
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {project.tags.slice(0, 3).map((tag: string, ti: number) => (
                  <span key={ti} className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB" }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Portfolio() {
  const { t, language } = useLanguage();
  const { data: rawProjects, isLoading } = useListProjects();
  const projects = Array.isArray(rawProjects) ? rawProjects : [];

  return (
    <RootLayout>

      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden" style={{ background: "#FAF8F4" }}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-gradient" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.05] pointer-events-none"
          style={{ background: "radial-gradient(circle, #2563EB, #7C3AED)" }} />
        <div className="absolute inset-0 pattern-geo opacity-50 pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}
          >
            <Sparkles size={12} className="text-[#2563EB]" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#2563EB]">
              {t("Selected Works", "الأعمال المختارة")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-black text-slate-900 font-heading mb-4"
          >
            {t("Portfolio", "الأعمال")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg leading-relaxed"
          >
            {t(
              "A curated selection of brands and projects — from concept to commercial launch.",
              "مجموعة مختارة من العلامات والمشاريع — من الفكرة إلى الإطلاق التجاري."
            )}
          </motion.p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 px-5 bg-[#FAF8F4]">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 rounded-3xl bg-white animate-pulse"
                  style={{ border: "1px solid rgba(37,99,235,0.08)" }} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(37,99,235,0.08)" }}>
                <Briefcase size={36} className="text-[#2563EB] opacity-50" />
              </div>
              <p className="text-lg font-bold text-slate-700 mb-2">{t("No projects yet", "لا توجد مشاريع بعد")}</p>
              <p className="text-slate-400 text-sm">{t("Check back soon for portfolio updates.", "تحقق مرة أخرى قريباً.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
                <ProjectCard key={project.id} project={project} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>

    </RootLayout>
  );
}
