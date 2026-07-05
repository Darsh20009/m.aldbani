import { useState, useEffect, useCallback } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../../components/ui/ImageUpload";
import { invalidateSiteSettingsCache } from "../../hooks/use-site-settings";
import {
  Save, Globe, User, Phone, Palette, LayoutTemplate, ListOrdered,
  CheckCircle2, Monitor, Smartphone, Eye, EyeOff, Star, Briefcase,
  Plus, Trash2, ChevronUp, ChevronDown, Layers, Award, Coffee, X
} from "lucide-react";

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

const TABS = [
  { id: "sections",  label: "الأقسام",         labelEn: "Sections",        icon: Layers },
  { id: "hero",      label: "الهيرو — محتوى",  labelEn: "Hero Content",    icon: LayoutTemplate },
  { id: "herodesign",label: "الهيرو — تصميم",  labelEn: "Hero Design",     icon: Palette },
  { id: "marquee",   label: "الشريط المتحرك",   labelEn: "Marquee",         icon: ListOrdered },
  { id: "expertise", label: "التخصصات",         labelEn: "Expertise",       icon: Star },
  { id: "skills",    label: "المهارات",          labelEn: "Skills",          icon: Award },
  { id: "career",    label: "المسيرة المهنية",   labelEn: "Career",          icon: Briefcase },
  { id: "featured",  label: "المشروع المميز",    labelEn: "Featured Project",icon: Star },
  { id: "about",     label: "عن الصفحة",         labelEn: "About",           icon: User },
  { id: "contact",   label: "التواصل والسوشيال", labelEn: "Contact",         icon: Phone },
  { id: "branding",  label: "الهوية البصرية",    labelEn: "Branding",        icon: Globe },
];

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm mb-4">
    <h3 className="font-semibold text-foreground mb-4 pb-3 border-b border-border/60">{title}</h3>
    <div className="grid gap-3">{children}</div>
  </div>
);

const Row2 = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-1.5">
    <Label className="text-sm text-muted-foreground">{label}</Label>
    {children}
  </div>
);

const TextArea = ({ value, onChange, dir, rows = 3 }: { value: string; onChange: (v: string) => void; dir?: string; rows?: number }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} dir={dir} rows={rows}
    className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
);

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/40">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  </div>
);

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="grid gap-1.5">
    <Label className="text-sm text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <div className="relative">
        <input type="color" value={value || "#000000"} onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
        <div className="w-10 h-10 rounded-lg border-2 border-border shadow-sm cursor-pointer" style={{ background: value || "#000000" }} />
      </div>
      <Input value={value || ""} onChange={e => onChange(e.target.value)} placeholder="#000000" className="font-mono text-sm" />
    </div>
  </div>
);

function HeroPreview({ form, mode }: { form: any; mode: "desktop" | "mobile" }) {
  const bg = form.heroBgColor || "#0A1628";
  const gold = form.heroAccentColor || "#B8860B";
  const goldLt = form.heroAccentLightColor || "#D4A017";
  const showPhoto = form.heroShowPhoto !== false;
  const showBadge = form.heroShowFloatingBadge !== false;
  const photoUrl = form.heroPhotoUrl || "";
  const isMobile = mode === "mobile";
  const containerW = isMobile ? 375 : 900;
  const scaleTarget = isMobile ? 320 : 680;
  const scale = scaleTarget / containerW;
  const stats = form.heroStats || [{ value: "8+", labelEn: "Years" }, { value: "50+", labelEn: "Brands" }];

  return (
    <div className="flex justify-center">
      <div style={{ width: scaleTarget, height: isMobile ? 420 : 320, overflow: "hidden", borderRadius: 12 }}>
        <div style={{ width: containerW, height: isMobile ? 600 : 460, transform: `scale(${scale})`,
          transformOrigin: "top left", background: bg, position: "relative", overflow: "hidden", fontFamily: "system-ui, sans-serif" }}>
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "55%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 120 : 200, fontWeight: 900, color: gold, opacity: 0.04, userSelect: "none", overflow: "hidden" }}>
            الدباني
          </div>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
          <div style={{ display: "grid", gridTemplateColumns: showPhoto && !isMobile ? "1fr 200px" : "1fr",
            height: "100%", padding: isMobile ? "24px 20px" : "32px 40px", gap: 0, position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
                <p style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: gold, margin: 0 }}>
                  {form.heroBadgeEn || "Brand Manager"}
                </p>
              </div>
              <h1 style={{ margin: "0 0 6px", fontWeight: 900, color: "white", lineHeight: 1, fontSize: isMobile ? 28 : 40 }}>
                {form.heroTitleEn || "Mohammed Al-Dabbani"}
              </h1>
              <p style={{ margin: "0 0 10px", fontWeight: 700, color: gold, fontSize: isMobile ? 13 : 18 }}>
                {form.heroTitleAr || "محمد الدباني"}
              </p>
              <div style={{ width: 48, height: 2, borderRadius: 9999, marginBottom: 10,
                background: `linear-gradient(90deg, ${gold}, ${goldLt}, transparent)` }} />
              <p style={{ margin: "0 0 12px", fontSize: isMobile ? 9 : 11, color: "rgba(240,220,180,0.65)", lineHeight: 1.5, maxWidth: 280 }}>
                {form.heroSubtitleEn || "8+ years leading F&B brands…"}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                border: `1px solid ${gold}25`, borderRadius: 8, background: `${gold}08`, marginBottom: 12, overflow: "hidden" }}>
                {stats.map((st: any, i: number) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 4px",
                    borderRight: i < stats.length - 1 ? `1px solid ${gold}20` : "none" }}>
                    <span style={{ fontSize: isMobile ? 12 : 16, fontWeight: 900, color: goldLt }}>{st.value}</span>
                    <span style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase", color: `${gold}70`, marginTop: 2 }}>{st.labelEn}</span>
                  </div>
                ))}
              </div>
            </div>
            {showPhoto && !isMobile && (
              <div style={{ position: "relative", overflow: "hidden" }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", minHeight: 200, background: `${gold}15`,
                    display: "flex", alignItems: "center", justifyContent: "center", borderLeft: `1px solid ${gold}20` }}>
                    <span style={{ fontSize: 9, color: `${gold}80` }}>Photo will appear here</span>
                  </div>
                )}
                <div style={{ position: "absolute", inset: 0,
                  background: `linear-gradient(to right, ${bg} 0%, ${bg}80 15%, transparent 45%)` }} />
                {showBadge && (
                  <div style={{ position: "absolute", top: 16, right: 8, background: "rgba(10,22,40,0.92)",
                    borderRadius: 10, padding: "6px 10px", border: `1px solid ${gold}30`,
                    display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: goldLt }}>
                      {/* Note: since we store icon name, we render a generic icon in preview for simplicity or map it */}
                      <Coffee size={14} />
                    </span>
                    <div>
                      <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: "white" }}>{form.heroFloatingBadgeTitleEn || "Matcha Power"}</p>
                      <p style={{ margin: 0, fontSize: 7, color: `${gold}80` }}>{form.heroFloatingBadgeSubtitleEn || "Founder & CEO"}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [tab, setTab] = useState("sections");
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    fetch("/api/admin/settings", { headers: authHeaders() })
      .then(r => r.json())
      .then(d => { setForm(d ?? {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));
  const fStat = (i: number, k: string, v: string) => {
    const stats = [...(form.heroStats ?? [])];
    stats[i] = { ...stats[i], [k]: v };
    f("heroStats", stats);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      invalidateSiteSettingsCache();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  };

  // ── Array helpers ────────────────────────────────────────────────
  const addItem = (key: string, empty: any) =>
    f(key, [...(form[key] ?? []), empty]);
  const removeItem = (key: string, i: number) =>
    f(key, (form[key] ?? []).filter((_: any, idx: number) => idx !== i));
  const updateItem = (key: string, i: number, k: string, v: any) => {
    const arr = [...(form[key] ?? [])];
    arr[i] = { ...arr[i], [k]: v };
    f(key, arr);
  };
  const moveItem = (key: string, i: number, dir: -1 | 1) => {
    const arr = [...(form[key] ?? [])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    f(key, arr);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="grid gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-2xl border border-border/60 animate-pulse" />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">إعدادات الموقع</h1>
          <p className="text-sm text-muted-foreground mt-0.5">تحكم كامل بكل تفصيلة في موقعك</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saved ? <><CheckCircle2 size={15} /> تم الحفظ!</> : saving ? "جاري الحفظ…" : <><Save size={15} /> حفظ التغييرات</>}
        </Button>
      </div>

      {/* Tabs — horizontal scroll */}
      <div className="flex gap-1 bg-white border border-border/60 rounded-xl p-1 shadow-sm mb-5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              tab === id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}>
            <Icon size={12} />{label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTIONS — show/hide + bg colors
      ══════════════════════════════════════════════════════════ */}
      {tab === "sections" && (
        <>
          <Section title="إظهار وإخفاء الأقسام">
            <p className="text-xs text-muted-foreground mb-2">تحكم في أي قسم يظهر في الصفحة الرئيسية</p>
            <Toggle checked={form.showMarquee !== false}        onChange={v => f("showMarquee", v)}        label="الشريط المتحرك (Marquee)" />
            <Toggle checked={form.showExpertise !== false}      onChange={v => f("showExpertise", v)}      label="التخصصات الأساسية (Expertise)" />
            <Toggle checked={form.showSkills !== false}         onChange={v => f("showSkills", v)}         label="مستوى المهارات (Skills)" />
            <Toggle checked={form.showCareer !== false}         onChange={v => f("showCareer", v)}         label="المسيرة المهنية (Career Timeline)" />
            <Toggle checked={form.showFeaturedProject !== false} onChange={v => f("showFeaturedProject", v)} label="المشروع المميز (Featured Project)" />
            <Toggle checked={form.showContact !== false}        onChange={v => f("showContact", v)}        label="التواصل (Contact CTA)" />
            <Toggle checked={form.showPortfolioOnHome === true} onChange={v => f("showPortfolioOnHome", v)} label="عرض المشاريع في الصفحة الرئيسية (Portfolio Section)" />
          </Section>

          <Section title="الألوان العامة للأقسام">
            <p className="text-xs text-muted-foreground">هذه الألوان تتحكم في خلفية وتمييز كل أقسام الموقع</p>
            <Row2>
              <ColorField label="خلفية الأقسام الفاتحة" value={form.lightSectionBgColor ?? "#FAF6EF"} onChange={v => f("lightSectionBgColor", v)} />
              <ColorField label="خلفية الأقسام الداكنة" value={form.darkSectionBgColor ?? "#0A1628"} onChange={v => f("darkSectionBgColor", v)} />
            </Row2>
            <Row2>
              <ColorField label="لون الذهبي الأساسي" value={form.accentGoldColor ?? "#B8860B"} onChange={v => f("accentGoldColor", v)} />
              <ColorField label="لون الذهبي الفاتح" value={form.accentGoldLightColor ?? "#D4A017"} onChange={v => f("accentGoldLightColor", v)} />
            </Row2>
            {/* Preview strip */}
            <div className="mt-2 rounded-xl overflow-hidden border border-border">
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: form.lightSectionBgColor ?? "#FAF6EF", color: form.accentGoldColor ?? "#B8860B" }}>
                معاينة القسم الفاتح — {form.accentGoldColor ?? "#B8860B"}
              </div>
              <div className="px-5 py-3 text-xs font-bold uppercase tracking-widest"
                style={{ background: form.darkSectionBgColor ?? "#0A1628", color: form.accentGoldLightColor ?? "#D4A017" }}>
                معاينة القسم الداكن — {form.accentGoldLightColor ?? "#D4A017"}
              </div>
            </div>
          </Section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          HERO CONTENT
      ══════════════════════════════════════════════════════════ */}
      {tab === "hero" && (
        <>
          <Section title="العنوان الرئيسي">
            <Row2>
              <Field label="الاسم (إنجليزي)"><Input value={form.heroTitleEn ?? ""} onChange={e => f("heroTitleEn", e.target.value)} /></Field>
              <Field label="الاسم (عربي)"><Input value={form.heroTitleAr ?? ""} onChange={e => f("heroTitleAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="الشارة / المنصب (إنجليزي)"><Input value={form.heroBadgeEn ?? ""} onChange={e => f("heroBadgeEn", e.target.value)} /></Field>
              <Field label="الشارة / المنصب (عربي)"><Input value={form.heroBadgeAr ?? ""} onChange={e => f("heroBadgeAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="النص التوضيحي (إنجليزي)"><TextArea value={form.heroSubtitleEn ?? ""} onChange={v => f("heroSubtitleEn", v)} /></Field>
              <Field label="النص التوضيحي (عربي)"><TextArea value={form.heroSubtitleAr ?? ""} onChange={v => f("heroSubtitleAr", v)} dir="rtl" /></Field>
            </Row2>
          </Section>

          <Section title="الأرقام والإحصائيات">
            {(form.heroStats ?? []).map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <Field label={`رقم ${i + 1}`}><Input value={stat.value ?? ""} onChange={e => fStat(i, "value", e.target.value)} placeholder="8+" /></Field>
                <Field label="التسمية (EN)"><Input value={stat.labelEn ?? ""} onChange={e => fStat(i, "labelEn", e.target.value)} /></Field>
                <Field label="التسمية (AR)"><Input value={stat.labelAr ?? ""} onChange={e => fStat(i, "labelAr", e.target.value)} dir="rtl" /></Field>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          HERO DESIGN — with live preview
      ══════════════════════════════════════════════════════════ */}
      {tab === "herodesign" && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
          <div className="space-y-4">
            <Section title="الخلفية والألوان">
              <ColorField label="لون الخلفية" value={form.heroBgColor ?? "#0A1628"} onChange={v => f("heroBgColor", v)} />
              <Row2>
                <ColorField label="اللون الذهبي" value={form.heroAccentColor ?? "#B8860B"} onChange={v => f("heroAccentColor", v)} />
                <ColorField label="الذهبي الفاتح" value={form.heroAccentLightColor ?? "#D4A017"} onChange={v => f("heroAccentLightColor", v)} />
              </Row2>
            </Section>

            <Section title="الصورة الشخصية">
              <Toggle checked={form.heroShowPhoto !== false} onChange={v => f("heroShowPhoto", v)} label="إظهار الصورة على الديسكتوب" />
              {form.heroShowPhoto !== false && (
                <ImageUpload
                  label="الصورة الشخصية"
                  value={form.heroPhotoUrl ?? ""}
                  onChange={v => f("heroPhotoUrl", v)}
                  placeholder="اسحب وأفلت الصورة هنا أو انقر للرفع"
                />
              )}
            </Section>

            <Section title="الشارة العائمة (على الصورة)">
              <Toggle checked={form.heroShowFloatingBadge !== false} onChange={v => f("heroShowFloatingBadge", v)} label="إظهار الشارة العائمة" />
              {form.heroShowFloatingBadge !== false && (
                <>
                  <Field label="الأيقونة (Lucide Name)">
                    <Input value={form.heroFloatingBadgeEmoji ?? "Coffee"} onChange={e => f("heroFloatingBadgeEmoji", e.target.value)} className="w-full" placeholder="e.g. Coffee, Star" />
                  </Field>
                  <Row2>
                    <Field label="عنوان الشارة (EN)"><Input value={form.heroFloatingBadgeTitleEn ?? ""} onChange={e => f("heroFloatingBadgeTitleEn", e.target.value)} /></Field>
                    <Field label="عنوان الشارة (AR)"><Input value={form.heroFloatingBadgeTitleAr ?? ""} onChange={e => f("heroFloatingBadgeTitleAr", e.target.value)} dir="rtl" /></Field>
                  </Row2>
                  <Row2>
                    <Field label="نص الشارة (EN)"><Input value={form.heroFloatingBadgeSubtitleEn ?? ""} onChange={e => f("heroFloatingBadgeSubtitleEn", e.target.value)} /></Field>
                    <Field label="نص الشارة (AR)"><Input value={form.heroFloatingBadgeSubtitleAr ?? ""} onChange={e => f("heroFloatingBadgeSubtitleAr", e.target.value)} dir="rtl" /></Field>
                  </Row2>
                </>
              )}
            </Section>
          </div>

          {/* Live Preview */}
          <div className="sticky top-4">
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <span className="font-semibold text-sm text-foreground">معاينة مباشرة</span>
                <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                  <button onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${previewMode === "desktop" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                    <Monitor size={12} /> ديسكتوب
                  </button>
                  <button onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${previewMode === "mobile" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                    <Smartphone size={12} /> موبايل
                  </button>
                </div>
              </div>
              <div className="p-4 bg-zinc-100">
                <HeroPreview form={form} mode={previewMode} />
              </div>
              <div className="px-5 py-3 border-t border-border/60 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">التغييرات تظهر مباشرة · احفظ لتطبيقها على الموقع</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MARQUEE
      ══════════════════════════════════════════════════════════ */}
      {tab === "marquee" && (
        <Section title="عناصر الشريط المتحرك">
          <p className="text-xs text-muted-foreground mb-2">هذه النصوص تتحرك في الشريط أسفل الهيرو</p>
          {(form.marqueeItems ?? []).map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-2 p-3 bg-muted/20 rounded-xl border border-border/40">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveItem("marqueeItems", i, -1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronUp size={13} /></button>
                <button onClick={() => moveItem("marqueeItems", i, 1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronDown size={13} /></button>
              </div>
              <Input value={item.en ?? ""} onChange={e => updateItem("marqueeItems", i, "en", e.target.value)} placeholder="English" className="flex-1 text-sm" />
              <Input value={item.ar ?? ""} onChange={e => updateItem("marqueeItems", i, "ar", e.target.value)} placeholder="العربية" dir="rtl" className="flex-1 text-sm" />
              <button onClick={() => removeItem("marqueeItems", i)} className="text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 size={14} /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => addItem("marqueeItems", { en: "", ar: "" })}>
            <Plus size={13} /> إضافة عنصر
          </Button>
        </Section>
      )}

      {/* ══════════════════════════════════════════════════════════
          EXPERTISE
      ══════════════════════════════════════════════════════════ */}
      {tab === "expertise" && (
        <div className="space-y-4">
          {(form.expertiseItems ?? []).map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveItem("expertiseItems", i, -1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronUp size={13} /></button>
                    <button onClick={() => moveItem("expertiseItems", i, 1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronDown size={13} /></button>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.icon || "Pin"}</span>
                  <span className="font-semibold text-sm">{item.titleEn || `تخصص ${i + 1}`}</span>
                </div>
                <button onClick={() => removeItem("expertiseItems", i)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid gap-3">
                <Field label="الأيقونة (Lucide Name)">
                  <Input value={item.icon ?? ""} onChange={e => updateItem("expertiseItems", i, "icon", e.target.value)} placeholder="e.g. Pin, Star" className="w-full" />
                </Field>
                <Row2>
                  <Field label="العنوان (EN)"><Input value={item.titleEn ?? ""} onChange={e => updateItem("expertiseItems", i, "titleEn", e.target.value)} /></Field>
                  <Field label="العنوان (AR)"><Input value={item.titleAr ?? ""} onChange={e => updateItem("expertiseItems", i, "titleAr", e.target.value)} dir="rtl" /></Field>
                </Row2>
                <Row2>
                  <Field label="الوصف (EN)"><TextArea value={item.descEn ?? ""} onChange={v => updateItem("expertiseItems", i, "descEn", v)} rows={2} /></Field>
                  <Field label="الوصف (AR)"><TextArea value={item.descAr ?? ""} onChange={v => updateItem("expertiseItems", i, "descAr", v)} dir="rtl" rows={2} /></Field>
                </Row2>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-1.5 w-full" onClick={() => addItem("expertiseItems", { icon: "Pin", titleEn: "", titleAr: "", descEn: "", descAr: "" })}>
            <Plus size={14} /> إضافة تخصص جديد
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          SKILLS
      ══════════════════════════════════════════════════════════ */}
      {tab === "skills" && (
        <Section title="شرائط المهارات">
          <div className="space-y-3">
            {(form.skillItems ?? []).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl border border-border/40">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveItem("skillItems", i, -1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronUp size={13} /></button>
                  <button onClick={() => moveItem("skillItems", i, 1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronDown size={13} /></button>
                </div>
                <Input value={item.labelEn ?? ""} onChange={e => updateItem("skillItems", i, "labelEn", e.target.value)} placeholder="English label" className="flex-1 text-sm" />
                <Input value={item.labelAr ?? ""} onChange={e => updateItem("skillItems", i, "labelAr", e.target.value)} placeholder="التسمية بالعربية" dir="rtl" className="flex-1 text-sm" />
                <div className="flex items-center gap-1 w-28">
                  <input type="range" min={0} max={100} value={item.pct ?? 80}
                    onChange={e => updateItem("skillItems", i, "pct", +e.target.value)}
                    className="flex-1 accent-primary" />
                  <span className="text-xs font-mono w-8 text-right">{item.pct ?? 80}%</span>
                </div>
                <button onClick={() => removeItem("skillItems", i)} className="text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 mt-2" onClick={() => addItem("skillItems", { labelEn: "", labelAr: "", pct: 80 })}>
            <Plus size={13} /> إضافة مهارة
          </Button>
        </Section>
      )}

      {/* ══════════════════════════════════════════════════════════
          CAREER
      ══════════════════════════════════════════════════════════ */}
      {tab === "career" && (
        <div className="space-y-4">
          {(form.careerItems ?? []).map((item: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => moveItem("careerItems", i, -1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronUp size={13} /></button>
                    <button onClick={() => moveItem("careerItems", i, 1)} className="text-muted-foreground hover:text-foreground p-0.5"><ChevronDown size={13} /></button>
                  </div>
                  <span className="font-semibold text-sm">{item.titleEn || `منصب ${i + 1}`}</span>
                  {item.current && <span className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">حالي</span>}
                </div>
                <button onClick={() => removeItem("careerItems", i)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid gap-3">
                <Field label="الفترة الزمنية">
                  <Input value={item.year ?? ""} onChange={e => updateItem("careerItems", i, "year", e.target.value)} placeholder="2025 – Present" />
                </Field>
                <Row2>
                  <Field label="المنصب (EN)"><Input value={item.titleEn ?? ""} onChange={e => updateItem("careerItems", i, "titleEn", e.target.value)} /></Field>
                  <Field label="المنصب (AR)"><Input value={item.titleAr ?? ""} onChange={e => updateItem("careerItems", i, "titleAr", e.target.value)} dir="rtl" /></Field>
                </Row2>
                <Field label="اسم الشركة / المؤسسة">
                  <Input value={item.org ?? ""} onChange={e => updateItem("careerItems", i, "org", e.target.value)} />
                </Field>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={!!item.current} onChange={e => updateItem("careerItems", i, "current", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <Label>المنصب الحالي</Label>
                </div>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-1.5 w-full" onClick={() => addItem("careerItems", { year: "", titleEn: "", titleAr: "", org: "", current: false })}>
            <Plus size={14} /> إضافة منصب جديد
          </Button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          FEATURED PROJECT
      ══════════════════════════════════════════════════════════ */}
      {tab === "featured" && (
        <>
          <Section title="عنوان ووصف المشروع المميز">
            <Row2>
              <Field label="العنوان (EN)"><Input value={form.featuredTitleEn ?? ""} onChange={e => f("featuredTitleEn", e.target.value)} /></Field>
              <Field label="العنوان (AR)"><Input value={form.featuredTitleAr ?? ""} onChange={e => f("featuredTitleAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="عنوان القسم (EN)"><Input value={form.featuredSubtitleEn ?? ""} onChange={e => f("featuredSubtitleEn", e.target.value)} placeholder="Entrepreneurial Venture" /></Field>
              <Field label="عنوان القسم (AR)"><Input value={form.featuredSubtitleAr ?? ""} onChange={e => f("featuredSubtitleAr", e.target.value)} dir="rtl" placeholder="المشروع الريادي" /></Field>
            </Row2>
            <Row2>
              <Field label="الوصف (EN)"><TextArea value={form.featuredDescEn ?? ""} onChange={v => f("featuredDescEn", v)} /></Field>
              <Field label="الوصف (AR)"><TextArea value={form.featuredDescAr ?? ""} onChange={v => f("featuredDescAr", v)} dir="rtl" /></Field>
            </Row2>
          </Section>

          <Section title="التفاصيل">
            <Field label="الأيقونة (Lucide Name)">
              <Input value={form.featuredEmoji ?? "Coffee"} onChange={e => f("featuredEmoji", e.target.value)} className="w-full" placeholder="e.g. Coffee, Star" />
            </Field>
            <Row2>
              <Field label="الدور (EN)"><Input value={form.featuredRoleEn ?? ""} onChange={e => f("featuredRoleEn", e.target.value)} placeholder="Founder & CEO" /></Field>
              <Field label="الدور (AR)"><Input value={form.featuredRoleAr ?? ""} onChange={e => f("featuredRoleAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="التاريخ (EN)"><Input value={form.featuredDateEn ?? ""} onChange={e => f("featuredDateEn", e.target.value)} placeholder="May 2025 – May 2026" /></Field>
              <Field label="التاريخ (AR)"><Input value={form.featuredDateAr ?? ""} onChange={e => f("featuredDateAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
          </Section>

          <Section title="الوسوم (Tags)">
            <div className="flex flex-wrap gap-2 mb-2">
              {(form.featuredTags ?? []).map((tag: string, i: number) => (
                <div key={i} className="flex items-center gap-1 bg-muted rounded-lg px-2 py-1 text-xs">
                  <span>{tag}</span>
                  <button onClick={() => f("featuredTags", (form.featuredTags ?? []).filter((_: string, idx: number) => idx !== i))}
                    className="text-muted-foreground hover:text-destructive"><X size={11} /></button>
                </div>
              ))}
            </div>
            <AddTagInput onAdd={(tag) => f("featuredTags", [...(form.featuredTags ?? []), tag])} />
          </Section>

          <Section title="الإحصائيات (Stats)">
            {(form.featuredStats ?? []).map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-muted/20 rounded-xl border border-border/40">
                <Input value={item.num ?? ""} onChange={e => updateItem("featuredStats", i, "num", e.target.value)} placeholder="0→1" className="w-20 text-sm font-mono" />
                <Input value={item.labelEn ?? ""} onChange={e => updateItem("featuredStats", i, "labelEn", e.target.value)} placeholder="Label EN" className="flex-1 text-sm" />
                <Input value={item.labelAr ?? ""} onChange={e => updateItem("featuredStats", i, "labelAr", e.target.value)} placeholder="تسمية AR" dir="rtl" className="flex-1 text-sm" />
                <button onClick={() => removeItem("featuredStats", i)} className="text-muted-foreground hover:text-destructive p-1 rounded"><Trash2 size={14} /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => addItem("featuredStats", { num: "", labelEn: "", labelAr: "" })}>
              <Plus size={13} /> إضافة إحصائية
            </Button>
          </Section>

          <Section title="صورة المشروع المميز (اختياري)">
            <ImageUpload
              value={form.featuredImageUrl ?? ""}
              onChange={v => f("featuredImageUrl", v)}
              placeholder="اسحب وأفلت صورة المشروع أو انقر للرفع"
            />
          </Section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════ */}
      {tab === "about" && (
        <Section title="قسم نبذة عني">
          <Row2>
            <Field label="النبذة الشخصية (EN)"><TextArea value={form.aboutBioEn ?? ""} onChange={v => f("aboutBioEn", v)} rows={5} /></Field>
            <Field label="النبذة الشخصية (AR)"><TextArea value={form.aboutBioAr ?? ""} onChange={v => f("aboutBioAr", v)} dir="rtl" rows={5} /></Field>
          </Row2>
          <Field label="سنوات الخبرة">
            <Input type="number" value={form.experienceYears ?? 8} onChange={e => f("experienceYears", +e.target.value)} className="max-w-[120px]" />
          </Field>
        </Section>
      )}

      {/* ══════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════ */}
      {tab === "contact" && (
        <>
          <Section title="معلومات التواصل">
            <Row2>
              <Field label="البريد الإلكتروني"><Input type="email" value={form.email ?? ""} onChange={e => f("email", e.target.value)} /></Field>
              <Field label="رقم الهاتف"><Input value={form.phone ?? ""} onChange={e => f("phone", e.target.value)} placeholder="+966 5x xxx xxxx" /></Field>
            </Row2>
            <Field label="العنوان"><Input value={form.address ?? ""} onChange={e => f("address", e.target.value)} placeholder="Riyadh, Saudi Arabia" /></Field>
          </Section>
          <Section title="روابط السوشيال ميديا">
            <Row2>
              <Field label="واتساب"><Input value={form.whatsapp ?? ""} onChange={e => f("whatsapp", e.target.value)} placeholder="+966 5x xxx xxxx" /></Field>
              <Field label="لينكد إن"><Input value={form.linkedin ?? ""} onChange={e => f("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            </Row2>
            <Row2>
              <Field label="تويتر / X"><Input value={form.twitter ?? ""} onChange={e => f("twitter", e.target.value)} placeholder="https://x.com/..." /></Field>
              <Field label="إنستغرام"><Input value={form.instagram ?? ""} onChange={e => f("instagram", e.target.value)} placeholder="https://instagram.com/..." /></Field>
            </Row2>
          </Section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          BRANDING
      ══════════════════════════════════════════════════════════ */}
      {tab === "branding" && (
        <>
          <Section title="هوية الموقع">
            <Row2>
              <Field label="اسم الموقع (EN)"><Input value={form.siteNameEn ?? ""} onChange={e => f("siteNameEn", e.target.value)} /></Field>
              <Field label="اسم الموقع (AR)"><Input value={form.siteNameAr ?? ""} onChange={e => f("siteNameAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="الشعار الوصفي (EN)"><Input value={form.taglineEn ?? ""} onChange={e => f("taglineEn", e.target.value)} /></Field>
              <Field label="الشعار الوصفي (AR)"><Input value={form.taglineAr ?? ""} onChange={e => f("taglineAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <ImageUpload
              label="شعار الموقع (Logo)"
              value={form.logoUrl ?? ""}
              onChange={v => f("logoUrl", v)}
              placeholder="اسحب وأفلت الشعار أو انقر للرفع"
            />
          </Section>

          <Section title="نص الفوتر">
            <Row2>
              <Field label="نص الفوتر (EN)"><Input value={form.footerTextEn ?? ""} onChange={e => f("footerTextEn", e.target.value)} /></Field>
              <Field label="نص الفوتر (AR)"><Input value={form.footerTextAr ?? ""} onChange={e => f("footerTextAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
          </Section>
        </>
      )}

      {/* Floating Save */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg gap-2">
          {saved ? <><CheckCircle2 size={16} /> تم الحفظ!</> : saving ? "جاري الحفظ…" : <><Save size={16} /> حفظ التغييرات</>}
        </Button>
      </div>
    </AdminLayout>
  );
}

// Small helper for adding tags inline
function AddTagInput({ onAdd }: { onAdd: (tag: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2">
      <Input value={v} onChange={e => setV(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && v.trim()) { onAdd(v.trim()); setV(""); } }}
        placeholder="اكتب وسم واضغط Enter…" className="flex-1 text-sm" />
      <Button variant="outline" size="sm" onClick={() => { if (v.trim()) { onAdd(v.trim()); setV(""); } }}>
        <Plus size={13} />
      </Button>
    </div>
  );
}

