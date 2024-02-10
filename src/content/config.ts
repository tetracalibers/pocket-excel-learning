import { z, defineCollection } from "astro:content"

const questionsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.array(
      z.enum(["lookup", "string"]).transform((val) => {
        if (val === "lookup") return "表引き"
        if (val === "string") return "文字列操作"
      })
    ),
    topics: z.array(z.string()).default([]),
    useFn: z.array(z.string()).default([]),
    availableVer: z
      .array(
        z.enum(["365", "2021", "old"]).transform((val) => {
          if (val === "365") return "Office 365"
          if (val === "2021") return "Excel 2021"
          if (val === "old") return "古いExcelでも可"
        })
      )
      .default(["old"])
  })
})

export const collections = {
  questions: questionsCollection
}
