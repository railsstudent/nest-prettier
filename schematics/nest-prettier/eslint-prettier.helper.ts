import { apply, Rule, SchematicContext, template, Tree, mergeWith, url } from '@angular-devkit/schematics'
import { strings } from '@angular-devkit/core'
import { uniq } from 'lodash'

import { ESLINT_FILE_FORMAT } from './enum'
import { Schema } from './schema'
import { PrettierOptions } from './types'

export function addEslintPrettier(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const { eslintFileFormat, ...prettierOptions } = options

    const configFileMap: Record<string, string> = {
      [ESLINT_FILE_FORMAT.PACKAGE_JSON]: 'package.json',
      [ESLINT_FILE_FORMAT.JSON]: '.eslintrc.json',
      [ESLINT_FILE_FORMAT.JAVASCRIPT]: '.eslintrc.js',
    }
    const configFileName = configFileMap[eslintFileFormat]
    const buffer = tree.read(configFileName)
    if (!buffer) {
      return tree
    }

    const prettierRule = ['error', prettierOptions]
    if (options.eslintFileFormat === ESLINT_FILE_FORMAT.PACKAGE_JSON) {
      updateEslintConfig(tree, buffer, configFileName, prettierRule)
    } else if (options.eslintFileFormat === ESLINT_FILE_FORMAT.JSON) {
      updateEslintJson(tree, buffer, configFileName, prettierRule)
    } else if (options.eslintFileFormat === ESLINT_FILE_FORMAT.JAVASCRIPT) {
      context.logger.info('Does not support .eslintrc.js')
      const eslintTemplate = './eslintrc-prettier.template'
      if (tree.exists(eslintTemplate)) {
        tree.delete(eslintTemplate)
      }

      const sourceTemplate = url('./files')
      const sourceParameterizedTemplate = apply(sourceTemplate, [
        template({
          ...options,
          ...strings,
        }),
      ])
      context.logger.info(`Append plugin and rule from ${eslintTemplate} to ${configFileName}. Then, delete the template file.`)
      return mergeWith(sourceParameterizedTemplate)(tree, context)
    }

    context.logger.info(`Added eslint-plugin-prettier`)
    return tree
  }
}

function updateEslintConfig(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
  const packageJson = JSON.parse(buffer.toString())
  const eslintConfig = packageJson.eslintConfig || {}
  const { extends: eslintExtends = [], rules = {} } = eslintConfig

  packageJson.eslintConfig = {
    ...eslintConfig,
    extends: uniq([...eslintExtends, 'plugin:prettier/recommended']),
    rules: {
      ...rules,
      'prettier/prettier': prettierRule,
    },
  }
  tree.overwrite(configFileName, JSON.stringify(packageJson, null, 2))
}

function updateEslintJson(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
  const eslintJson = JSON.parse(buffer.toString())
  eslintJson.extends = uniq([...eslintJson.extends, 'plugin:prettier/recommended'])
  eslintJson.rules = {
    ...eslintJson.rules,
    'prettier/prettier': prettierRule,
  }
  tree.overwrite(configFileName, JSON.stringify(eslintJson, null, 2))
}
