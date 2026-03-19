'use client'

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "../i18n/navigation";

const languages = [
  { code: "en", label: "English", flag: "US" },
  { code: "tr", label: "Türkçe", flag: "TR" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = languages.find((l) => l.code === locale) || languages[0];
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-4 py-2 text-sm",
          "bg-[var(--color-bg-surface)] backdrop-blur-md shadow-sm",
          "border-[var(--color-border)] text-[var(--color-text-primary)]",
          "hover:border-indigo-500/30 transition-all font-medium"
        )}
      >
        <span className="text-[10px] w-4 h-4 flex items-center justify-center rounded-full bg-[var(--color-bg-elevated)] border border-[var(--color-border)] tracking-tight">
          {currentLang.flag}
        </span>
        <span>{currentLang.label}</span>
        <ChevronDown className="h-4 w-4 text-[var(--color-text-muted)]" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={cn(
            "absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50",
            "bg-[var(--color-bg-elevated)] backdrop-blur-xl",
            "shadow-xl border border-[var(--color-border)]",
            "animate-in fade-in zoom-in-95 duration-200"
          )}
        >
          <div className="p-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  router.replace(pathname, { locale: lang.code });
                  setOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-left transition-colors",
                  locale === lang.code
                    ? "font-semibold text-[var(--color-text-primary)] bg-[var(--color-bg-surface)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-primary)] hover:text-[var(--color-text-primary)]"
                )}
              >
                <span className="text-[10px] w-5 h-5 flex items-center justify-center rounded-sm bg-black/20 border border-[var(--color-border)] tracking-tight opacity-70">
                  {lang.flag}
                </span>
                <span className="flex-1">{lang.label}</span>
                {locale === lang.code && (
                  <Check className="h-4 w-4 text-[var(--color-accent)]" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
