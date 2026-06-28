import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Globe, User, Phone, Palette, LayoutTemplate, CheckCircle2 } from "lucide-react";

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

const TABS = [
  { id: "hero", label: "Hero Section", icon: LayoutTemplate },
  { id: "about", label: "About", icon: User },
  { id: "contact", label: "Contact & Social", icon: Phone },
  { id: "branding", label: "Branding", icon: Palette },
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

export default function AdminSettings() {
  const [tab, setTab] = useState("hero");
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
          <p className="text-sm text-muted-foreground mt-0.5">Control every detail of your website content from here.</p>
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

      {/* Hero Tab */}
      {tab === "hero" && (
        <>
          <Section title="Hero Headline">
            <Row2>
              <Field label="Title (English)"><Input value={form.heroTitleEn ?? ""} onChange={e => f("heroTitleEn", e.target.value)} /></Field>
              <Field label="Title (Arabic)"><Input value={form.heroTitleAr ?? ""} onChange={e => f("heroTitleAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Badge / Role (English)"><Input value={form.heroBadgeEn ?? ""} onChange={e => f("heroBadgeEn", e.target.value)} placeholder="Brand Manager · Business Development" /></Field>
              <Field label="Badge / Role (Arabic)"><Input value={form.heroBadgeAr ?? ""} onChange={e => f("heroBadgeAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Subtitle (English)"><TextArea value={form.heroSubtitleEn ?? ""} onChange={v => f("heroSubtitleEn", v)} /></Field>
              <Field label="Subtitle (Arabic)"><TextArea value={form.heroSubtitleAr ?? ""} onChange={v => f("heroSubtitleAr", v)} dir="rtl" /></Field>
            </Row2>
          </Section>

          <Section title="Hero Stats (Numbers)">
            {(form.heroStats ?? []).map((stat: any, i: number) => (
              <div key={i} className="grid grid-cols-3 gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <Field label={`Stat ${i + 1} — Value`}><Input value={stat.value ?? ""} onChange={e => fStat(i, "value", e.target.value)} placeholder="7+" /></Field>
                <Field label="Label (EN)"><Input value={stat.labelEn ?? ""} onChange={e => fStat(i, "labelEn", e.target.value)} placeholder="Years" /></Field>
                <Field label="Label (AR)"><Input value={stat.labelAr ?? ""} onChange={e => fStat(i, "labelAr", e.target.value)} dir="rtl" placeholder="سنوات" /></Field>
              </div>
            ))}
          </Section>
        </>
      )}

      {/* About Tab */}
      {tab === "about" && (
        <Section title="About Section">
          <Row2>
            <Field label="Bio / Description (English)"><TextArea value={form.aboutBioEn ?? ""} onChange={v => f("aboutBioEn", v)} /></Field>
            <Field label="Bio / Description (Arabic)"><TextArea value={form.aboutBioAr ?? ""} onChange={v => f("aboutBioAr", v)} dir="rtl" /></Field>
          </Row2>
          <Field label="Years of Experience">
            <Input type="number" value={form.experienceYears ?? 8} onChange={e => f("experienceYears", +e.target.value)} className="max-w-[120px]" />
          </Field>
        </Section>
      )}

      {/* Contact Tab */}
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
              <Field label="WhatsApp Number"><Input value={form.whatsapp ?? ""} onChange={e => f("whatsapp", e.target.value)} placeholder="+966 5x xxx xxxx" /></Field>
              <Field label="LinkedIn URL"><Input value={form.linkedin ?? ""} onChange={e => f("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></Field>
            </Row2>
            <Row2>
              <Field label="Twitter / X URL"><Input value={form.twitter ?? ""} onChange={e => f("twitter", e.target.value)} placeholder="https://x.com/..." /></Field>
              <Field label="Instagram URL"><Input value={form.instagram ?? ""} onChange={e => f("instagram", e.target.value)} placeholder="https://instagram.com/..." /></Field>
            </Row2>
          </Section>
        </>
      )}

      {/* Branding Tab */}
      {tab === "branding" && (
        <>
          <Section title="Site Identity">
            <Row2>
              <Field label="Site Name (English)"><Input value={form.siteNameEn ?? ""} onChange={e => f("siteNameEn", e.target.value)} /></Field>
              <Field label="Site Name (Arabic)"><Input value={form.siteNameAr ?? ""} onChange={e => f("siteNameAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Row2>
              <Field label="Tagline (English)"><Input value={form.taglineEn ?? ""} onChange={e => f("taglineEn", e.target.value)} /></Field>
              <Field label="Tagline (Arabic)"><Input value={form.taglineAr ?? ""} onChange={e => f("taglineAr", e.target.value)} dir="rtl" /></Field>
            </Row2>
            <Field label="Logo URL (paste image URL or upload path)"><Input value={form.logoUrl ?? ""} onChange={e => f("logoUrl", e.target.value)} placeholder="https://..." /></Field>
          </Section>
          <Section title="Footer Text">
            <Row2>
              <Field label="Footer Tagline (English)"><Input value={form.footerTextEn ?? ""} onChange={e => f("footerTextEn", e.target.value)} /></Field>
              <Field label="Footer Tagline (Arabic)"><Input value={form.footerTextAr ?? ""} onChange={e => f("footerTextAr", e.target.value)} dir="rtl" /></Field>
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
