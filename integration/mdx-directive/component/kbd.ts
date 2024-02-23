import type { TextDirective } from "mdast-util-directive"

const TAG_NAME = "AutoImportedKbd"

const importKbdComponent: Record<string, [string, string][]> = {
  "./src/components/directive/kbd.astro": [["default", TAG_NAME]]
}

const variants = new Set(["kbd"])

const isKbdNode = (node: TextDirective) => {
  return variants.has(node.name)
}

const parseKbdNode = (node: TextDirective) => {
  let shortcutKey = node.children
    .map((child) => {
      return child.type === "text" ? child.value : ""
    })
    .join("")

  return {
    name: TAG_NAME,
    attributes: { shortcutKey },
    children: []
  }
}

export const kbdText = {
  import: importKbdComponent,
  is: isKbdNode,
  parse: parseKbdNode
}
