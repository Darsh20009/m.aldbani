import { useEffect, useState } from "react";

const SPLASH_KEY = "md_splash_seen_v2";
const TOTAL_MS   = 3200;

export function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SPLASH_KEY)) return;
    localStorage.setItem(SPLASH_KEY, "1");
    setVisible(true);

    const exitTimer = setTimeout(() => setExiting(true), TOTAL_MS - 700);
    const doneTimer = setTimeout(() => setVisible(false), TOTAL_MS);

    return () => { clearTimeout(exitTimer); clearTimeout(doneTimer); };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="splash-root"
      style={{ opacity: exiting ? 0 : 1, transition: "opacity 0.7s cubic-bezier(0.4,0,0.2,1)" }}
      aria-hidden="true"
    >
      {/* Giant logo watermark — barely visible, gives depth */}
      <div className="splash-logo-bg">
        <img
          src="/logo-transparent.png"
          alt=""
          width={340}
          height={340}
          className="splash-logo-img select-none"
          style={{ opacity: 0.08, objectFit: "contain" }}
          draggable={false}
        />
      </div>

      {/* Content */}
      <div className="splash-content">

        {/* Animated gradient line */}
        <div className="splash-line" />

        {/* Brand image — centred, with float animation */}
        <div style={{ animation: "float-logo 5s ease-in-out infinite", marginBottom: 8 }}>
          <img
            src="/logo-transparent.png"
            alt="M-ALDBANI"
            width={80}
            height={80}
            style={{ objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(37,99,235,0.35))" }}
            draggable={false}
          />
        </div>

        {/* Name */}
        <div className="splash-name">
          <span className="splash-first">محمد</span>
          <span className="splash-last">الدباني</span>
        </div>

        {/* Arabic tagline */}
        <p className="splash-tagline">المستقبل أصبح حاضرنا</p>

        {/* English tagline */}
        <p
          className="splash-sub"
          style={{ background: "linear-gradient(90deg,#2563EB,#7C3AED)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
        >
          EXPERIENCE · INNOVATION · IMPACT
        </p>
      </div>

      {/* Bottom stamp */}
      <div className="splash-stamp">
        <img
          src="/logo-transparent.png"
          alt=""
          width={24}
          height={24}
          className="splash-stamp-logo"
          style={{ objectFit: "contain", opacity: 0.4 }}
          draggable={false}
        />
        <span className="splash-stamp-year">Est. 2016</span>
      </div>
    </div>
  );
}
