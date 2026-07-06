import { useEffect, useState } from "react";
import logoImg from "@assets/Screenshot_2026-07-01_at_3.14.23_AM_1783289663512.png";

const SPLASH_KEY = "md_splash_seen";
const TOTAL_MS   = 3000; // total duration before unmount

export function SplashScreen() {
  const [visible, setVisible]   = useState(false);
  const [exiting, setExiting]   = useState(false);

  useEffect(() => {
    // Only show once per session
    if (sessionStorage.getItem(SPLASH_KEY)) return;
    sessionStorage.setItem(SPLASH_KEY, "1");
    setVisible(true);

    // Start exit animation
    const exitTimer = setTimeout(() => setExiting(true), TOTAL_MS - 600);
    // Unmount
    const doneTimer = setTimeout(() => setVisible(false), TOTAL_MS);

    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="splash-root"
      style={{ opacity: exiting ? 0 : 1 }}
      aria-hidden="true"
    >
      {/* Giant logo watermark — barely visible, gives depth */}
      <div className="splash-logo-bg">
        <img src={logoImg} alt="" className="splash-logo-img" />
      </div>

      {/* Content */}
      <div className="splash-content">

        {/* 1 — Horizontal rule draws in */}
        <div className="splash-line" />

        {/* 2 — Name */}
        <div className="splash-name">
          <span className="splash-first">محمد</span>
          <span className="splash-last">الدباني</span>
        </div>

        {/* 3 — Tagline */}
        <p className="splash-tagline">المستقبل أصبح حاضرنا</p>

        {/* 4 — English subtitle */}
        <p className="splash-sub">Mohammed Al-Dabbani</p>
      </div>

      {/* Bottom stamp — small logo + year */}
      <div className="splash-stamp">
        <img src={logoImg} alt="" className="splash-stamp-logo" />
        <span className="splash-stamp-year">Est. 2016</span>
      </div>
    </div>
  );
}
