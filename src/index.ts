import type { Plugin, PluginInput, Hooks, Config } from "@opencode-ai/plugin"

const plugin: Plugin = async (_ctx: PluginInput): Promise<Hooks> => {
  return {
    config: async (cfg: Config) => {
      const c = cfg as Record<string, any>
      c.command ??= {}
      c.command["graphify-init"] = {
        description:
          "Initialize a project with graphify + statemachine infrastructure: state.json, .gitignore, and AST graph",
        template:
          "Run `graphify init <project_dir>` to set up the project. This creates `.opencode/state.json`, updates `.gitignore`, and builds the initial AST graph. If no directory is given, use the current directory.",
      }
    },
  }
}

export default plugin