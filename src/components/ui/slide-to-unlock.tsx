"use client";

import { mix, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { useCallback, useEffect } from "react";

import { useSound } from "#/hooks/use-sound"; 
import { cn } from "@/lib/utils";
import {  getSpecularHighlight, type SpecularHighlightOptions } from "@/components/GlassElement/GlassElement";

import { RefractionFilter } from "./refraction-filter";

export interface SlideToUnlockProps extends Omit<SpecularHighlightOptions, "strength"> {
  // ─────────────────────────────────────────────────────────────────────────
  // Estado controlado / não-controlado
  // ─────────────────────────────────────────────────────────────────────────

  /** Estado atual (modo controlado). Se fornecido, checked/onCheckedChange controlam o componente. */
  checked?: boolean;

  /** Callback padrão de mudança de estado — mesmo formato do Switch do shadcn. */
  onCheckedChange?: (checked: boolean) => void;

  /** Estado inicial (modo não-controlado). @default false */
  defaultChecked?: boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Callbacks adicionais (opcionais, complementam onCheckedChange)
  // ─────────────────────────────────────────────────────────────────────────

  onUnlock?: () => void;
  onLock?: () => void;

  // ─────────────────────────────────────────────────────────────────────────
  // Comportamento
  // ─────────────────────────────────────────────────────────────────────────

  soundEnabled?: boolean;
  disabled?: boolean;

  // ─────────────────────────────────────────────────────────────────────────
  // Aparência
  // ─────────────────────────────────────────────────────────────────────────

  className?: string;
  thumbColor?: string;
  trackColorOff?: string;
  trackColorOn?: string;

  // ─────────────────────────────────────────────────────────────────────────
  // Parâmetros ópticos do vidro (RefractionFilter — mapa de deslocamento)
  // ─────────────────────────────────────────────────────────────────────────

  blur?: number;
  specularOpacity?: number;
  specularSaturation?: number;
  refractionLevel?: number;

  /** Força do specular highlight (boxShadow) — separada do highlight do RefractionFilter. @default 1 */
  highlightStrength?: number;
}

export const SlideToUnlock: React.FC<SlideToUnlockProps> = ({
  checked: controlledChecked,
  onCheckedChange,
  defaultChecked = false,
  onUnlock,
  onLock,
  soundEnabled = true,
  disabled = false,
  className,
  thumbColor = "rgba(255, 255, 255, 1)",
  trackColorOff = "#94949F77",
  trackColorOn = "#3BBF4EEE",
  blur = 0.2,
  specularOpacity = 0.5,
  specularSaturation = 6,
  refractionLevel = 1,
  // specular highlight (boxShadow) — mesmos nomes/defaults do GlassElement
  angle = 45,
  highlightStrength = 1,
  spread = 2,
  highlightOpacity = 0.5,
  rimOpacity = 0.15,
  contactShadowOpacity = 0.12,
  dropShadowOpacity = 0.4,
}) => {
  const isControlled = controlledChecked !== undefined;

  // CONSTANTS (layout)
  const sliderHeight = 33.5;
  const sliderWidth = 80;
  const thumbWidth = sliderWidth + 14;
  const thumbHeight = sliderHeight + 25;
  const thumbRadius = thumbHeight / 2;
  const sliderRef = React.useRef<HTMLDivElement>(null);
  const xDragRatio = useMotionValue(0);
  const playUnlockSound = useSound("/audio/ui-sounds/unlock.wav");

  const THUMB_REST_SCALE = 0.485;
  const THUMB_ACTIVE_SCALE = 1;
  const THUMB_REST_OFFSET = ((1 - THUMB_REST_SCALE) * thumbWidth) / 2;
  const TRAVEL = sliderWidth - sliderHeight - (thumbWidth - thumbHeight) * THUMB_REST_SCALE;

  // MOTION SOURCES
  const checked = useMotionValue(isControlled ? (controlledChecked ? 1 : 0) : defaultChecked ? 1 : 0);
  const pointerDown = useMotionValue(0);
  const initialPointerX = useMotionValue(0);
  const active = useTransform(() => (pointerDown.get() > 0.5 ? 1 : 0));

  // Sincroniza valor controlado de fora (ex: um formulário resetando o switch)
  useEffect(() => {
    if (isControlled) {
      checked.set(controlledChecked ? 1 : 0);
    }
  }, [isControlled, controlledChecked, checked]);

  const handleStateChange = useCallback(
    (newChecked: boolean, wasChecked: boolean) => {
      if (newChecked === wasChecked) return;

      if (newChecked && soundEnabled) {
        playUnlockSound();
      }

      onCheckedChange?.(newChecked);
      if (newChecked) onUnlock?.();
      else onLock?.();
    },
    [soundEnabled, onCheckedChange, onUnlock, onLock, playUnlockSound]
  );

  // GLOBAL POINTER-UP LISTENER
  useEffect(() => {
    const onPointerUp = (e: MouseEvent | TouchEvent) => {
      if (disabled) return;
      pointerDown.set(0);

      const x = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
      const distance = x - initialPointerX.get();
      if (Math.abs(distance) > 4) {
        const dragX = xDragRatio.get();
        const shouldBeChecked = dragX > 0.5;
        const wasChecked = checked.get() > 0.5;
        if (!isControlled) checked.set(shouldBeChecked ? 1 : 0);
        handleStateChange(shouldBeChecked, wasChecked);
      }
    };

    window.addEventListener("mouseup", onPointerUp);
    window.addEventListener("touchend", onPointerUp);
    return () => {
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, [disabled, xDragRatio, checked, pointerDown, initialPointerX, handleStateChange, isControlled]);

  // SPRINGS
  const xRatio = useSpring(
    useTransform(() => {
      const c = checked.get();
      const dragRatio = xDragRatio.get();
      return pointerDown.get() > 0.5 ? dragRatio : c ? 1 : 0;
    }),
    { damping: 80, stiffness: 1000 }
  );
  const backgroundOpacity = useSpring(useTransform(active, (v) => 1 - 0.9 * v), { damping: 80, stiffness: 2000 });
  const thumbScale = useSpring(
    useTransform(active, (v) => THUMB_REST_SCALE + (THUMB_ACTIVE_SCALE - THUMB_REST_SCALE) * v),
    { damping: 80, stiffness: 2000 }
  );
  const scaleRatio = useSpring(useTransform(() => (0.4 + 0.5 * active.get()) * refractionLevel));
  const considerChecked = useTransform(() => {
    const x = xDragRatio.get();
    const c = checked.get();
    return pointerDown.get() ? (x > 0.5 ? 1 : 0) : c > 0.5 ? 1 : (0 as number);
  });
  const backgroundColor = useTransform(
    useSpring(considerChecked, { damping: 80, stiffness: 1000 }),
    mix(trackColorOff, trackColorOn)
  );

  const thumbBaseColor = thumbColor;

  // Specular highlight (boxShadow), mesma lógica do GlassElement — calculado uma vez, é estático por instância
  const specularShadow = getSpecularHighlight({
    angle,
    strength: highlightStrength,
    spread,
    highlightOpacity,
    rimOpacity,
    contactShadowOpacity,
    dropShadowOpacity,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || !sliderRef.current) return;
    e.stopPropagation();
    const baseRatio = checked.get();
    const displacementX = e.clientX - initialPointerX.get();
    const ratio = baseRatio + displacementX / TRAVEL;
    const overflow = ratio < 0 ? -ratio : ratio > 1 ? ratio - 1 : 0;
    const overflowSign = ratio < 0 ? -1 : 1;
    const dampedOverflow = (overflowSign * overflow) / 22;
    xDragRatio.set(Math.min(1, Math.max(0, ratio)) + dampedOverflow);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || !sliderRef.current) return;
    e.stopPropagation();
    const baseRatio = checked.get();
    const displacementX = e.touches[0].clientX - initialPointerX.get();
    const ratio = baseRatio + displacementX / TRAVEL;
    const overflow = ratio < 0 ? -ratio : ratio > 1 ? ratio - 1 : 0;
    const overflowSign = ratio < 0 ? -1 : 1;
    const dampedOverflow = (overflowSign * overflow) / 22;
    xDragRatio.set(Math.min(1, Math.max(0, ratio)) + dampedOverflow);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    const distance = e.clientX - initialPointerX.get();
    if (Math.abs(distance) < 4) {
      const wasChecked = checked.get() > 0.5;
      const shouldBeChecked = !wasChecked;
      if (!isControlled) checked.set(shouldBeChecked ? 1 : 0);
      handleStateChange(shouldBeChecked, wasChecked);
    }
  };

  return (
    <motion.div
      ref={sliderRef}
      role="switch"
      aria-checked={isControlled ? controlledChecked : undefined}
      aria-disabled={disabled}
      className={cn("touch-pan-y touch-none select-none", disabled && "pointer-events-none opacity-50", className)}
      style={{
        display: "inline-block",
        width: sliderWidth,
        height: sliderHeight,
        backgroundColor,
        borderRadius: sliderHeight / 2,
        position: "relative",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={handleClick}
    >
      <RefractionFilter
        id="thumb-filter"
        width={thumbWidth}
        height={thumbHeight}
        radius={thumbRadius}
        bezelWidth={19}
        glassThickness={47}
        bezelType="lip"
        refractiveIndex={1.5}
        blur={blur}
        scaleRatio={scaleRatio}
        specularOpacity={specularOpacity}
        specularSaturation={specularSaturation}
      />
      <motion.div
        className="absolute"
        onTouchStart={(e) => {
          if (disabled) return;
          e.stopPropagation();
          pointerDown.set(1);
          initialPointerX.set(e.touches[0].clientX);
        }}
        onMouseDown={(e) => {
          if (disabled) return;
          e.stopPropagation();
          pointerDown.set(1);
          initialPointerX.set(e.clientX);
        }}
        style={{
          height: thumbHeight,
          width: thumbWidth,
          marginLeft: -THUMB_REST_OFFSET + (sliderHeight - thumbHeight * THUMB_REST_SCALE) / 2,
          x: useTransform(() => xRatio.get() * TRAVEL),
          y: "-50%",
          borderRadius: thumbRadius,
          top: sliderHeight / 2,
          backdropFilter: `url(#thumb-filter)`,
          scale: thumbScale,
          backgroundColor: useTransform(backgroundOpacity, (op) => {
            if (thumbBaseColor.startsWith("rgba")) return thumbBaseColor.replace(/[\d.]+\)$/, `${op})`);
            if (thumbBaseColor.startsWith("rgb")) return thumbBaseColor.replace("rgb", "rgba").replace(")", `, ${op})`);
            return `rgba(255, 255, 255, ${op})`;
          }),
          boxShadow: useTransform(() => {
            const isPressed = pointerDown.get() > 0.5;
            const pressedInset = isPressed
              ? ", inset 2px 7px 24px rgba(0,0,0,0.09), inset -2px -7px 24px rgba(255,255,255,0.09)"
              : "";
            return `${specularShadow}${pressedInset}`;
          }),
          zIndex: '10000000000000000000000000000',
        }}
      />
    </motion.div>
  );
};