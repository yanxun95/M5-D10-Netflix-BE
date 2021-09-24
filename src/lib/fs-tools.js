import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
const { readJSON, writeJSON } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")

const mediaJSONPath = join(dataFolderPath, "media.json")

export const getMedia = () => readJSON(mediaJSONPath)
export const writeMedia = content => writeJSON(mediaJSONPath, content)