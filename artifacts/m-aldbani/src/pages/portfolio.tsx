import { RootLayout } from "../components/layout/RootLayout";
import { useLanguage } from "../hooks/use-language";
import { useListProjects } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { LogoBrandImage } from "../components/Logo";
import { ExternalLink } from "lucide-react";

import fujiLogo      from "@assets/fuji_no_bg.png";
import communityLogo from "@assets/community_no_bg.png";
import qiroxLogo     from "@assets/qirox_no_bg.png";
import genmzImg      from "@assets/genmz_no_bg.png";

const BLACK    = "#0F0F10";
const GOLD     = "#C7AC70";
const TITANIUM = "#8C9198";
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Static featured brands (always shown) ─── */
const FEATURED_BRANDS = [
  {
    nameEn: "Fuji Cafe",
    nameAr: "فوجي كافية",
    tagEn: "Brand Identity · F&B",
    tagAr: "هوية بصرية · مطاعم",
    logo: fujiLogo,
    bg: "#1a1a1a",
    logoBg: "#ffffff",
    dark: true,
  },
  {
    nameEn: "Gen M&Z",
    nameAr: "جن ام وزد",
    tagEn: "Marketing · Gen Z",
    tagAr: "تسويق · الجيل الجديد",
    logo: genmzImg,
    bg: "#111827",
    dark: true,
    wide: true,
  },
  {
    nameEn: "QIROX",
    nameAr: "كيروكس",
    tagEn: "Brand Strategy",
    tagAr: "استراتيجية علامة",
    logo: qiroxLogo,
    bg: "#0a0a0a",
    dark: true,
  },
  {
    nameEn: "Community Initiative",
    nameAr: "مبادرة تسويقية",
    tagEn: "Community · Marketing",
    tagAr: "مجتمع · تسويق",
    logo: communityLogo,
    bg: "#0f1e3c",
    dark: true,
  },
  {
    nameEn: "Matcha Power",
    nameAr: "ماتشا باور",
    tagEn: "Founder · Brand Build",
    tagAr: "مؤسس · بناء العلامة",
    logo: null,
    bg: "#1a3a2a",
    dark: true,
  },
];

function BrandCard({ brand, i }: { brand: typeof FEATURED_BRANDS[0]; i: number }) {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={`relative rounded-2xl overflow-hidden group cursor-default ${"wide" in brand && brand.wide ? "md:col-span-2" : ""}`}
      style={{ background: brand.bg, border: "1px solid rgba(255,255,255,0.06)", minHeight: 240 }}
    >
      {/* Gold top line on hover */}
      <div className="absolute top-0 left-0 right-0 h-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

      {/* Logo area */}
      <div className="flex items-center justify-center p-10" style={{ minHeight: 170 }}>
        {brand.logo ? (
          <img
            src={brand.logo}
            alt={"nameEn" in brand ? brand.nameEn : ""}
            className="transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: "contain", maxHeight: 110, maxWidth: "80%" }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3">
            <LogoBrandImage size={52} style={{ filter: "drop-shadow(0 4px 16px rgba(37,99,235,0.4))" }} />
            <span className="text-xl font-black" style={{ color: GOLD }}>{t(brand.nameEn, brand.nameAr)}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex items-end justify-between">
        <div>
          <p className="text-sm font-bold" style={{ color: "#fff" }}>{t(brand.nameEn, brand.nameAr)}</p>
          <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: GOLD, opacity: 0.75 }}>
            {t(brand.tagEn, brand.tagAr)}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: `rgba(199,172,112,0.15)`, border: `1px solid rgba(199,172,112,0.3)` }}>
          <ExternalLink size={12} style={{ color: GOLD }} />
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, i }: { project: any; i: number }) {
  const { t, language } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: i * 0.1, duration: 0.7, ease: EASE }}
    >
      <Link href={`/portfolio/${project.slug}`}>
        <div className="group rounded-2xl overflow-hidden cursor-pointer h-full flex flex-col"
          style={{ background: BLACK, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="relative overflow-hidden" style={{ height: 200 }}>
            {project.coverImage ? (
              <img src={project.coverImage} alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #08102E, #0F1E56)" }}>
                <LogoBrandImage size={64} style={{ filter: "drop-shadow(0 4px 20px rgba(37,99,235,0.5))" }} />
              </div>
            )}
            {project.category && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(199,172,112,0.9)", color: BLACK }}>
                {project.category}
              </span>
            )}
          </div>
          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-black text-white text-base font-heading mb-1.5 group-hover:text-[#C7AC70] transition-colors">
              {language === "ar" ? (project.titleAr || project.title) : project.title}
            </h3>
            {project.description && (
              <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: TITANIUM }}>
                {language === "ar" ? (project.descriptionAr || project.description) : project.description}
              </p>
            )}
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.tags.slice(0, 3).map((tag: string, ti: number) => (
                  <span key={ti} className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{ background: "rgba(199,172,112,0.1)", color: GOLD }}>
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
  const { t } = useLanguage();
  const { data: rawProjects, isLoading } = useListProjects();
  const projects = Array.isArray(rawProjects) ? rawProjects : [];

  return (
    <RootLayout>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: BLACK, paddingTop: 120, paddingBottom: 80 }}>
        {/* Grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "200px" }} />
        {/* Gold radial */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(circle at top right, rgba(199,172,112,0.08), transparent 60%)" }} />

        <div className="relative z-10 max-w-2xl mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8"
            style={{ background: "rgba(199,172,112,0.1)", border: `1px solid rgba(199,172,112,0.25)` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: GOLD }}>
              {t("Selected Works", "الأعمال المختارة")}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: EASE, duration: 0.7 }}
            className="text-6xl font-black font-heading mb-4"
            style={{ color: "#F5F5F3" }}
          >
            {t("Portfolio", "الأعمال")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: EASE, duration: 0.7 }}
            className="text-lg leading-relaxed"
            style={{ color: TITANIUM }}
          >
            {t(
              "Brands built from concept to commercial launch — strategy, identity, and execution.",
              "علامات بُنيت من الفكرة إلى الإطلاق التجاري — استراتيجية وهوية وتنفيذ."
            )}
          </motion.p>
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}50, transparent)` }} />

      {/* ── Featured Brands Grid ── */}
      <section className="py-20 px-5" style={{ background: "#0a0a0a" }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                {t("Featured Brands", "العلامات البارزة")}
              </span>
            </div>
            <h2 className="text-3xl font-black font-heading" style={{ color: "#F5F5F3" }}>
              {t("Brands & Projects", "العلامات والمشاريع")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURED_BRANDS.map((brand, i) => (
              <BrandCard key={i} brand={brand} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── API Projects (if any) ── */}
      {(isLoading || projects.length > 0) && (
        <section className="py-16 px-5" style={{ background: "#0F0F10" }}>
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px w-8" style={{ background: GOLD }} />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: GOLD }}>
                  {t("All Projects", "كل المشاريع")}
                </span>
              </div>
            </motion.div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: "#1a1a1a" }} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} project={project} i={i} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </RootLayout>
  );
}
