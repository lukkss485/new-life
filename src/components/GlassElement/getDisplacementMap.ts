import { type DisplacementOptions } from "./getDisplacementFilter";

/**
 * Cria a imagem de deslocamento usada pelo feDisplacementMap.
 * Suporta retângulos arredondados padrão ou SVG Path customizado via `path`.
 */
export const getDisplacementMap = ({
  height,
  width,
  radius = 0,
  depth,
  path,
}: Omit<DisplacementOptions, "chromaticAberration" | "strength">) => {
  const safeHeight = Math.max(1, height);
  const safeWidth = Math.max(1, width);

  // Se houver um SVG Path customizado, usa ele; caso contrário, desenha o rect padrão
  const innerShape = path
    ? `<path d="${path}" fill="#808000" filter="blur(${depth / 1.5}px)" />`
    : `<rect
        x="${depth * 1.5}"
        y="${depth * 1.5}"
        height="${Math.max(0, safeHeight - 3 * depth)}"
        width="${Math.max(0, safeWidth - 3 * depth)}"
        fill="#808000"
        rx="${radius}"
        ry="${radius}"
        filter="blur(${depth / 1.5}px)"
      />`;

  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(`<svg height="${safeHeight}" width="${safeWidth}" viewBox="0 0 ${safeWidth} ${safeHeight}" xmlns="http://www.w3.org/2000/svg" class="z">
    <style>
        .mix { mix-blend-mode: screen; }
        .z {z-index: 0;}
    </style>
    <defs>
        <linearGradient 
          id="Y" 
          x1="0" 
          x2="0" 
          y1="${Math.ceil((radius / safeHeight) * -50)}%"
          y2="${Math.floor(100 - (radius / safeHeight) * -50)}%"
        >
            <stop offset="0%" stop-color="#0f0" />
            <stop offset="100%" stop-color="#000" />
        </linearGradient>
        <linearGradient 
          id="X" 
          x1="${Math.ceil((radius / safeWidth) * -50)}%" 
          x2="${Math.floor(100 - (radius / safeWidth) * -50)}%"
          y1="0" 
          y2="0">
            <stop offset="0%" stop-color="#f00" />
            <stop offset="100%" stop-color="#000" />
        </linearGradient>
    </defs>
    <rect x="0" y="0" height="${safeHeight}" width="${safeWidth}" fill="#808000" />
    <g filter="blur(1px)">
      <rect x="0" y="0" height="${safeHeight}" width="${safeWidth}" fill="#000000" />
      <rect x="0" y="0" height="${safeHeight}" width="${safeWidth}" fill="url(#Y)" class="mix" />
      <rect x="0" y="0" height="${safeHeight}" width="${safeWidth}" fill="url(#X)" class="mix" />
      ${innerShape}
    </g>
</svg>`)
  );
};