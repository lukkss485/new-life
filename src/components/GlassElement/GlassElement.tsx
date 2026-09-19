"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
  type RefObject,
} from "react";
import {
  getDisplacementFilter,
  type DisplacementOptions,
} from "./getDisplacementFilter";
import { getDisplacementMap } from "./getDisplacementMap";
import { cn } from "@/lib/utils";
import { useGlassConfig } from "./useGlassConfig";

// Calcula a luminância relativa (Padrão W3C)
function getLuminance(r: number, g: number, b: number): number {
  const [aR, aG, aB] = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * aR + 0.7152 * aG + 0.0722 * aB;
}

// Analisa os elementos pai até encontrar uma cor de fundo sólida
function detectIsDarkBackground(el: HTMLElement | null): boolean {
  let current: HTMLElement | null = el?.parentElement || null;

  while (current && current !== document.documentElement) {
    const bg = window.getComputedStyle(current).backgroundColor;
    if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
      const rgb = bg.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        const [r, g, b, a] = rgb.map(Number);
        if (a === undefined || a > 0.1) {
          const luminance = getLuminance(r, g, b);
          return luminance < 0.45; // Retorna true se a luminância for baixa (fundo escuro)
        }
      }
    }
    current = current.parentElement;
  }

  // Fallback: verifica classe do documento ou preferência do sistema
  if (typeof document !== "undefined") {
    return (
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  return true;
}

export function useAutoDarkTheme(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean = true
) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const checkTheme = () => {
      setIsDark(detectIsDarkBackground(ref.current));
    };

    checkTheme();

    // Reavalia caso classes do HTML mudem (ex: troca manual de tema)
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    window.addEventListener("resize", checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", checkTheme);
    };
  }, [ref, enabled]);

  return isDark;
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export type SpecularHighlightOptions = {
  angle?: number;
  strength?: number;
  spread?: number;
  highlightOpacity?: number;
  rimOpacity?: number;
  contactShadowOpacity?: number;
  dropShadowOpacity?: number;
};

export const getSpecularHighlight = ({
  angle = 45,
  strength = 1,
  spread = 2,
  highlightOpacity = 0.5,
  rimOpacity = 0.15,
  contactShadowOpacity = 0.12,
  dropShadowOpacity = 0.4,
}: SpecularHighlightOptions = {}): string => {
  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * spread * strength;
  const y = Math.sin(rad) * spread * strength;

  const highlight = `inset ${x}px ${y}px 0px 0px hsla(0, 0%, 100%, ${clamp01(
    highlightOpacity * strength
  )})`;
  const rim = `inset ${-x * 0.6}px ${-y * 0.6}px 1px 0px hsla(0, 0%, 100%, ${clamp01(
    rimOpacity * strength
  )})`;
  const contact = `inset 0px -1px 1px 0px hsla(0, 0%, 0%, ${clamp01(
    contactShadowOpacity
  )})`;
  const drop = `0px 4px 7.5px 0px hsla(0, 0%, 0%, ${clamp01(dropShadowOpacity)})`;

  return [highlight, rim, contact, drop].join(",\n    ");
};

function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n));
}

function isChromiumBrowser(): boolean {
  if (typeof navigator === "undefined") return true;

  const uaData = (
    navigator as unknown as {
      userAgentData?: { brands?: { brand: string }[] };
    }
  ).userAgentData;

  if (uaData?.brands?.length) {
    return uaData.brands.some((b) => b.brand === "Chromium");
  }

  const ua = navigator.userAgent;
  const isFirefox = /Firefox\//.test(ua);
  const isSafari =
    /Safari\//.test(ua) && !/Chrome\//.test(ua) && !/Chromium\//.test(ua);

  return !isFirefox && !isSafari;
}

export type SizeValue = number | string;

function parseRadius(val: SizeValue): number {
  if (typeof val === "number") return val;
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

export type GlassPreset = "clean" | "frosted" | "prismatic" | "liquid" | "heavy";

export type GlassElementProps = Omit<
  DisplacementOptions,
  "height" | "width" | "radius"
> &
  Omit<SpecularHighlightOptions, "strength"> & {
    height?: SizeValue;
    width?: SizeValue;
    radius?: SizeValue;
    children?: ReactNode;
    blur?: number;
    nonChromiumBlur?: number;
    debug?: boolean;
    className?: string;
    shaders?: boolean;
    glassOpacity?: number;
    highlightStrength?: number;
    saturate?: number;
    contrast?: number;
    tintColor?: string;
    autoSize?: boolean;
    minScale?: number;

    /* Novas Props */
    preset?: GlassPreset;
    interactiveLight?: boolean;
    frostedNoise?: boolean | number;
    prismatic?: boolean;
    rippleOnClick?: boolean;
    bevelIntensity?: number;
    borderGlow?: string;
    hoverDepth?: number;
    gpuOptimize?: boolean;
    autoDarkTheme?: boolean;
  };

export const GlassElement = ({
  height = "auto",
  width = "auto",
  depth = 5,
  radius = 0,
  strength = null,
  chromaticAberration,
  blur,
  nonChromiumBlur = 24,
  debug = false,
  className,
  glassOpacity,
  angle,
  highlightStrength,
  spread,
  highlightOpacity,
  rimOpacity,
  contactShadowOpacity,
  dropShadowOpacity,
  style: userStyle,
  saturate = 1.8,
  contrast = 1,
  tintColor = "0 0% 100%",
  autoSize = false,
  minScale = 0.4,
  path,
  children,

  /* Defaults dos Novos Recursos */
  preset,
  interactiveLight = false,
  frostedNoise = false,
  prismatic = false,
  rippleOnClick = false,
  bevelIntensity = 0.2,
  borderGlow,
  hoverDepth = 0,
  gpuOptimize = true,
  onMouseMove,
  onMouseLeave,
  onClick,
  autoDarkTheme = true,
  ...props
}: GlassElementProps & React.ComponentProps<"div">) => {
  const defaults = useGlassConfig();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isChromium, setIsChromium] = useState(true);
  const [dynamicAngle, setDynamicAngle] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Hook de detecção automática de fundo escuro
  const isDarkBackground = useAutoDarkTheme(containerRef, autoDarkTheme);

  // SSR Safe Layout Effect
  useIsomorphicLayoutEffect(() => {
    setIsChromium(isChromiumBrowser());
  }, []);

  // Intersection Observer para economizar GPU se o elemento estiver fora da tela
  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Aplicação de Presets
  const activePreset = useMemo(() => {
    if (!preset) return null;
    switch (preset) {
      case "frosted":
        return { blur: 20, glassOpacity: 80, frostedNoise: 0.15, saturate: 1.2 };
      case "prismatic":
        return { prismatic: true, chromaticAberration: 12, saturate: 2.2 };
      case "liquid":
        return { depth: 12, strength: 25, saturate: 2.0 };
      case "heavy":
        return { blur: 30, glassOpacity: 90, contrast: 1.25 };
      case "clean":
      default:
        return { blur: 8, glassOpacity: 30, saturate: 1.5 };
    }
  }, [preset]);

  const effectiveBlur = activePreset?.blur ?? blur ?? defaults.blur;
  const effectiveGlassOpacity = activePreset?.glassOpacity ?? glassOpacity ?? defaults.glassOpacity;
  const effectiveSaturate = activePreset?.saturate ?? saturate;
  const effectiveContrast = activePreset?.contrast ?? contrast;
  const effectiveFrostedNoise = activePreset?.frostedNoise ?? frostedNoise;
  const effectivePrismatic = activePreset?.prismatic ?? prismatic;

  const isFluidWidth = typeof width === "string";
  const isFluidHeight = typeof height === "string";
  const isFluid = isFluidWidth || isFluidHeight;
  const isShrinkToFit = autoSize && typeof width === "number";
  const needsWrapper = isShrinkToFit || isFluid;

  const [measured, setMeasured] = useState({
    width: typeof width === "number" ? width : 0,
    height: typeof height === "number" ? height : 0,
  });

  useIsomorphicLayoutEffect(() => {
    if (!needsWrapper || !wrapperRef.current) return;

    const el = wrapperRef.current;
    const rect = el.getBoundingClientRect();
    setMeasured({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver(([entry]) => {
      setMeasured({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [needsWrapper]);

  const scale = isShrinkToFit
    ? Math.max(minScale, Math.min(1, measured.width / (width as number)))
    : 1;

  const effectiveWidth = isFluidWidth
    ? Math.max(1, measured.width)
    : isShrinkToFit
    ? Math.min(width as number, measured.width || (width as number))
    : (width as number);

  const effectiveHeight = isFluidHeight
    ? Math.max(1, measured.height)
    : (height as number) * scale;

  const minDimension = Math.min(effectiveWidth, effectiveHeight);

  if (typeof radius === "number" && radius > minDimension) {
    radius = `${minDimension / 2}px`;
  }

  const rawRadius = radius ?? 0;
  const baseRadiusNum = parseRadius(rawRadius);
  const effectiveRadiusNum = isFluid ? baseRadiusNum : baseRadiusNum * scale;
  const effectiveRadiusCSS =
    typeof rawRadius === "string" ? rawRadius : `${effectiveRadiusNum}px`;

  const baseDepth = activePreset?.depth ?? depth;
  const currentDepth = isHovered ? baseDepth + hoverDepth : baseDepth;
  const effectiveDepth = isFluid ? currentDepth : currentDepth * scale;

  const _angle = dynamicAngle ?? angle ?? defaults.angle;
  const _highlightStrength = highlightStrength ?? defaults.highlightStrength;
  const _spread = spread ?? defaults.spread;
  const _highlightOpacity = highlightOpacity ?? defaults.highlightOpacity;
  const _rimOpacity = rimOpacity ?? defaults.rimOpacity;
  const _contactShadowOpacity = contactShadowOpacity ?? defaults.contactShadowOpacity;
  const _dropShadowOpacity = dropShadowOpacity ?? defaults.dropShadowOpacity;
  const _chromaticAberration = activePreset?.chromaticAberration ?? chromaticAberration ?? defaults.chromaticAberration;
  const _strength = activePreset?.strength ?? strength ?? defaults.distortionStrength;

  if (_strength = 0){

  }

  const computedBlur = isChromium ? effectiveBlur : effectiveBlur * 2.5;

  const displacementFilterUrl = useMemo(() => {
    if (!isVisible) return "";
    return getDisplacementFilter({
      height: effectiveHeight + 1,
      width: effectiveWidth + 1,
      radius: effectiveRadiusNum,
      depth: effectiveDepth,
      strength: _strength ,
      chromaticAberration: _chromaticAberration,
      path,
    });
  }, [
    isVisible,
    effectiveHeight,
    effectiveWidth,
    effectiveRadiusNum,
    effectiveDepth,
    _strength,
    _chromaticAberration,
    path,
  ]);

  // Interatividade com o Mouse
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (interactiveLight && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const calculatedAngle = (Math.atan2(y, x) * 180) / Math.PI;
      setDynamicAngle(calculatedAngle < 0 ? calculatedAngle + 360 : calculatedAngle);
    }
    setIsHovered(true);
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: MouseEvent<HTMLDivElement>) => {
    setDynamicAngle(null);
    setIsHovered(false);
    onMouseLeave?.(e);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (rippleOnClick && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setRipplePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setTimeout(() => setRipplePos(null), 600);
    }
    onClick?.(e);
  };

  // Construção do Estilo Base
  const style: CSSProperties = {
    height: isFluidHeight ? "100%" : `${effectiveHeight + 1}px`,
    width: isFluidWidth ? "100%" : `${effectiveWidth + 1}px`,
    borderRadius: effectiveRadiusCSS,
    backdropFilter: isChromium
      ? `blur(${computedBlur / 2}px) saturate(${effectiveSaturate / 2}) url('${displacementFilterUrl}') blur(${computedBlur}px) saturate(${effectiveSaturate}) contrast(${effectiveContrast})`
      : `blur(${computedBlur}px) saturate(${effectiveSaturate}) contrast(${effectiveContrast})`,
    backgroundColor: `hsl(${tintColor} / ${effectiveGlassOpacity / 500})`,
    position: "relative",
    ...(gpuOptimize ? { willChange: "backdrop-filter, transform" } : {}),
  };

  if (debug) {
    style.background = `url("${getDisplacementMap({
      height: effectiveHeight + 0,
      width: effectiveWidth + 0,
      radius: effectiveRadiusNum,
      depth: effectiveDepth,
      path,
    })}")`;
    style.boxShadow = "none";
  }

  // Sombras Especulares e Bisel 3D
  const bevelShadow = bevelIntensity > 0
    ? `inset 1px 1px 1px rgba(255,255,255,${bevelIntensity}), inset -1px -1px 1px rgba(0,0,0,${bevelIntensity * 0.5})`
    : "";

  const borderGlowShadow = borderGlow
    ? `0 0 15px ${borderGlow}`
    : "";

  const boxstyle: CSSProperties = debug
    ? {}
    : {
        boxShadow: [
          getSpecularHighlight({
            angle: _angle,
            strength: _highlightStrength,
            spread: _spread,
            highlightOpacity: _highlightOpacity,
            rimOpacity: _rimOpacity,
            contactShadowOpacity: _contactShadowOpacity,
            dropShadowOpacity: _dropShadowOpacity,
          }),
          bevelShadow,
          borderGlowShadow,
        ].filter(Boolean).join(", "),
      };

  const noiseOpacity = typeof effectiveFrostedNoise === "number" ? effectiveFrostedNoise : 0.08;

  const glassDiv = (
    <div
      ref={containerRef}
      {...props}
      data-theme={isDarkBackground ? "dark" : "light"}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "transition-all duration-200 ease-out",
        isDarkBackground
          ? "dark text-white color-scheme-dark"
          : "light text-slate-900 color-scheme-light",
        className
      )}
      style={{ ...style, ...userStyle, ...boxstyle }}
    >
      {/* Ruído tátil (Frosted Noise) */}
      {effectiveFrostedNoise && (
        <div
          className="aria-hidden:pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-overlay rounded-[inherit] overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='${noiseOpacity}'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Camada Prismática */}
      {effectivePrismatic && (
        <div
          className="pointer-events-none absolute -inset-full z-0 opacity-30 mix-blend-color-dodge transition-opacity duration-300 rounded-[inherit] overflow-hidden"
          style={{
            background: `conic-gradient(from ${_angle}deg at 50% 50%, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)`,
            filter: "blur(20px)",
          }}
        />
      )}

      {/* Ripple de Clique */}
      {ripplePos && (
        <span
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full bg-white/40"
          style={{
            left: ripplePos.x,
            top: ripplePos.y,
            width: Math.max(effectiveWidth, effectiveHeight) * 0.8,
            height: Math.max(effectiveWidth, effectiveHeight) * 0.8,
          }}
        />
      )}

      {/* Renderiza o conteúdo diretamente sem wrapper intermediário que quebre Flexbox */}
      {children}
    </div>
  );

  if (!needsWrapper) return glassDiv;

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative",
        isFluidWidth && "w-full",
        isFluidHeight && "h-full"
      )}
    >
      {glassDiv}
    </div>
  );
};