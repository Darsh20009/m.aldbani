import { useState, useEffect } from "react";
import { Mail, X, Bell, CheckCircle2 } from "lucide-react";

const SESSION_KEY = "admin_email_prompt_dismissed";
const STORAGE_KEY = "admin_notification_email_set";

function getToken() {
  return localStorage.getItem("token") ?? "";
}

interface Props {
  onDone: () => void;
}

export function AdminEmailPrompt({ onDone }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const save = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ notificationEmail: email.trim() }),
      });
      if (!res.ok) throw new Error("Failed to save");
      localStorage.setItem(STORAGE_KEY, "1");
      setSuccess(true);
      setTimeout(() => onDone(), 1500);
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    onDone();
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={28} className="text-emerald-500" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-1">Email Saved!</h2>
          <p className="text-sm text-muted-foreground">All notifications will be sent to <span className="font-semibold text-foreground">{email}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Bell size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-base leading-tight">Set Notification Email</h2>
              <p className="text-white/70 text-xs mt-0.5">Receive alerts for new leads & bookings</p>
            </div>
          </div>
          <button onClick={dismiss} className="text-white/50 hover:text-white transition-colors mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            Where should we send notifications when someone contacts you or books a consultation?
          </p>

          <div className="relative mb-4">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && save()}
              placeholder="your@email.com"
              autoFocus
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive mb-3">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={save}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {loading ? "Saving…" : "Save & Enable Notifications"}
            </button>
          </div>

          <button
            onClick={dismiss}
            className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}

export function useAdminEmailPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const alreadySet = localStorage.getItem(STORAGE_KEY);
    const dismissed = sessionStorage.getItem(SESSION_KEY);
    if (!alreadySet && !dismissed) {
      // Small delay so the layout fully renders first
      const t = setTimeout(() => setShow(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  return {
    show,
    dismiss: () => setShow(false),
  };
}
