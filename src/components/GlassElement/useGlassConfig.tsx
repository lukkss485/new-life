"use client";
 
import { createContext, useContext, useMemo, type ReactNode } from "react";
 
/**
 * Reconstruído a partir dos campos consumidos em GlassElement.tsx:
 *   defaults.angle
 *   defaults.highlightStrength   (equivalente ao "strength" de SpecularHighlightOptions)
 *   defaults.spread
 *   defaults.highlightOpacity
 *   defaults.rimOpacity
 *   defaults.contactShadowOpacity
 *   defaults.dropShadowOpacity
 *   defaults.glassOpacity
 *   defaults.blur
 *   defaults.chromaticAberration (de DisplacementOptions)
 *   defaults.distortionStrength  (equivalente ao "strength" de DisplacementOptions)
 */
export type GlassConfig = {
  // --- specular highlight ---
  angle: number;
  highlightStrength: number;
  spread: number;
  highlightOpacity: number;
  rimOpacity: number;
  contactShadowOpacity: number;
  dropShadowOpacity: number;
  // --- displacement / vidro ---
  chromaticAberration: number;
  distortionStrength: number;
  // --- aparência geral ---
  glassOpacity: number; // 0–100, usado em hsl(var(--card) / opacity%)
  blur: number; // px
};
 
/**
 * Ajuste estes valores para bater com os defaults reais que hoje estão
 * hardcoded em GlassElement.tsx (getSpecularHighlight já tem os seus:
 * angle=45, strength=1, spread=2, highlightOpacity=0.5, rimOpacity=0.15,
 * contactShadowOpacity=0.12, dropShadowOpacity=0.4).
 * chromaticAberration/distortionStrength/glassOpacity/blur não tinham
 * default explícito no componente — os valores abaixo são um ponto de
 * partida razoável, substitua pelos que fizerem sentido no seu projeto.
 */
export const DEFAULT_GLASS_CONFIG: GlassConfig = {
  angle: 45,
  highlightStrength: 1,
  spread: 2,
  highlightOpacity: 0.5,
  rimOpacity: 0.15,
  contactShadowOpacity: 0.12,
  dropShadowOpacity: 0.4,
  chromaticAberration: 0,
  distortionStrength: 100,
  glassOpacity: 30,
  blur: 8,
};
 
const GlassConfigContext = createContext<GlassConfig>(DEFAULT_GLASS_CONFIG);
 
export type GlassConfigProviderProps = {
  /** Sobrescreve só os campos passados; o resto herda do DEFAULT_GLASS_CONFIG
   *  (ou do provider pai, se houver um envolvendo este). */
  value?: Partial<GlassConfig>;
  children: ReactNode;
};
 
/**
 * Permite definir um tema de vidro por região da app:
 *
 *   <GlassConfigProvider value={{ glassOpacity: 15, blur: 12 }}>
 *     <Sidebar />
 *   </GlassConfigProvider>
 */
export function GlassConfigProvider({ value, children }: GlassConfigProviderProps) {
  const parent = useContext(GlassConfigContext);
 
  const merged = useMemo<GlassConfig>(
    () => ({ ...parent, ...value }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [parent, JSON.stringify(value)]
  );
 
  return (
    <GlassConfigContext.Provider value={merged}>
      {children}
    </GlassConfigContext.Provider>
  );
}
 
/**
 * Substitui a função ausente usada em GlassElement.tsx.
 * Fora de um GlassConfigProvider, retorna DEFAULT_GLASS_CONFIG.
 */
export function useGlassConfig(): GlassConfig {
  return useContext(GlassConfigContext);
}