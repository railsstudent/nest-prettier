import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks'
import { eslintConfigPrettier, eslintPluginPrettier, prettier } from './constants'
import { addDependencies } from './dependency.helper'
import { addPrettierConfig } from './prettier.helper'
import { Schema } from './schema'

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function nestPrettier(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask({ allowScripts: true }))

    addDependencies(tree, context, [prettier, eslintConfigPrettier, eslintPluginPrettier])
    return chain([
      addPrettierConfig(options)
    ])
  }
}
