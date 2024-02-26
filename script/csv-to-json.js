import Papa from "papaparse"
import { readFile, writeFile, readdir } from "fs/promises"
import * as path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const TARGET_DIR = path.join(__dirname, "../src/data/csv")
const OUTPUT_DIR = path.join(__dirname, "../src/data/json")

const files = await readdir(TARGET_DIR)

for (const file of files) {
  const input = path.join(TARGET_DIR, file)
  const data = await readFile(input, "utf-8")

  const json = Papa.parse(data, { header: true, skipEmptyLines: true, dynamicTyping: true }).data

  const output = path.join(OUTPUT_DIR, file.replace(".csv", ".json"))
  await writeFile(output, JSON.stringify(json, null, 2))
}
