import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Save, Globe, User, Phone, Palette, LayoutTemplate,
  CheckCircle2, Monitor, Smartphone, Image, Eye, EyeOff,
} from "lucide-react";

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

const TABS = [
  { id: "hero",       label: "Hero Content",  icon: LayoutTemplate },
  { id: "herodesign", label: "Hero Design",   icon: Palette },
  { id: "about",      label: "About",         icon: User },
  { id: "contact",    label: "Contact & Social", icon: Phone },
  { id: "branding",   label: "Branding",      icon: Globe },
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

const TextArea = ({ value, onChange, dir }: { value: string; onChange: (v: string) => void; dir?: string }) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    dir={dir}
    rows={3}
    className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
  />
);

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) => (
  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/40">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  </div>
);

const ColorField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div className="grid gap-1.5">
    <Label className="text-sm text-muted-foreground">{label}</Label>
    <div className="flex items-center gap-2">
      <div className="relative">
        <input
          type="color"
          value={value || "#000000"}
          onChange={e => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div className="w-10 h-10 rounded-lg border-2 border-border shadow-sm cursor-pointer"
          style={{ background: value || "#000000" }} />
      </div>
      <Input
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="#000000"
        className="font-mono text-sm"
      />
    </div>
  </div>
);

function HeroPreview({ form, mode }: { form: any; mode: "desktop" | "mobile" }) {
  const bg     = form.heroBgColor        || "#0A1628";
  const gold   = form.heroAccentColor    || "#B8860B";
  const goldLt = form.heroAccentLightColor || "#D4A017";
  const showPhoto  = form.heroShowPhoto !== false;
  const showBadge  = form.heroShowFloatingBadge !== false;
  const photoUrl   = form.heroPhotoUrl || "";
  const badgeEmoji = form.heroFloatingBadgeEmoji || "🍵";
  const badgeTitle = form.heroFloatingBadgeTitleEn || "Matcha Power";
  const badgeSub   = form.heroFloatingBadgeSubtitleEn || "Founder & CEO";
  const title      = form.heroTitleEn  || "Mohammed Al-Dabbani";
  const badge      = form.heroBadgeEn  || "Brand Manager · Business Development";
  const subtitle   = form.heroSubtitleEn || "8+ years leading F&B brands...";
  const stats      = form.heroStats || [
    { value: "8+", labelEn: "Years" },
    { value: "50+", labelEn: "Brands" },
    { value: "2M+", labelEn: "Customers" },
    { value: "3", labelEn: "Industries" },
  ];

  const isMobile = mode === "mobile";
  const containerW = isMobile ? 375 : 900;
  const scaleTarget = isMobile ? 320 : 680;
  const scale = scaleTarget / containerW;

  return (
    <div className="flex justify-center">
      <div style={{ width: scaleTarget, height: isMobile ? 420 : 320, overflow: "hidden", borderRadius: 12 }}>
        <div style={{
          width: containerW,
          height: isMobile ? 600 : 460,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          background: bg,
          position: "relative",
          overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
        }}>
          {/* Arabic watermark */}
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0, width: "55%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isMobile ? 120 : 200, fontWeight: 900, color: gold,
            opacity: 0.04, userSelect: "none", overflow: "hidden",
            letterSpacing: -6,
          }}>الدباني</div>

          {/* top gold line */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

          {/* content grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: showPhoto && !isMobile ? "1fr 200px" : "1fr",
            height: "100%",
            padding: isMobile ? "24px 20px" : "32px 40px",
            gap: 0,
            position: "relative", zIndex: 1,
          }}>
            {/* text col */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
              {/* badge pill */}
              <div style={{ display: "inline-flex", marginBottom: 12,
                background: "white", borderRadius: 8, padding: "4px 10px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)", width: "fit-content" }}>
                <div style={{ width: 20, height: 20, background: `${gold}20`, borderRadius: 4 }} />
              </div>

              {/* role badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 24, height: 1, background: gold, flexShrink: 0 }} />
                <p style={{ fontSize: 8, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.3em", color: gold, margin: 0 }}>{badge}</p>
              </div>

              {/* name */}
              <div style={{ marginBottom: 10 }}>
                <h1 style={{ margin: 0, fontWeight: 900, color: "white", lineHeight: 1,
                  fontSize: isMobile ? 28 : 40 }}>{title}</h1>
                <p style={{ margin: "6px 0 0", fontWeight: 700, color: gold,
                  fontSize: isMobile ? 13 : 18 }}>{title.includes("Al") ? "محمد الدباني" : title}</p>
              </div>

              {/* separator */}
              <div style={{ width: 48, height: 2, borderRadius: 9999, marginBottom: 10,
                background: `linear-gradient(90deg, ${gold}, ${goldLt}, transparent)` }} />

              {/* subtitle */}
              <p style={{ margin: "0 0 12px", fontSize: isMobile ? 9 : 11,
                color: "rgba(240,220,180,0.65)", lineHeight: 1.5, maxWidth: 280 }}>{subtitle}</p>

              {/* stats */}
              <div style={{
                display: "grid", gridTemplateColumns: `repeat(${stats.length}, 1fr)`,
                border: `1px solid ${gold}25`, borderRadius: 8,
                background: `${gold}08`, marginBottom: 12, overflow: "hidden",
              }}>
                {stats.map((st: any, i: number) => (
                  <div key={i} style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    padding: "6px 4px",
                    borderRight: i < stats.length - 1 ? `1px solid ${gold}20` : "none",
                  }}>
                    <span style={{ fontSize: isMobile ? 12 : 16, fontWeight: 900, color: goldLt }}>{st.value}</span>
                    <span style={{ fontSize: 7, fontWeight: 700, textTransform: "uppercase",
                      color: `${gold}70`, marginTop: 2 }}>{st.labelEn}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ height: 28, borderRadius: 8, padding: "0 16px",
                  background: `linear-gradient(135deg, ${gold}, ${goldLt})`,
                  display: "flex", alignItems: "center",
                  fontSize: 9, fontWeight: 700, color: bg }}>Book a Consultation</div>
                <div style={{ height: 28, borderRadius: 8, padding: "0 16px",
                  border: `1px solid ${gold}40`,
                  display: "flex", alignItems: "center",
                  fontSize: 9, fontWeight: 700, color: "rgba(240,220,180,0.75)" }}>My Profile</div>
              </div>
            </div>

            {/* photo col */}
            {showPhoto && !isMobile && (
              <div style={{ position: "relative", overflow: "hidden" }}>
                {photoUrl ? (
                  <img src={photoUrl} alt="" style={{ width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%", minHeight: 200,
                    background: `${gold}15`,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 8,
                    borderLeft: `1px solid ${gold}20`,
                  }}>
                    <Image size={28} color={gold} />
                    <span style={{ fontSize: 9, color: `${gold}80`, textAlign: "center" }}>
                      Photo will appear here
                    </span>
                  </div>
                )}
                {/* gradient overlay */}
                <div style={{ position: "absolute", inset: 0,
                  background: `linear-gradient(to right, ${bg} 0%, ${bg}80 15%, transparent 45%)` }} />
                {/* floating badge */}
                {showBadge && (
                  <div style={{
                    position: "absolute", top: 16, right: 8,
                    background: "rgba(10,22,40,0.92)", borderRadius: 10,
                    padding: "6px 10px", border: `1px solid ${gold}30`,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ fontSize: 14 }}>{badgeEmoji}</span>
                    <div>
                      <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: "white" }}>{badgeTitle}</p>
                      <p style={{ margin: 0, fontSize: 7, color: `${gold}80` }}>{badgeSub}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* bottom gold line */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${gold}50, transparent)` }} />
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [tab, setTab] = useState("hero");
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
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
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
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Control every detail of your website from here.</p>
        </div>
        <Button onClick={save} disabled={saving} className="gap-2">
          {saved ? <><CheckCircle2 size={15} /> Saved!</> : saving ? "Saving…" : <><Save size={15} /> Save Changes</>}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-border/60 rounded-xl p-1 shadow-sm mb-5 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center ${
              tab === id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── HERO CONTENT TAB ── */}
      {tab === "hero" && (
        <>
          <Section title="Hero Headline">
            <Row2>
              <Field label="Title (English)"><Input value={form.heroTitleEn ?? ""} onChange={e => f("heroTitleEn", e.target.value)} /></Field>
              <Field label="Title (Arabic)"><Input value={form.heroTitleAr ?? ""} onChange={e => f("heroTitleAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Role Badge (English)"><Input value={form.heroBadgeEn ?? ""} onChange={e => f("heroBadgeEn", e.target.value)} placeholder="Brand Manager · Business Development" /></Field>
              <Field label="Role Badge (Arabic)"><Input value={form.heroBadgeAr ?? ""} onChange={e => f("heroBadgeAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Subtitle (English)"><TextArea value={form.heroSubtitleEn ?? ""} onChange={v => f("heroSubtitleEn", v)} /></Field>
              <Field label="Subtitle (Arabic)"><TextArea value={form.heroSubtitleAr ?? ""} onChange={v => f("heroSubtitleAr", v)} dir="rtl" /></Field>
            </Row2>
          </Section>

          <Section title="Stats Numbers">
            {(form.heroStats ?? []).map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <Field label={`Stat ${i + 1} — Value`}><Input value={stat.value ?? ""} onChange={e => fStat(i, "value", e.target.value)} placeholder="8+" /></Field>
                <Field label="Label (EN)"><Input value={stat.labelEn ?? ""} onChange={e => fStat(i, "labelEn", e.target.value)} placeholder="Years" /></Field>
                <Field label="Label (AR)"><Input value={stat.labelAr ?? ""} onChange={e => fStat(i, "labelAr", e.target.value)} dir="rtl" placeholder="سنوات" /></Field>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* ── HERO DESIGN TAB ── */}
      {tab === "herodesign" && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5 items-start">
          {/* Controls */}
          <div className="space-y-4">
            <Section title="Background & Colors">
              <ColorField label="Background Color" value={form.heroBgColor ?? "#0A1628"} onChange={v => f("heroBgColor", v)} />
              <Row2>
                <ColorField label="Accent / Gold Color" value={form.heroAccentColor ?? "#B8860B"} onChange={v => f("heroAccentColor", v)} />
                <ColorField label="Accent Light" value={form.heroAccentLightColor ?? "#D4A017"} onChange={v => f("heroAccentLightColor", v)} />
              </Row2>
            </Section>

            <Section title="Photo">
              <Toggle
                checked={form.heroShowPhoto !== false}
                onChange={v => f("heroShowPhoto", v)}
                label="Show photo on desktop"
              />
              {form.heroShowPhoto !== false && (
                <Field label="Custom Photo URL (leave blank to use default)">
                  <Input
                    value={form.heroPhotoUrl ?? ""}
                    onChange={e => f("heroPhotoUrl", e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              )}
            </Section>

            <Section title="Floating Badge (on photo)">
              <Toggle
                checked={form.heroShowFloatingBadge !== false}
                onChange={v => f("heroShowFloatingBadge", v)}
                label="Show floating badge"
              />
              {form.heroShowFloatingBadge !== false && (
                <>
                  <Field label="Emoji">
                    <Input value={form.heroFloatingBadgeEmoji ?? "🍵"} onChange={e => f("heroFloatingBadgeEmoji", e.target.value)} placeholder="🍵" className="text-2xl w-20" />
                  </Field>
                  <Row2>
                    <Field label="Badge Title (EN)"><Input value={form.heroFloatingBadgeTitleEn ?? ""} onChange={e => f("heroFloatingBadgeTitleEn", e.target.value)} /></Field>
                    <Field label="Badge Title (AR)"><Input value={form.heroFloatingBadgeTitleAr ?? ""} onChange={e => f("heroFloatingBadgeTitleAr", e.target.value)} dir="rtl" /></Field>
                  </Row2>
                  <Row2>
                    <Field label="Badge Subtitle (EN)"><Input value={form.heroFloatingBadgeSubtitleEn ?? ""} onChange={e => f("heroFloatingBadgeSubtitleEn", e.target.value)} /></Field>
                    <Field label="Badge Subtitle (AR)"><Input value={form.heroFloatingBadgeSubtitleAr ?? ""} onChange={e => f("heroFloatingBadgeSubtitleAr", e.target.value)} dir="rtl" /></Field>
                  </Row2>
                </>
              )}
            </Section>
          </div>

          {/* Live Preview */}
          <div className="sticky top-4">
            <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <span className="font-semibold text-sm text-foreground">Live Preview</span>
                <div className="flex gap-1 bg-muted rounded-lg p-0.5">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      previewMode === "desktop" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Monitor size={12} /> Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode("mobile")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      previewMode === "mobile" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    <Smartphone size={12} /> Mobile
                  </button>
                </div>
              </div>

              <div className="p-4 bg-zinc-100">
                <HeroPreview form={form} mode={previewMode} />
              </div>

              <div className="px-5 py-3 border-t border-border/60 bg-muted/30">
                <p className="text-xs text-muted-foreground text-center">
                  Changes appear live · Save to apply to your website
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ABOUT TAB ── */}
      {tab === "about" && (
        <Section title="About Section">
          <Row2>
            <Field label="Bio (English)"><TextArea value={form.aboutBioEn ?? ""} onChange={v => f("aboutBioEn", v)} /></Field>
            <Field label="Bio (Arabic)"><TextArea value={form.aboutBioAr ?? ""} onChange={v => f("aboutBioAr", v)} dir="rtl" /></Field>
          </Row2>
          <Field label="Years of Experience">
            <Input type="number" value={form.experienceYears ?? 8} onChange={e => f("experienceYears", +e.target.value)} className="max-w-[120px]" />
          </Field>
        </Section>
      )}

      {/* ── CONTACT TAB ── */}
      {tab === "contact" && (
        <>
          <Section title="Contact Information">
            <Row2>
              <Field label="Email"><Input type="email" value={form.email ?? ""} onChange={e => f("email", e.target.value)} /></Field>
              <Field label="Phone"><Input value={form.phone ?? ""} onChange={e => f("phone", e.target.value)} placeholder="+966 5x xxx xxxx" /></Field>
            </Row2>
            <Field label="Address"><Input value={form.address ?? ""} onChange={e => f("address", e.target.value)} placeholder="Riyadh, Saudi Arabia" /></Field>
          </Section>
          <Section title="Social Media Links">
            <Row2>
              <Field label="WhatsApp"><Input value={form.whatsapp ?? ""} onChange={e => f("whatsapp", e.target.value)} placeholder="+966 5x xxx xxxx" /></Field>
              <Field label="LinkedIn URL"><Input value={form.linkedin ?? ""} onChange={e => f("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            </Row2>
            <Row2>
              <Field label="Twitter / X URL"><Input value={form.twitter ?? ""} onChange={e => f("twitter", e.target.value)} placeholder="https://x.com/..." /></Field>
              <Field label="Instagram URL"><Input value={form.instagram ?? ""} onChange={e => f("instagram", e.target.value)} placeholder="https://instagram.com/..." /></Field>
            </Row2>
          </Section>
        </>
      )}

      {/* ── BRANDING TAB ── */}
      {tab === "branding" && (
        <>
          <Section title="Site Identity">
            <Row2>
              <Field label="Site Name (EN)"><Input value={form.siteNameEn ?? ""} onChange={e => f("siteNameEn", e.target.value)} /></Field>
              <Field label="Site Name (AR)"><Input value={form.siteNameAr ?? ""} onChange={e => f("siteNameAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Tagline (EN)"><Input value={form.taglineEn ?? ""} onChange={e => f("taglineEn", e.target.value)} /></Field>
              <Field label="Tagline (AR)"><Input value={form.taglineAr ?? ""} onChange={e => f("taglineAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Field label="Logo URL"><Input value={form.logoUrl ?? ""} onChange={e => f("logoUrl", e.target.value)} placeholder="https://..." /></Field>
          </Section>
          <Section title="Footer Text">
            <Row2>
              <Field label="Footer Tagline (EN)"><Input value={form.footerTextEn ?? ""} onChange={e => f("footerTextEn", e.target.value)} /></Field>
              <Field label="Footer Tagline (AR)"><Input value={form.footerTextAr ?? ""} onChange={e => f("footerTextAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
          </Section>
        </>
      )}

      {/* Floating Save */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={save} disabled={saving} size="lg" className="shadow-lg gap-2">
          {saved ? <><CheckCircle2 size={16} /> Saved!</> : saving ? "Saving…" : <><Save size={16} /> Save Changes</>}
        </Button>
      </div>
    </AdminLayout>
  );
}
