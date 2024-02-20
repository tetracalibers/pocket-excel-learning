import type { TextDirective } from "mdast-util-directive"

const TAG_NAME = "AutoImportedPopoverExcelFn"

const importPopoverExcelFnComponent: Record<string, [string, string][]> = {
  "./src/components/directive/popover-excel-fn.astro": [["default", TAG_NAME]]
}

const variants = new Set(["fn"])

const isPopoverExcelFnNode = (node: TextDirective) => {
  return variants.has(node.name)
}

const parsePopoverExcelFnNode = (node: TextDirective) => {
  let fn = node.children
    .map((child) => {
      return child.type === "text" ? child.value : ""
    })
    .join("")

  return {
    name: TAG_NAME,
    attributes: { fn },
    children: []
  }
}

export const popoverExcelFnText = {
  import: importPopoverExcelFnComponent,
  is: isPopoverExcelFnNode,
  parse: parsePopoverExcelFnNode
}
