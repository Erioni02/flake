export type Color = "black" | "white";
export type Side = "front" | "back";
export type LookKind = "flat" | "him" | "her";

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export const PRICE_EUR = 30;
export const CURRENCY = "€";

/** One photograph. `src` is the large file; the small file sits beside it with `-sm`. */
export interface ProductImage {
  src: string;
  srcSmall: string;
  alt: string;
}

/** A pairing of front and back for one way of showing the tee (flat lay, on him, on her). */
export interface Look {
  kind: LookKind;
  front?: ProductImage;
  back?: ProductImage;
}

export interface Product {
  id: string;
  number: string;
  name: string;
  /** The words printed on the tee — shown as a quiet subtitle. */
  print: string;
  description: string;
  details: string[];
  /** Only colours that exist in the photography are listed. */
  looks: Partial<Record<Color, Look[]>>;
}

const BASE = "/products";

function img(path: string, alt: string): ProductImage {
  return {
    src: `${BASE}/${path}.webp`,
    srcSmall: `${BASE}/${path}-sm.webp`,
    alt,
  };
}

const LOOK_LABEL: Record<LookKind, string> = {
  flat: "Product",
  him: "On him",
  her: "On her",
};
export const lookLabel = (kind: LookKind) => LOOK_LABEL[kind];

/**
 * Builds the six standard looks (flat / him / her × black / white) for a design.
 * `front` and `back` resolve a path for each colour + look, or return undefined when
 * that photograph doesn't exist, so missing shots never render as broken images.
 */
function buildLooks(
  name: string,
  front: (color: Color, kind: LookKind) => string | undefined,
  back: (color: Color, kind: LookKind) => string | undefined,
): Record<Color, Look[]> {
  const kinds: LookKind[] = ["flat", "him", "her"];
  const describe = (color: Color, kind: LookKind, side: Side) => {
    const who = kind === "flat" ? "laid flat" : kind === "him" ? "worn by a male model" : "worn by a female model";
    return `${name} T-shirt in ${color}, ${side} view, ${who}`;
  };
  const build = (color: Color): Look[] =>
    kinds
      .map((kind) => {
        const f = front(color, kind);
        const b = back(color, kind);
        return {
          kind,
          front: f ? img(f, describe(color, kind, "front")) : undefined,
          back: b ? img(b, describe(color, kind, "back")) : undefined,
        };
      })
      .filter((look) => look.front || look.back);
  return { black: build("black"), white: build("white") };
}

/** Standard per-design folder: `<design>/<kind>-<color>-<side>`. */
const own = (design: string, side: Side, missing: string[] = []) => (color: Color, kind: LookKind) => {
  const key = `${kind}-${color}-${side}`;
  return missing.includes(key) ? undefined : `${design}/${key}`;
};

/**
 * RED FLAGS and I DON'T CARE are cut from the same front — a small script "flake"
 * on the chest. Both products point at the one shared set of images.
 */
const signatureFront = (color: Color, kind: LookKind) => `signature-front/${kind}-${color}`;

export const PRODUCTS: Product[] = [
  {
    id: "money-talks",
    number: "01",
    name: "Money Talks",
    print: "Money Talks",
    description:
      "Stacked green lettering wrapped around a fold of cash, printed big across the back. The front stays almost silent: one small FLAKE mark at the hem. It speaks once you've walked past.",
    details: ["Large back graphic in green", "FLAKE wordmark at the front hem", "Relaxed, boxy fit"],
    looks: buildLooks("Money Talks", own("money-talks", "front"), own("money-talks", "back")),
  },
  {
    id: "hasta-la-vista",
    number: "02",
    name: "Hasta La Vista",
    print: "Hasta La Vista, Baby.",
    description:
      "A tall condensed headline over a loose handwritten signature. It's a farewell line set in heavy type, cut clean and built for leaving the room.",
    details: ["Full back typographic print", "Condensed FLAKE mark at the front hem", "Relaxed, boxy fit"],
    looks: buildLooks(
      "Hasta La Vista",
      own("hasta-la-vista", "front"),
      own("hasta-la-vista", "back", ["him-black-back"]),
    ),
  },
  {
    id: "red-flags",
    number: "03",
    name: "Red Flags",
    print: "Red flags look good on you",
    description:
      "A soft, rounded line in red across the shoulders, signed off with the FLAKE script. On the chest, only the signature. Half compliment, half warning.",
    details: ["Red back print with script signature", "FLAKE script on the chest", "Relaxed, boxy fit"],
    looks: buildLooks("Red Flags", signatureFront, own("red-flags", "back")),
  },
  {
    id: "i-dont-care",
    number: "04",
    name: "I Don't Care",
    print: "I don't care if she got red flags — I'm a bull",
    description:
      "The answer to Red Flags. Block capitals in red stack into a statement, then drop to a quiet italic line underneath. Same chest signature, harder attitude.",
    details: ["Red stacked back print", "FLAKE script on the chest", "Relaxed, boxy fit"],
    looks: buildLooks("I Don't Care", signatureFront, own("i-dont-care", "back")),
  },
];

export function availableColors(product: Product): Color[] {
  return (["black", "white"] as Color[]).filter((c) => (product.looks[c]?.length ?? 0) > 0);
}

/** The image used to represent a product in the collection grid. */
export function coverImages(product: Product, color: Color) {
  const flat = product.looks[color]?.find((l) => l.kind === "flat");
  return { primary: flat?.back ?? flat?.front, secondary: flat?.front };
}

export const formatPrice = (amount: number) => `${CURRENCY}${amount}`;
