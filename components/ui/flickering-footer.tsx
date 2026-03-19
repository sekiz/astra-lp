"use client";

import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Github, Linkedin, Twitter } from "lucide-react";
import { type ClassValue, clsx } from "clsx";
import * as Color from "color-bits";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";
import { useWaitlist } from "../WaitlistProvider";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Color helpers ─────────────────────────────────────────────────────────────

export const getRGBA = (
  cssColor: React.CSSProperties["color"],
  fallback = "rgba(180, 180, 180)",
): string => {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;
  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const el = document.createElement("div");
      el.style.color = cssColor;
      document.body.appendChild(el);
      const computed = window.getComputedStyle(el).color;
      document.body.removeChild(el);
      return Color.formatRGBA(Color.parse(computed));
    }
    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
};

export const colorWithOpacity = (color: string, opacity: number): string => {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
};

// ── Astra OS logo ─────────────────────────────────────────────────────────────

const AstraLogo = ({ className }: { className?: string }) => (
  <img src="/astra-logo.svg" alt="Astra OS Logo" className="w-[120px] h-auto object-contain flex-shrink-0" />
);

// ── Flickering Grid ───────────────────────────────────────────────────────────

interface FlickeringGridProps extends React.HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  className?: string;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
}

export const FlickeringGrid: React.FC<FlickeringGridProps> = ({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#6B7280",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 700,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, w, h);
      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = w;
      maskCanvas.height = h;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        maskCtx.font = `${fontWeight} ${fontSize}px "Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(text, w / (2 * dpr), h / (2 * dpr));
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const sw = squareSize * dpr;
          const sh = squareSize * dpr;
          const maskData = maskCtx.getImageData(x, y, sw, sh).data;
          const hasText = maskData.some((v, idx) => idx % 4 === 0 && v > 0);
          const opacity = squares[i * rows + j];
          const finalOpacity = hasText ? Math.min(1, opacity * 3 + 0.4) : opacity;
          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, sw, sh);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, w: number, h: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const cols = Math.ceil(w / (squareSize + gridGap));
      const rows = Math.ceil(h / (squareSize + gridGap));
      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }
      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let gridParams: ReturnType<typeof setupCanvas>;

    const updateSize = () => {
      const nw = width || container.clientWidth;
      const nh = height || container.clientHeight;
      setCanvasSize({ width: nw, height: nh });
      gridParams = setupCanvas(canvas, nw, nh);
    };

    updateSize();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView) return;
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      updateSquares(gridParams.squares, deltaTime);
      drawGrid(ctx, canvas.width, canvas.height, gridParams.cols, gridParams.rows, gridParams.squares, gridParams.dpr);
      animationFrameId = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(container);
    const io = new IntersectionObserver(([e]) => setIsInView(e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    if (isInView) animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
      io.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
};

// ── Media query hook ──────────────────────────────────────────────────────────

export function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);
  useEffect(() => {
    const check = () => setValue(window.matchMedia(query).matches);
    check();
    window.addEventListener("resize", check);
    const mq = window.matchMedia(query);
    mq.addEventListener("change", check);
    return () => {
      window.removeEventListener("resize", check);
      mq.removeEventListener("change", check);
    };
  }, [query]);
  return value;
}

// ── "Coming soon" badge ───────────────────────────────────────────────────────

function ComingSoonBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)]">
      {label}
    </span>
  );
}

// ── FlickeringFooter ──────────────────────────────────────────────────────────

export function FlickeringFooter() {
  const t = useTranslations("Footer");
  const { setOpen } = useWaitlist();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const soon = t("comingSoon");

  // Link columns — comingSoon items are non-navigable
  const columns = [
    {
      title: t("colProduct"),
      links: [
        { id: 1, label: t("linkFeatures"),     href: "/#features",  comingSoon: false, isModal: false },
        { id: 2, label: t("linkWhyAstra"),      href: "/#why-astra", comingSoon: false, isModal: false },
        { id: 3, label: t("linkJoinWaitlist"),  href: "#",           comingSoon: false, isModal: true  },
      ],
    },
    {
      title: t("colCompany"),
      links: [
        { id: 4, label: t("linkAbout"),   href: "/about",   comingSoon: true,  isModal: false },
        { id: 5, label: t("linkBlog"),    href: "/blog",    comingSoon: true,  isModal: false },
        { id: 6, label: t("linkContact"), href: "/contact", comingSoon: true,  isModal: false },
      ],
    },
    {
      title: t("colLegal"),
      links: [
        { id: 7, label: t("linkPrivacy"), href: "/privacy", comingSoon: false, isModal: false },
        { id: 8, label: t("linkTerms"),   href: "/terms",   comingSoon: true,  isModal: false },
      ],
    },
  ];

  return (
    <footer
      id="flickering-footer"
      className="w-full border-t border-[var(--color-border)] bg-[var(--color-bg-primary)]"
    >
      {/* Top section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between px-8 py-12 gap-10">
        {/* Brand */}
        <div className="flex flex-col gap-5 max-w-xs">
          <Link href="/" className="flex items-center gap-2.5 group">
            <AstraLogo className="text-[var(--color-accent)] size-10" />
          </Link>
          <p className="text-sm leading-relaxed text-[var(--color-text-muted)]">
            {t("description")}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--color-border)] text-[10px] font-semibold tracking-widest text-[var(--color-text-muted)] uppercase">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t("closedBeta")}
            </span>
          </div>
          {/* Social links */}
          <div className="flex items-center gap-1 mt-1">
            <a
              href="https://github.com/astra-os"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center size-8 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] transition-all duration-200"
            >
              <Github size={16} />
            </a>
            <a
              href="https://x.com/astraos"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="flex items-center justify-center size-8 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] transition-all duration-200"
            >
              <Twitter size={16} />
            </a>
            <a
              href="https://linkedin.com/company/astra-os"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center justify-center size-8 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-surface)] transition-all duration-200"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-3 gap-x-12 gap-y-8 md:w-auto">
          {columns.map((col) => (
            <ul key={col.title} className="flex flex-col gap-2.5">
              <li className="text-xs font-semibold tracking-widest uppercase text-[var(--color-text-primary)] mb-1">
                {col.title}
              </li>
              {col.links.map((link) =>
                link.comingSoon ? (
                  // Coming soon — not a real link
                  <li key={link.id} className="flex items-center gap-2">
                    <span className="text-sm text-[var(--color-text-muted)]/50 select-none">
                      {link.label}
                    </span>
                    <ComingSoonBadge label={soon} />
                  </li>
                ) : link.isModal ? (
                  // Opens waitlist modal
                  <li key={link.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(true)}
                      className="group inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer bg-transparent border-none p-0"
                    >
                      {link.label}
                      <ChevronRightIcon className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </button>
                  </li>
                ) : (
                  // Normal navigation link
                  <li key={link.id} className="group inline-flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors">
                    <Link href={link.href}>{link.label}</Link>
                    <ChevronRightIcon className="size-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                  </li>
                )
              )}
            </ul>
          ))}
        </div>
      </div>

      {/* Copyright bar */}
      <div className="px-8 py-3 border-t border-[var(--color-border)] flex items-center justify-between">
        <span className="text-xs text-[var(--color-text-muted)]">
          {t("copyright")}
        </span>
        <span className="text-xs text-[var(--color-text-muted)] hidden md:block">
          {t("tagline")}
        </span>
      </div>

      {/* Flickering text banner */}
      <div className="relative h-40 md:h-56 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--color-bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 mx-4">
          <FlickeringGrid
            text={isMobile ? "astra" : "astra OS"}
            fontSize={isMobile ? 72 : 100}
            fontWeight={700}
            className="h-full w-full"
            squareSize={2}
            gridGap={isMobile ? 2 : 3}
            color="#f1f5f9"
            maxOpacity={0.20}
            flickerChance={0.08}
          />
        </div>
      </div>
    </footer>
  );
}

export { FlickeringFooter as Component };
