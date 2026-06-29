import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useSiteSettings } from "../hooks/use-site-settings";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Globe, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Portfolio() {
  const { t, language } = useLanguage();
  const settings = useSiteSettings();
  const { data: rawProjects, isLoading } = useListProjects();
  const projects = Array.isArray(rawProjects) ? rawProjects : [];

  const GOLD    = settings.accentGoldColor      || "#B8860B";
  const GOLD_LT = settings.accentGoldLightColor || "#D4A017";
  const NAVY    = settings.darkSectionBgColor   || "#0A1628";
  const CREAM   = settings.lightSectionBgColor  || "#FAF6EF";

  return (
    <RootLayout>
      {/* Hero Header */}
      <section className="py-20 relative overflow-hidden" style={{ background: NAVY }}>
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}40, transparent)` }} />
        <div className="container mx-auto px-8 lg:px-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ background: GOLD }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.32em]" style={{ color: GOLD }}>
              {t("Portfolio", "الأعمال")}
            </p>
            <div className="h-px w-8" style={{ background: GOLD }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-4">
            {t("Selected Works", "الأعمال المختارة")}
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: "rgba(240,220,180,0.55)" }}>
            {t(
              "A curated selection of brands and projects — from concept to commercial launch.",
              "مجموعة مختارة من العلامات والمشاريع — من الفكرة إلى الإطلاق التجاري."
            )}
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16" style={{ background: CREAM }}>
        <div className="container mx-auto px-8 lg:px-16">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 rounded-2xl bg-white border border-border/60 animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-4xl mb-4">📁</p>
              <p className="font-semibold" style={{ color: NAVY }}>{t("No projects yet", "لا توجد مشاريع بعد")}</p>
              <p className="text-sm mt-1" style={{ color: "#6B5A3E" }}>{t("Check back soon.", "تابعنا قريباً.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any, i: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link href={`/portfolio/${project.id}`}>
                    <div className="group bg-white rounded-2xl border overflow-hidden cursor-pointer h-full flex flex-col transition-all duration-300 hover:shadow-xl"
                      style={{ borderColor: `${GOLD}20` }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}60`; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}20`; }}>

                      {/* Cover image */}
                      <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: `${GOLD}10` }}>
                        {project.image || project.imageUrl ? (
                          <img
                            src={project.image || project.imageUrl}
                            alt={language === "ar" ? project.titleAr : project.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-5xl">
                              {project.logoUrl
                                ? <img src={project.logoUrl} alt="" className="w-20 h-20 object-contain" />
                                : "📁"}
                            </span>
                          </div>
                        )}
                        {/* Category badge */}
                        {project.category && (
                          <div className="absolute top-3 left-3">
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                              style={{ background: `${GOLD}20`, color: GOLD, border: `1px solid ${GOLD}35` }}>
                              {project.category}
                            </span>
                          </div>
                        )}
                        {/* Featured badge */}
                        {project.featured && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white"
                              style={{ background: GOLD }}>
                              ⭐ {t("Featured", "مميز")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        {/* Logo + title */}
                        <div className="flex items-start gap-3 mb-3">
                          {project.logoUrl && (
                            <img src={project.logoUrl} alt="" className="w-10 h-10 object-contain rounded-lg border flex-shrink-0"
                              style={{ borderColor: `${GOLD}20` }} />
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base leading-tight transition-colors duration-200 group-hover:text-amber-700 truncate"
                              style={{ color: NAVY }}>
                              {language === "ar" ? (project.titleAr || project.title) : project.title}
                            </h3>
                            {project.client && (
                              <p className="text-xs mt-0.5 truncate" style={{ color: "#9B8A6E" }}>{project.client}</p>
                            )}
                          </div>
                          {project.year && (
                            <span className="text-xs font-mono flex-shrink-0" style={{ color: `${GOLD}70` }}>{project.year}</span>
                          )}
                        </div>

                        {/* Description */}
                        {(project.description || project.descriptionAr) && (
                          <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2" style={{ color: "#6B5A3E" }}>
                            {language === "ar" ? (project.descriptionAr || project.description) : (project.description || project.descriptionAr)}
                          </p>
                        )}

                        {/* Social links */}
                        {(project.websiteUrl || project.instagramUrl || project.twitterUrl || project.linkedinUrl) && (
                          <div className="flex items-center gap-2 mt-auto pt-3 border-t"
                            style={{ borderColor: `${GOLD}15` }}>
                            {project.websiteUrl && (
                              <a href={project.websiteUrl} target="_blank" rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg transition-colors hover:bg-amber-50"
                                style={{ color: "#9B8A6E" }}>
                                <Globe size={14} />
                              </a>
                            )}
                            {project.instagramUrl && (
                              <a href={project.instagramUrl} target="_blank" rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg transition-colors hover:bg-pink-50 hover:text-pink-500"
                                style={{ color: "#9B8A6E" }}>
                                <Instagram size={14} />
                              </a>
                            )}
                            {project.twitterUrl && (
                              <a href={project.twitterUrl} target="_blank" rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg transition-colors hover:bg-sky-50 hover:text-sky-500"
                                style={{ color: "#9B8A6E" }}>
                                <Twitter size={14} />
                              </a>
                            )}
                            {project.linkedinUrl && (
                              <a href={project.linkedinUrl} target="_blank" rel="noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="p-1.5 rounded-lg transition-colors hover:bg-blue-50 hover:text-blue-600"
                                style={{ color: "#9B8A6E" }}>
                                <Linkedin size={14} />
                              </a>
                            )}
                            <span className="ml-auto text-xs font-semibold" style={{ color: GOLD }}>
                              {t("View →", "← عرض")}
                            </span>
                          </div>
                        )}
                        {!(project.websiteUrl || project.instagramUrl || project.twitterUrl || project.linkedinUrl) && (
                          <div className="mt-auto pt-3 border-t" style={{ borderColor: `${GOLD}15` }}>
                            <span className="text-xs font-semibold" style={{ color: GOLD }}>{t("View Details →", "← عرض التفاصيل")}</span>
                          </div>
                        )}
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
