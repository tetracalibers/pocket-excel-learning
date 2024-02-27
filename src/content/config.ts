import { z, defineCollection, reference } from "astro:content"

const COLORS = {
  string: "rgb(219, 237, 219)",
  logical: "rgb(232, 222, 238)",
  ref: "#FAF3DD",
  lookup: "#F3EEEE",
  convert: "#FAECEC",
  total: "#F9F2F5",
  rank: "#F9F2F5"
}

const zCategory = z
  .enum(["lookup", "string", "condition", "ref", "convert", "total", "rank"])
  .transform((val) => {
    if (val === "lookup")
      return {
        label: "表引き",
        color: COLORS.lookup
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
    if (val === "ref") return { label: "セル参照", color: COLORS.ref }
    if (val === "convert") return { label: "データ型の変換", color: COLORS.convert }
    if (val === "total") return { label: "集計", color: COLORS.total }
    if (val === "rank") return { label: "データの順序", color: COLORS.rank }
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
  type: zValueType.optional(),
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
    available: zAvailableVersion,
    similarFn: z.array(reference("fn")).default([]),
    togetherFn: z.array(reference("fn")).default([]),
    relatedTopics: z.array(reference("topic")).default([])
  })
})

const topicCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    category: zCategory
  })
})

const questionsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: zCategory.array(),
    topics: z.array(reference("topic")).default([]),
    useFn: z.array(reference("fn")).default([]),
    available: zAvailableVersion,
    sheet: z.string().optional(),
    draft: z.boolean().default(false)
  })
})

export const collections = {
  fn: functionCollections,
  topic: topicCollection,
  questions: questionsCollection
}
