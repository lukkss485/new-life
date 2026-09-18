# GlassElement Documentation

## Overview
`GlassElement` is a high-performance React component designed to render realistic **liquid glassmorphic** effects using dynamic SVG displacement filters (`feDisplacementMap`), backdrop filters, and precise specular highlights.

## Key Features
* **Advanced Radius Support:** Accepts numeric pixel values or full CSS strings (`"1rem"`, `"50%"`, `"12px 24px"`, etc.).
* **Cross-Browser Compatibility:** Automatically handles Chromium-based browsers for precise SVG displacement while providing robust high-blur fallbacks for Safari and Firefox.
* **Fluid and Responsive Sizing:** Supports percentages, viewport units, fixed dimensions, and auto-scaling.
* **Customizable Specular Highlights & Shadows:** Generates realistic multi-layered inner highlights and drop shadows based on light angles.
* **Debug Mode:** Allows real-time visualization of the displacement mapping asset.

---

## Props Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `width` | `number \| string` | `'auto'` | Width of the glass container (supports px, %, vw, rem). |
| `height` | `number \| string` | `'auto'` | Height of the glass container. |
| `radius` | `number \| string` | `0` | Corner rounding. Accepts pixels (`16`) or CSS strings (`"50%"`, `"1rem 2rem"`). |
| `depth` | `number` | `5` | Refraction depth intensity of the liquid distortion effect. |
| `strength` | `number` | – | Distortion strength factor. |
| `blur` | `number` | – | Backdrop blur intensity. |
| `tintColor` | `string` | `"0 0% 100%"` | Base background tint color in HSL format. |
| `glassOpacity` | `number` | – | Opacity factor for the glass pane background. |
| `saturate` | `number` | `1.8` | Color saturation enhancement behind the glass. |
| `contrast` | `number` | `1` | Contrast multiplier for crisp edges and visual pop. |
| `debug` | `boolean` | `false` | Renders the raw displacement map texture instead of the glass effect. |

---
## Usage Examples


### 1. Basic Fixed Size with Numeric Radius
```tsx
<GlassElement blur="{12}" height="{150}" radius="{16}" width="{300}">
  <p>Standard Glass Card</p>
</GlassElement>

{/* Pill Shape / Full Circle */}
<GlassElement height="{200}" radius="50%" width="{200}">
  <span>Circular Glass</span>
</GlassElement>

{/* Complex CSS Shorthand Radius */}
<GlassElement height="{200}" radius="1.5rem 0.5rem 1.5rem 0.5rem" width="100%">
  <span>Custom Rounded Corners</span>
</GlassElement>
```
### 2. Advanced Radius using CSS Strings (Percentages & Shorthands)

```tsx 
{/* Pill Shape / Full Circle */}
<GlassElement height="{200}" radius="50%" width="{200}">
  <span>Circular Glass</span>
</GlassElement>

{/* Complex CSS Shorthand Radius */}
<GlassElement height="{200}" radius="1.5rem 0.5rem 1.5rem 0.5rem" width="100%">
  <span>Custom Rounded Corners</span>
</GlassElement>
```

```tsx
<div style={{ width: "100vw", height: "100vh" }}>
  <GlassElement height="100%" radius="24px" strength="{35}" width="100%">
    <h2>Full-Screen Liquid Glass Layer</h2>
  </GlassElement>
</div>
```

# How It Works Under the Hood
### 1. Radius Parsing: The radius prop handles numeric values directly for SVG filter coordinate calculations while safely passing complex CSS strings straight to the element's borderRadius style property.

### 2. SVG Displacement Map Generation: Via getDisplacementFilter, an inline SVG filter graph is dynamically generated using the component's current dimensions and corner radius.

### 3. Backdrop Rendering: In Chromium browsers, backdrop-filter injects the SVG displacement map (url(#...)), warping light passing through the background elements to simulate physical glass refraction and chromatic aberration.