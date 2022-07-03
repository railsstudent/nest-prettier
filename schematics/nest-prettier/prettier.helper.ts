import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { Schema } from './schema'

export function addPrettierConfig(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const prettierOptions: Record<string, string | number | boolean> = {
      singleQuote: options.singleQuote,
      trailingComma: options.trailComma,
      tabWidth: options.tabWidth,
      semi: options.semi,
      printWidth: options.printWidth,
      bracketSpacing: options.bracketSpacing,
      useTabs: options.useTabs,
    }

    const configFileName = '.prettierrc'
    if (tree.exists(configFileName)) {
      tree.overwrite(configFileName, JSON.stringify(prettierOptions, null, 2))
      context.logger.info(`${configFileName} is overwritten`)
    } else {
      tree.create(configFileName, JSON.stringify(prettierOptions, null, 2))
      context.logger.info(`Created ${configFileName}`)
    }
    return tree
  }
}
