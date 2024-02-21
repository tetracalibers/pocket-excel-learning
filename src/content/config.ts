import { z, defineCollection, reference } from "astro:content"

const COLORS = {
  string: "rgb(219, 237, 219)",
  logical: "rgb(232, 222, 238)"
}

const zCategory = z.enum(["lookup", "string", "condition"]).transform((val) => {
  if (val === "lookup")
    return {
      label: "表引き",
      color: "#fdba74"
    }
  if (val === "string")
    return {
      label: "文字列操作",
      color: COLORS.string
    }
  if (val === "condition")
    return {
      label: "条件分岐",
      color: COLORS.logical
    }
})

const zAvailableVersion = z
  .array(
    z.enum(["365", "2021", "old"]).transform((val) => {
      if (val === "365") return "Office 365"
      if (val === "2021") return "Excel 2021"
      if (val === "old") return "古いExcelでも可"
    })
  )
  .default(["old"])

const zFnArgument = z.object({
  summary: z.string(),
  default: z.string().optional(),
  pattern: z
    .array(
      z.object({
        value: z.string(),
        behavior: z.string()
      })
    )
    .optional()
})

export type FnArgument = z.infer<typeof zFnArgument>

const zValueType = z.enum(["string", "number", "boolean", "error"]).transform((val) => {
  if (val === "string")
    return {
      label: "文字列",
      color: COLORS.string
    }
  if (val === "number")
    return {
      label: "数値",
      color: "#67e8f9"
    }
  if (val === "boolean")
    return {
      label: "真偽値",
      color: COLORS.logical
    }
  if (val === "error")
    return {
      label: "エラー",
      color: "#fca5a5"
    }
})

const zFnReturn = z.object({
  type: zValueType,
  summary: z.coerce.string(),
  if: z.string().optional()
})
export type FnReturn = z.infer<typeof zFnReturn>

const functionCollections = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    args: z.array(zFnArgument).default([]),
    return: z.union([zFnReturn, z.array(zFnReturn.required())]).optional(),
    category: zCategory,
    available: zAvailableVersion
  })
})

const questionsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: zCategory.array(),
    topics: z.array(z.string()).default([]),
    useFn: z.array(reference("fn")).default([]),
    available: zAvailableVersion
  })
})

export const collections = {
  fn: functionCollections,
  questions: questionsCollection
}
