import { sequence } from "astro:middleware"
import { addHeadingIds } from "./heading"

export const onRequest = sequence(addHeadingIds)
