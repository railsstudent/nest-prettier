import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics'
import { Schema } from './schema'
import { ESLINT_FILE_FORMAT } from './enum'
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
      context.logger.info('Updated eslintConfig in package.json')
      updateEslintConfig(tree, buffer, configFileName, prettierRule)
    } else if (options.eslintFileFormat === ESLINT_FILE_FORMAT.JSON) {
      context.logger.info(`Updated ${configFileName}`)
      updateEslintJson(tree, buffer, configFileName, prettierRule)
    }

    return tree
  }
}

function updateEslintConfig(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
  const packageJson = JSON.parse(buffer.toString())
  const eslintConfig = packageJson.eslintConfig || {}
  const eslintExtends = eslintConfig.extends || []
  const eslintRules = eslintConfig.rules || {}
  eslintConfig.extends = [...eslintExtends, 'plugin:prettier/recommended']
  eslintConfig.rules = { ...eslintRules, 'prettier/prettier': prettierRule }
  packageJson.eslintConfig = eslintConfig
  tree.overwrite(configFileName, JSON.stringify(packageJson, null, 2))
}

function updateEslintJson(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
  const eslintJson = JSON.parse(buffer.toString())
  eslintJson.extends = [...eslintJson.extends, 'plugin:prettier/recommended']
  eslintJson.rules = { ...eslintJson.rules, 'prettier/prettier': prettierRule }
  tree.overwrite(configFileName, JSON.stringify(eslintJson, null, 2))
}
