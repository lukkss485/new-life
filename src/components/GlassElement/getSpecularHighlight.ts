import { GlassElementProps } from "./GlassElement"

export function getSpecularHighlight(radius: number, largura: number, altura: number): string {
  const borderRadius = radius ?? 33.5;

  return `
    <svg color-interpolation-filters="sRGB" style="display:none">
      <defs>
        <filter id="thumb-filter">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation="0.2"
            result="blurred_source"
          ></feGaussianBlur>
          <feImage
            href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${largura}' height='${altura}'><rect width='100%' height='100%' rx='${borderRadius}' ry='${borderRadius}' fill='%23fff'/></svg>"
            x="0"
            y="0"
            width="${largura}"
            height="${altura}"
            result="displacement_map"
          ></feImage>
          <feDisplacementMap
            in="blurred_source"
            in2="displacement_map"
            scale="50.08645714048877"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          ></feDisplacementMap>
          <feColorMatrix
            in="displaced"
            type="saturate"
            result="displaced_saturated"
            values="6"
          ></feColorMatrix>
          <feImage
            href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${largura}' height='${altura}'><rect width='100%' height='100%' rx='${borderRadius}' ry='${borderRadius}' fill='%23fff'/></svg>"
            x="0"
            y="0"
            width="${largura}"
            height="${altura}"
            result="specular_layer"
          ></feImage>
          <feComposite
            in="displaced_saturated"
            in2="specular_layer"
            operator="in"
            result="specular_saturated"
          ></feComposite>
          <feComponentTransfer
            in="specular_layer"
            result="specular_faded"
          >
            <feFuncA type="linear" slope="0.5"></feFuncA>
          </feComponentTransfer>
          <feBlend
            in="specular_saturated"
            in2="displaced"
            mode="normal"
            result="withSaturation"
          ></feBlend>
          <feBlend
            in="specular_faded"
            in2="withSaturation"
            mode="normal"
          ></feBlend>
        </filter>
      </defs>
    </svg>
  `;
}