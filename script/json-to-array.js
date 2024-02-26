import { readFile, writeFile, readdir } from "fs/promises"
import * as path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const TARGET_DIR = path.join(__dirname, "../src/data/json")
const OUTPUT_DIR = path.join(__dirname, "../src/data/array")

/**
 * @param {Array<Record<string, unknown>>} data
 * @return {string[]}
 */
const getHeaders = (data) => {
  const [first] = data
  return Object.keys(first)
}

/**
 * @param {Array<Record<string, unknown>>} data
 * @param {string[]} headers
 * @return {unknown[][]}
 */
const toTableArray = (data, headers) => {
  return [
    headers,
    ...data.map((row) => {
      return headers.map((header) => {
        return row[header] || ""
      })
    })
  ]
}

const files = await readdir(TARGET_DIR)

for (const file of files) {
  const input = path.join(TARGET_DIR, file)
  const data = await readFile(input, "utf-8")

  const json = JSON.parse(data)
  const headers = getHeaders(json)
  const array = toTableArray(json, headers)

  const output = path.join(OUTPUT_DIR, file)
  await writeFile(output, JSON.stringify(array, null, 2))
}
