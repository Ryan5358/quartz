import { QuartzTransformerPlugin } from "../types"
import {
  CanonicalSlug,
  RelativeURL,
  TransformOptions,
  _stripSlashes,
  canonicalizeServer,
  joinSegments,
  splitAnchor,
  transformLink,
} from "../../path"
import path from "path"
import { visit } from "unist-util-visit"
import isAbsoluteUrl from "is-absolute-url"

import chalk from "chalk"

interface Options {
  /** How to resolve Markdown paths */
  markdownLinkResolution: TransformOptions["strategy"]
  /** Strips folders from a link so that it looks nice */
  prettyLinks: boolean
}

const defaultOptions: Options = {
  markdownLinkResolution: "absolute",
  prettyLinks: true,
}

export const CrawlLinks: QuartzTransformerPlugin<Partial<Options> | undefined> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "LinkProcessing",
    htmlPlugins(ctx) {
      return [
        () => {
          return (tree, file) => {
            const curSlug = canonicalizeServer(file.data.slug!)
            const transformLink = (target: string): RelativeURL => {
              const targetSlug = _stripSlashes(transformInternalLink(target).slice(".".length))
              console.log(chalk.bgCyan(targetSlug))
              let [targetCanonical, targetAnchor] = splitAnchor(targetSlug)
              if (opts.markdownLinkResolution === "relative") {
                return targetSlug as RelativeURL
              } else if (opts.markdownLinkResolution === "shortest") {
                // if the file name is unique, then it's just the filename
                const matchingFileNames = ctx.allSlugs.filter((slug) => {
                  const parts = slug.split(path.posix.sep)
                  const fileName = parts.at(-1)
                  return targetCanonical === fileName
                })

                // only match, just use it
                if (matchingFileNames.length === 1) {
                  const targetSlug = canonicalizeServer(matchingFileNames[0])
                  return (resolveRelative(curSlug, targetSlug) + targetAnchor) as RelativeURL
                }

                // if it's not unique, then it's the absolute path from the vault root
                // (fall-through case)
              }

            const transformOptions: TransformOptions = {
              strategy: opts.markdownLinkResolution,
              allSlugs: ctx.allSlugs,
            }

            visit(tree, "element", (node, _index, _parent) => {
              // rewrite all links
              if (
                node.tagName === "a" &&
                node.properties &&
                typeof node.properties.href === "string"
              ) {
                let dest = node.properties.href as RelativeURL
                node.properties.className ??= []
                node.properties.className.push(isAbsoluteUrl(dest) ? "external" : "internal")

                // don't process external links or intra-document anchors
                if (!(isAbsoluteUrl(dest) || dest.startsWith("#"))) {
                  dest = node.properties.href = transformLink(curSlug, dest, transformOptions)
                  const canonicalDest = path.posix.normalize(joinSegments(curSlug, dest))
                  const [destCanonical, _destAnchor] = splitAnchor(canonicalDest)
                  outgoing.add(destCanonical as CanonicalSlug)
                }

                // rewrite link internals if prettylinks is on
                if (
                  opts.prettyLinks &&
                  node.children.length === 1 &&
                  node.children[0].type === "text" &&
                  !node.children[0].value.startsWith("#")
                ) {
                  node.children[0].value = path.basename(node.children[0].value)
                }
              }

              // transform all other resources that may use links
              if (
                ["img", "video", "audio", "iframe"].includes(node.tagName) &&
                node.properties &&
                typeof node.properties.src === "string"
              ) {
                if (!isAbsoluteUrl(node.properties.src)) {
                  let dest = node.properties.src as RelativeURL
                  const ext = path.extname(node.properties.src)
                  dest = node.properties.src = transformLink(curSlug, dest, transformOptions)
                  node.properties.src = dest + ext
                  node.properties.width = "100%"
                  node.properties.height = "auto"
                }
              }
            })

            file.data.links = [...outgoing]
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    links: CanonicalSlug[]
  }
}
