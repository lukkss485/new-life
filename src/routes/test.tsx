import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { RotateCcw } from 'lucide-react'

import { GlassElement, type GlassPreset } from '#/components/GlassElement/GlassElement'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/test')({
  component: GlassTestPage,
})

const PRESETS: Array<GlassPreset | 'none'> = [
  'none',
  'clean',
  'frosted',
  'prismatic',
  'liquid',
  'heavy',
]

const DEFAULT_BACKGROUND = 'https://picsum.photos/seed/liquidglass/1600/900'

const DEFAULTS = {
  depth: 8,
  blur: 8,
  radius: 28,
  strength: 0,
  chromaticAberration: 0,
  glassOpacity: 30,
  saturate: 1.8,
  contrast: 1,
  highlightStrength: 1,
  bevelIntensity: 0.2,
  hoverDepth: 0,
  tintColor: '0 0% 100%',
  borderGlow: '',
  preset: 'none' as GlassPreset | 'none',
  interactiveLight: false,
  frostedNoise: false,
  prismatic: false,
  rippleOnClick: false,
  autoDarkTheme: true,
  debug: false,
  fluidWidth: false,
  fixedWidth: 320,
  fixedHeight: 160,
}

function GlassTestPage() {
  const [backgroundUrl, setBackgroundUrl] = useState(DEFAULT_BACKGROUND)
  const [depth, setDepth] = useState(DEFAULTS.depth)
  const [blur, setBlur] = useState(DEFAULTS.blur)
  const [radius, setRadius] = useState(DEFAULTS.radius)
  const [strength, setStrength] = useState(DEFAULTS.strength)
  const [chromaticAberration, setChromaticAberration] = useState(DEFAULTS.chromaticAberration)
  const [glassOpacity, setGlassOpacity] = useState(DEFAULTS.glassOpacity)
  const [saturate, setSaturate] = useState(DEFAULTS.saturate)
  const [contrast, setContrast] = useState(DEFAULTS.contrast)
  const [highlightStrength, setHighlightStrength] = useState(DEFAULTS.highlightStrength)
  const [bevelIntensity, setBevelIntensity] = useState(DEFAULTS.bevelIntensity)
  const [hoverDepth, setHoverDepth] = useState(DEFAULTS.hoverDepth)
  const [tintColor, setTintColor] = useState(DEFAULTS.tintColor)
  const [borderGlow, setBorderGlow] = useState(DEFAULTS.borderGlow)
  const [preset, setPreset] = useState<GlassPreset | 'none'>(DEFAULTS.preset)
  const [interactiveLight, setInteractiveLight] = useState(DEFAULTS.interactiveLight)
  const [frostedNoise, setFrostedNoise] = useState(DEFAULTS.frostedNoise)
  const [prismatic, setPrismatic] = useState(DEFAULTS.prismatic)
  const [rippleOnClick, setRippleOnClick] = useState(DEFAULTS.rippleOnClick)
  const [autoDarkTheme, setAutoDarkTheme] = useState(DEFAULTS.autoDarkTheme)
  const [debug, setDebug] = useState(DEFAULTS.debug)
  const [fluidWidth, setFluidWidth] = useState(DEFAULTS.fluidWidth)
  const [fixedWidth, setFixedWidth] = useState(DEFAULTS.fixedWidth)
  const [fixedHeight, setFixedHeight] = useState(DEFAULTS.fixedHeight)

  const presetIsActive = preset !== 'none'

  function resetAll() {
    setDepth(DEFAULTS.depth)
    setBlur(DEFAULTS.blur)
    setRadius(DEFAULTS.radius)
    setStrength(DEFAULTS.strength)
    setChromaticAberration(DEFAULTS.chromaticAberration)
    setGlassOpacity(DEFAULTS.glassOpacity)
    setSaturate(DEFAULTS.saturate)
    setContrast(DEFAULTS.contrast)
    setHighlightStrength(DEFAULTS.highlightStrength)
    setBevelIntensity(DEFAULTS.bevelIntensity)
    setHoverDepth(DEFAULTS.hoverDepth)
    setTintColor(DEFAULTS.tintColor)
    setBorderGlow(DEFAULTS.borderGlow)
    setPreset(DEFAULTS.preset)
    setInteractiveLight(DEFAULTS.interactiveLight)
    setFrostedNoise(DEFAULTS.frostedNoise)
    setPrismatic(DEFAULTS.prismatic)
    setRippleOnClick(DEFAULTS.rippleOnClick)
    setAutoDarkTheme(DEFAULTS.autoDarkTheme)
    setDebug(DEFAULTS.debug)
    setFluidWidth(DEFAULTS.fluidWidth)
    setFixedWidth(DEFAULTS.fixedWidth)
    setFixedHeight(DEFAULTS.fixedHeight)
  }

  const glassProps = {
    depth,
    blur,
    radius,
    strength,
    chromaticAberration,
    glassOpacity,
    saturate,
    contrast,
    highlightStrength,
    bevelIntensity,
    hoverDepth,
    tintColor,
    ...(borderGlow ? { borderGlow } : {}),
    ...(presetIsActive ? { preset: preset as GlassPreset } : {}),
    interactiveLight,
    frostedNoise,
    prismatic,
    rippleOnClick,
    autoDarkTheme,
    debug,
    width: fluidWidth ? '100%' : fixedWidth,
    height: fluidWidth ? '100%' : fixedHeight,
  }

  const snippet = `<GlassElement\n${Object.entries(glassProps)
    .map(([key, value]) => `  ${key}={${JSON.stringify(value)}}`)
    .join('\n')}\n/>`

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Fundo: primeiro no DOM = pintado primeiro = fica atrás, sem
          precisar de z-index negativo (que ficava atrás até do bg-background
          do <body>, deixando a imagem invisível). */}
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      />
      <div className="fixed inset-0 bg-black/10" />

      <div className="relative flex min-h-screen flex-col gap-8 p-6 lg:flex-row lg:p-10">
        {/* Área de preview: o vidro flutuando sobre a imagem */}
        <div className="flex flex-1 items-center justify-center">
          <GlassElement {...glassProps} className="border border-white/20 px-6 py-5">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-lg font-semibold">Liquid Glass</span>
              <span className="text-sm opacity-80">arraste os controles →</span>
            </div>
          </GlassElement>
        </div>

        {/* Painel de controle */}
        <div className="w-full shrink-0 overflow-y-auto rounded-2xl border border-white/10 bg-black/40 p-5 text-white backdrop-blur-md lg:w-96">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Controles</h2>
            <button
              onClick={resetAll}
              className="flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 text-xs hover:bg-white/20"
            >
              <RotateCcw className="size-3" />
              Resetar
            </button>
          </div>

          <Field label="Imagem de fundo (URL)">
            <input
              type="text"
              value={backgroundUrl}
              onChange={(e) => setBackgroundUrl(e.target.value)}
              className="w-full rounded-md bg-white/10 px-2 py-1 text-xs"
            />
          </Field>

          <Field label="Preset">
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as GlassPreset | 'none')}
              className="w-full rounded-md bg-white/10 px-2 py-1 text-xs"
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            {presetIsActive && (
              <p className="mt-1 text-[11px] text-white/60">
                Com um preset ativo, ele sobrescreve blur, opacidade, saturação,
                contraste, ruído, prismático, aberração cromática e depth —
                os controles abaixo ficam sem efeito até voltar pra "none".
              </p>
            )}
          </Field>

          <Slider label="Depth" value={depth} min={1} max={40} step={1} onChange={setDepth} disabled={presetIsActive} />
          <Slider label="Blur" value={blur} min={0} max={40} step={1} onChange={setBlur} disabled={presetIsActive} />
          <Slider label="Radius" value={radius} min={0} max={999} step={1} onChange={setRadius} />
          <Slider label="Strength (distorção)" value={strength} min={0} max={500} step={1} onChange={setStrength} disabled={presetIsActive} />
          <Slider label="Chromatic aberration" value={chromaticAberration} min={0} max={30} step={1} onChange={setChromaticAberration} disabled={presetIsActive} />
          <Slider label="Glass opacity" value={glassOpacity} min={0} max={100} step={1} onChange={setGlassOpacity} disabled={presetIsActive} />
          <Slider label="Saturate" value={saturate} min={0} max={3} step={0.1} onChange={setSaturate} disabled={presetIsActive} />
          <Slider label="Contrast" value={contrast} min={0.5} max={2} step={0.05} onChange={setContrast} disabled={presetIsActive} />
          <Slider label="Highlight strength" value={highlightStrength} min={0} max={2} step={0.1} onChange={setHighlightStrength} />
          <Slider label="Bevel intensity" value={bevelIntensity} min={0} max={1} step={0.05} onChange={setBevelIntensity} />
          <Slider label="Hover depth" value={hoverDepth} min={0} max={20} step={1} onChange={setHoverDepth} />

          <Field label="Tint color (H S% L%)">
            <input
              type="text"
              value={tintColor}
              onChange={(e) => setTintColor(e.target.value)}
              placeholder="0 0% 100%"
              className="w-full rounded-md bg-white/10 px-2 py-1 text-xs"
            />
          </Field>

          <Field label="Border glow (cor CSS, opcional)">
            <input
              type="text"
              value={borderGlow}
              onChange={(e) => setBorderGlow(e.target.value)}
              placeholder="ex: rgba(255,255,255,0.6)"
              className="w-full rounded-md bg-white/10 px-2 py-1 text-xs"
            />
          </Field>

          <Toggle label="Interactive light" checked={interactiveLight} onChange={setInteractiveLight} />
          <Toggle label="Frosted noise" checked={frostedNoise} onChange={setFrostedNoise} disabled={presetIsActive} />
          <Toggle label="Prismatic" checked={prismatic} onChange={setPrismatic} disabled={presetIsActive} />
          <Toggle label="Ripple on click" checked={rippleOnClick} onChange={setRippleOnClick} />
          <Toggle label="Auto dark theme" checked={autoDarkTheme} onChange={setAutoDarkTheme} />
          <Toggle label="Debug (mostra o mapa de deslocamento cru)" checked={debug} onChange={setDebug} />

          <Toggle
            label="Largura/altura fluida (100%)"
            checked={fluidWidth}
            onChange={setFluidWidth}
          />
          {fluidWidth && (
            <p className="-mt-2 mb-3 text-[11px] text-white/50">
              Modo fluido depende do elemento pai ter uma altura definida —
              aqui na página de teste isso não é garantido, então o vidro
              pode encolher/deslocar de forma inesperada. Use tamanho fixo
              pra avaliar o efeito com confiança.
            </p>
          )}
          {!fluidWidth && (
            <>
              <Slider label="Width (px)" value={fixedWidth} min={80} max={800} step={4} onChange={setFixedWidth} />
              <Slider label="Height (px)" value={fixedHeight} min={40} max={600} step={4} onChange={setFixedHeight} />
            </>
          )}

          <div className="mt-5">
            <p className="mb-1 text-xs font-semibold text-white/70">JSX atual</p>
            <pre className="max-h-56 overflow-auto rounded-md bg-black/50 p-2 text-[10px] leading-snug text-white/80">
              {snippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-xs font-medium text-white/70">{label}</label>
      {children}
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  disabled,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  disabled?: boolean
}) {
  return (
    <div className={cn('mb-4', disabled && 'opacity-40')}>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-white/70">
        <span>{label}</span>
        <span className="tabular-nums text-white/50">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </div>
  )
}

function Toggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  return (
    <label
      className={cn(
        'mb-3 flex items-center justify-between text-xs font-medium text-white/70',
        disabled && 'opacity-40'
      )}
    >
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  )
}