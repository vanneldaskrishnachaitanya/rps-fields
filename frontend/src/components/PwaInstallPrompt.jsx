import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";

export default function PwaInstallPrompt() {
  const { dark } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const isIos = useMemo(() => /iphone|ipad|ipod/i.test(window.navigator.userAgent), []);
  const isStandalone = useMemo(
    () => window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone,
    []
  );

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    };

    const handleInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);

    if (!isStandalone && isIos) {
      setVisible(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, [isIos, isStandalone]);

  if (isStandalone || dismissed || !visible) return null;

  const installNow = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setVisible(false);
  };

  const panelStyle = {
    position: "fixed",
    left: 12,
    right: 12,
    bottom: 66,
    zIndex: 1400,
    borderRadius: 16,
    padding: "12px 12px 11px",
    background: dark ? "rgba(6,18,11,0.96)" : "rgba(247,252,249,0.98)",
    color: dark ? "#eef8f2" : "#0a1a0c",
    border: `1px solid ${dark ? "rgba(116,198,157,0.24)" : "rgba(27,67,50,0.22)"}`,
    boxShadow: dark
      ? "0 14px 34px rgba(0,0,0,0.45)"
      : "0 14px 34px rgba(10,35,20,0.18)",
    backdropFilter: "blur(18px) saturate(160%)",
    WebkitBackdropFilter: "blur(18px) saturate(160%)",
    animation: "fadeUp 0.25s ease both",
  };

  const primaryStyle = {
    border: "none",
    borderRadius: 10,
    padding: "9px 12px",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    color: "#fff",
    background: "linear-gradient(135deg,#52b788,#2d6a4f)",
  };

  const ghostStyle = {
    borderRadius: 10,
    padding: "9px 10px",
    fontWeight: 700,
    fontSize: 12,
    cursor: "pointer",
    background: "transparent",
    border: `1px solid ${dark ? "rgba(255,255,255,0.16)" : "rgba(15,45,28,0.24)"}`,
    color: dark ? "rgba(255,255,255,0.84)" : "rgba(15,45,28,0.86)",
  };

  return (
    <div style={panelStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 900, marginBottom: 3 }}>Install RPS Fields App</div>
          <div style={{ fontSize: 12, opacity: 0.8, lineHeight: 1.35 }}>
            {deferredPrompt
              ? "Add this app to your home screen for a full-screen mobile experience."
              : "On iPhone: tap Share, then Add to Home Screen."}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
          {deferredPrompt && (
            <button onClick={installNow} style={primaryStyle}>
              Install
            </button>
          )}
          <button onClick={() => setDismissed(true)} style={ghostStyle}>
            Later
          </button>
        </div>
      </div>
    </div>
  );
}
