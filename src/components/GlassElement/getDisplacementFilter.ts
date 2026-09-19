import { getDisplacementMap } from "./getDisplacementMap";

export type DisplacementOptions = {
        height: number;
        width: number;
        radius?: number | 0;   // agora opcional
        path?: string;      // novo: SVG path "d", nas mesmas coordenadas do viewBox 0 0 width height
        depth: number;
        strength?: number | null;
        chromaticAberration?: number;
        /**
         * Quanto mais um ponto da imagem está afastado do centro no eixo X
         * (pra esquerda ou pra direita), mais ele é "puxado" na direção do
         * centro. 0 = desligado (comportamento original). Algo como 0.2–0.6
         * costuma ser um bom ponto de partida; valores negativos invertem o
         * efeito (empurra pra fora em vez de puxar pro centro).
         */
        centerPull?: number;
};

/**
 * Creating the displacement filter.
 * The file complexity is due to the experimental "chromatic aberration" effect;
 * filters from first `feColorMatrix` to last `feBlend` can be removed if the effect is not needed.
 */
// O mapa de deslocamento codifica X no canal R e Y no canal G — igual em
// todo o resto do projeto (RefractionFilter, etc). Os três blocos abaixo
// usam sempre R/G; o que muda entre eles é a ESCALA (ver mais abaixo),
// que é o que de fato separa as cores.
const a1 = "R";
const a2 = "G";

const b1 = "R";
const b2 = "G";

const c1 = "R";
const c2 = "G";

// Mapa auxiliar só pro efeito de "puxar pro centro": um gradiente
// horizontal reto (não em V) onde o canal R vai de
// (128 - 127*centerPull) na borda esquerda até (128 + 127*centerPull)
// na borda direita. Como o valor cresce de forma linear com x, o
// deslocamento resultante também cresce com a distância até o centro —
// e aponta sempre para FORA (mesmo sinal de x - centro), o que faz o
// feDisplacementMap buscar pixels de origem cada vez mais distantes do
// centro para exibi-los em posições mais próximas do meio. G fica em
// 128 (neutro) pra não afetar o deslocamento vertical, que continua só
// por conta do mapa de profundidade original.
const getCenterPullMap = ({
        width,
        height,
        centerPull,
}: {
        width: number;
        height: number;
        centerPull: number;
}) => {
        const clamp = (v: number) => Math.max(0, Math.min(255, v));
        const left = clamp(128 - 127 * centerPull);
        const right = clamp(128 + 127 * centerPull);

        return (
                "data:image/svg+xml;utf8," +
                encodeURIComponent(`
		<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<linearGradient id="pull" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stop-color="rgb(${left},128,0)" />
					<stop offset="100%" stop-color="rgb(${right},128,0)" />
				</linearGradient>
			</defs>
			<rect x="0" y="0" width="${width}" height="${height}" fill="url(#pull)" />
		</svg>`)
        );
};

export const getDisplacementFilter = ({
        height,
        width,
        radius,
        depth,
        strength = 100,
        chromaticAberration = 0,
        centerPull = 0,
}: DisplacementOptions) => {
        const mapRef = centerPull !== 0 ? "combinedMap" : "displacementMap";

        return (
                "data:image/svg+xml;utf8," +
                encodeURIComponent(`
	<svg height="${height}" width="${width}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" class="z">
	<style>
	.z {z-index: 0;}
    </style>
    <defs>
        <filter id="displace" color-interpolation-filters="sRGB">
            <feImage x="0" y="0" height="${height}" width="${width}" href="${getDisplacementMap({ height, width, radius, depth })}" result="displacementMap" />
            ${centerPull !== 0
                                ? `<feImage x="0" y="0" height="${height}" width="${width}" href="${getCenterPullMap({ width, height, centerPull })}" result="centerPullMap" />
            <feComposite in="displacementMap" in2="centerPullMap" operator="arithmetic" k1="0" k2="1" k3="1" k4="-0.5" result="combinedMap" />`
                                : ""
                        }
            <feDisplacementMap
                transform-origin="center"
                in="SourceGraphic"
                in2="${mapRef}"
                scale="${strength}"
                xChannelSelector="${a1}"
                yChannelSelector="${a2}"
            />
            <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="displacedR"
                    />
            <feDisplacementMap
                in="SourceGraphic"
                in2="${mapRef}"
                scale="${}"
                xChannelSelector="${b1}"
                yChannelSelector="${b2}"
            />
            <feColorMatrix
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="displacedG"
                    />
            <feDisplacementMap
                    in="SourceGraphic"
                    in2="${mapRef}"
                    scale="${strength}"
                    xChannelSelector="${c1}"
                    yChannelSelector="${c2}"
                />
                <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 1 0 0
                        0 0 0 1 0"
                result="displacedB"
                        />
                
              <feBlend in="displacedR" in2="displacedG" mode="screen"/>
              <feBlend in2="displacedB" mode="screen"/>
        </filter>
    </defs>
</svg>`) +
                "#displace"
        );
};