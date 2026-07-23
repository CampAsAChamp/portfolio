/**
 * Lightweight TypeScript expression model for codegen.
 * Prefer building structured values, then print — avoid hand-written object/array string templates.
 */

export type TsExpr =
  | { kind: "literal"; value: string | number | boolean | null }
  | { kind: "ident"; name: string }
  | { kind: "call"; callee: string; args: TsExpr[] }
  | { kind: "array"; elements: TsExpr[] }
  | { kind: "object"; properties: { key: string; value: TsExpr }[] }

export function lit(value: string | number | boolean | null): TsExpr {
  return { kind: "literal", value }
}

export function ident(name: string): TsExpr {
  return { kind: "ident", name }
}

export function call(callee: string, ...args: TsExpr[]): TsExpr {
  return { kind: "call", callee, args }
}

export function arr(elements: TsExpr[]): TsExpr {
  return { kind: "array", elements }
}

/** Build an object; omit keys whose value is `undefined`. */
export function obj(properties: Record<string, TsExpr | undefined>): TsExpr {
  return {
    kind: "object",
    properties: Object.entries(properties)
      .filter((entry): entry is [string, TsExpr] => entry[1] !== undefined)
      .map(([key, value]) => ({ key, value })),
  }
}

/** Print a TS expression as source text (Prettier can reformat afterward). */
export function printTsExpr(expr: TsExpr, indent = ""): string {
  switch (expr.kind) {
    case "literal":
      return JSON.stringify(expr.value)
    case "ident":
      return expr.name
    case "call":
      return `${expr.callee}(${expr.args.map((arg) => printTsExpr(arg, indent)).join(", ")})`
    case "array": {
      if (expr.elements.length === 0) {
        return "[]"
      }
      const inner = indent + "  "
      return `[\n${expr.elements.map((el) => `${inner}${printTsExpr(el, inner)},`).join("\n")}\n${indent}]`
    }
    case "object": {
      if (expr.properties.length === 0) {
        return "{}"
      }
      const inner = indent + "  "
      return `{\n${expr.properties.map((p) => `${inner}${p.key}: ${printTsExpr(p.value, inner)},`).join("\n")}\n${indent}}`
    }
  }
}
