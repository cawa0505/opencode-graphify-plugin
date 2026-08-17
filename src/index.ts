import type { Plugin, PluginInput, Hooks, Config } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { execSync } from "child_process"
import { existsSync } from "fs"
import { startAutoUpdate } from "./auto-update.js"

const z = tool.schema

const plugin: Plugin = async (ctx: PluginInput): Promise<Hooks> => {
  startAutoUpdate(ctx) // best-effort: check npm for a newer version in the background
  const dir = ctx.directory

  return {
    config: async (cfg: Config) => {
      const c = cfg as Record<string, any>
      c.command ??= {}
      c.command["graphify-init"] = {
        description:
          "Initialize a project with graphify + statemachine infrastructure: state.json, .gitignore, and AST graph",
        template:
          "Use the `graphifyInit` tool to set up the current project. If the user specified a project directory, pass it as `project_dir`.",
      }
    },
    tool: {
      graphifyInit: tool({
        description:
          "Initialize a project with graphify + statemachine infrastructure. Creates `.opencode/state.json`, updates `.gitignore`, and builds the initial AST graph.",
        args: {
          project_dir: z.string().optional(),
        },
        execute: async (args) => {
          const target = args.project_dir || dir
          if (!existsSync(target)) {
            return { output: `Directory not found: ${target}` }
          }
          try {
            const output = execSync(`graphify init "${target}"`, {
              encoding: "utf-8",
              timeout: 120_000,
            })
            return { output: output.trim() }
          } catch (e: any) {
            return { output: e.stderr || e.message }
          }
        },
      }),
    },
  }
}

export default plugin