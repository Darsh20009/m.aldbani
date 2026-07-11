import { Component, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; reloading: boolean; }

/** Catches React.lazy() chunk-load failures (stale build after a new deploy)
 *  and automatically reloads the page once so the user gets the new version.
 *  If the reload itself fails, shows a manual reload button. */
export class ChunkErrorBoundary extends Component<Props, State> {
  private reloadAttempted = false;

  state: State = { error: null, reloading: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (this.isChunkError(error) && !this.reloadAttempted) {
      this.reloadAttempted = true;
      this.setState({ reloading: true });
      // Small delay so React finishes the current render cycle
      setTimeout(() => window.location.reload(), 150);
    }
  }

  private isChunkError(err: Error) {
    return (
      err.name === "ChunkLoadError" ||
      /loading chunk/i.test(err.message) ||
      /failed to fetch/i.test(err.message) ||
      /dynamically imported/i.test(err.message) ||
      /unable to preload/i.test(err.message)
    );
  }

  render() {
    const { error, reloading } = this.state;

    if (reloading) {
      return (
        <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E5E7EB", borderTop: "3px solid #2563EB", animation: "spin 0.7s linear infinite" }} />
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center", direction: "rtl" }}
        >
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>تعذّر تحميل الصفحة</p>
          <p style={{ fontSize: 14, color: "#6B7280" }}>قد يكون هناك تحديث جديد — حاول إعادة التحميل</p>
          {import.meta.env.DEV && (
            <pre style={{ fontSize: 11, color: "#EF4444", background: "#FFF1F2", border: "1px solid #FECDD3", borderRadius: 8, padding: 12, maxWidth: 600, textAlign: "left", direction: "ltr", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {error.name}: {error.message}{"\n\n"}{error.stack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "10px 24px", background: "#2563EB", color: "#fff", borderRadius: 8, border: "none", fontWeight: 600, cursor: "pointer", fontSize: 14 }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
