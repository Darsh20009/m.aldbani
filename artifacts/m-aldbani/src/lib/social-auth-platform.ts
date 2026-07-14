/**
 * Detects the visitor's device so we can favor the sign-in provider that
 * feels native on that platform: Apple on iOS, Google on Android. Desktop
 * browsers (where neither is the "native" choice) keep both options.
 */
export type DevicePlatform = "ios" | "android" | "other";

export function detectDevicePlatform(): DevicePlatform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent || "";

  // iPadOS 13+ reports as "Macintosh" but exposes multi-touch, unlike real Macs.
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1);
  if (isIOS) return "ios";

  if (/Android/i.test(ua)) return "android";

  return "other";
}

export function socialButtonVisibility(platform: DevicePlatform = detectDevicePlatform()): {
  showGoogle: boolean;
  showApple: boolean;
} {
  if (platform === "ios") return { showGoogle: false, showApple: true };
  if (platform === "android") return { showGoogle: true, showApple: false };
  return { showGoogle: true, showApple: true };
}
