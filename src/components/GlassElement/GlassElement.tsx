"use client";

import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  getDisplacementFilter,
  type DisplacementOptions,
} from "./getDisplacementFilter";
import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./GlassElement.module.css";
import { cn } from "@/lib/utils";
import { useGlassConfig } from "./useGlassConfig";

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

/** px fixo (number) ou qualquer valor CSS: "100%", "50vw", "20rem"... */
export type SizeValue = number | string;

export type GlassElementProps = Omit<DisplacementOptions, "height" | "width"> &
  Omit<SpecularHighlightOptions, "strength"> & {
    height?: SizeValue;
    width?: SizeValue;
    children?: ReactNode | undefined;
    blur?: number;
    debug?: boolean;
    className?: string;
    shaders?: boolean;
    glassOpacity?: number;
    highlightStrength?: number;
    saturate?: number;
    autoSize?: boolean;
    minScale?: number;
  };

export const GlassElement = ({
  height = 'auto',
  width = 'auto',
  depth = 5,
  radius = 0,
  strength,
  chromaticAberration,
  blur,
  debug = false,
  shaders = false,
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
  saturate = 1.5,
  autoSize = false,
  minScale = 0.4,
  path,
  ...props
}: GlassElementProps & React.ComponentProps<"div">) => {
  const defaults = useGlassConfig();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isFluidWidth = typeof width === "string";
  const isFluidHeight = typeof height === "string";
  const isFluid = isFluidWidth || isFluidHeight;
  const isShrinkToFit = autoSize && typeof width === "number";
  const needsWrapper = isShrinkToFit || isFluid;

  const [measured, setMeasured] = useState({
    width: typeof width === "number" ? width : 0,
    height: typeof height === "number" ? height : 0,
  });

  useLayoutEffect(() => {
    if (!needsWrapper || !wrapperRef.current) return;

    const el = wrapperRef.current;

    // leitura síncrona evita 1 frame com tamanho 0 antes do primeiro callback do observer
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

  // sem largura de design de referência no modo fluido, então radius/depth não escalam sozinhos
  const effectiveRadius = isFluid ? radius : radius * scale;
  const effectiveDepth = isFluid ? depth : depth * scale;

  const _angle = angle ?? defaults.angle;
  const _highlightStrength = highlightStrength ?? defaults.highlightStrength;
  const _spread = spread ?? defaults.spread;
  const _highlightOpacity = highlightOpacity ?? defaults.highlightOpacity;
  const _rimOpacity = rimOpacity ?? defaults.rimOpacity;
  const _contactShadowOpacity = contactShadowOpacity ?? defaults.contactShadowOpacity;
  const _dropShadowOpacity = dropShadowOpacity ?? defaults.dropShadowOpacity;
  const _glassOpacity = glassOpacity ?? defaults.glassOpacity;
  const _blur = blur ?? defaults.blur;
  const _chromaticAberration = chromaticAberration ?? defaults.chromaticAberration;
  const _strength = strength ?? defaults.distortionStrength;

  const displacementFilterUrl = useMemo(() => {
    return getDisplacementFilter({
      height: effectiveHeight,
      width: effectiveWidth,
      radius: effectiveRadius,
      depth: effectiveDepth,
      strength: _strength,
      chromaticAberration: _chromaticAberration,
      path,
    });
  }, [effectiveHeight, effectiveWidth, effectiveRadius, effectiveDepth, _strength, _chromaticAberration, path]);

  const style: CSSProperties = {
    height: isFluidHeight ? "100%" : `${effectiveHeight}px`,
    width: isFluidWidth ? "100%" : `${effectiveWidth}px`,
    borderRadius: `${effectiveRadius}px`,
    backdropFilter: `blur(${_blur / 2}px) saturate(${saturate / 2}) url('${displacementFilterUrl}') blur(${_blur}px) saturate(${saturate})`,
    backgroundColor: `hsl(var(--card) / ${_glassOpacity / 100})`,
  };

  if (debug === true) {
    style.background = `url("${getDisplacementMap({
      height: effectiveHeight,
      width: effectiveWidth,
      radius: effectiveRadius,
      depth: effectiveDepth,
      path,
    })}")`;
    style.boxShadow = "none";
  }

  const boxstyle: CSSProperties = debug
    ? {}
    : {
        boxShadow: getSpecularHighlight({
          angle: _angle,
          strength: _highlightStrength,
          spread: _spread,
          highlightOpacity: _highlightOpacity,
          rimOpacity: _rimOpacity,
          contactShadowOpacity: _contactShadowOpacity,
          dropShadowOpacity: _dropShadowOpacity,
        }),
      };

  const glassDiv = (
    <div
      {...props}
      className={cn(shaders ? styles.box : styles.boxShaderStateOn, "transition-none!", className)}
      style={{ ...style, ...userStyle, ...boxstyle }}
    />
  );

  if (!needsWrapper) return glassDiv;

  return (
    <div
      ref={wrapperRef}
      style={{
        width: isFluidWidth ? width : "100%",
        height: isFluidHeight ? height : undefined,
        maxWidth: isShrinkToFit ? (width as number) : undefined,
      }}
    >
      {glassDiv}
    </div>
  );
};