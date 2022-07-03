import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { Schema } from './schema'
import { ESLINT_FILE_FORMAT } from './enum'
import { PrettierOptions } from './types'
import { uniq } from 'lodash'

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
      updateEslintJs(tree, configFileName, prettierRule)
    }

    context.logger.info(`Added eslint-plugin-prettier`)
    return tree
  }
}

function updateEslintConfig(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
  const packageJson = JSON.parse(buffer.toString())
  const { eslintConfig = {} } = packageJson.eslintConfig || {}
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

// function updateEslintJs(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
//   const eslintJson = JSON.parse(buffer.toString())
//   // eslintJson.extends = [...eslintJson.extends, 'plugin:prettier/recommended']
//   // eslintJson.rules = { ...eslintJson.rules, 'prettier/prettier': prettierRule }
//   // tree.overwrite(configFileName, JSON.stringify(eslintJson, null, 2))
// }
