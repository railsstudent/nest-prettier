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
      context.logger.info('Does not support .eslintrc.js')
      context.logger.info(`Append 'plugin:prettier/recommended' to extends array in ${configFileName}`)
      context.logger.info(`Append ${JSON.stringify(prettierRule)} to rules object in ${configFileName}`)
      // updateEslintJs(tree, buffer, configFileName, prettierRule)
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

// function updateEslintJs(tree: Tree, buffer: Buffer, configFileName: string, prettierRule: (string | PrettierOptions)[]) {
//   const strBuffer = buffer.toString()
//   const strippedContent = strBuffer.replace('module.exports =', '').trim()
//   const replacedQuotesContent = strippedContent.replace(new RegExp("'", 'g'), '"')
//   const dirname = '__dirname,'

//   const lines = replacedQuotesContent.split(/\r?\n/)
//   const jsonifyLines: string[] = []
//   for (let i = 0; i < lines.length; i++) {
//     const { key, value } = tokenizeKeyValue(i, lines)

//     if (value) {
//       console.log('value', value)
//       const isSingleQuoted = key[0] === "'" && key[key.length - 1] === "'"
//       const quotedKey = isSingleQuoted ? `"${key.substring(1, key.length - 1)}"` : key
//       const isDoubleQuoted = quotedKey[0] === '"' && quotedKey[quotedKey.length - 1] === '"'
//       const doubleQuotedKey = isDoubleQuoted ? quotedKey : `"${quotedKey}"`
//       const specialValue = value === dirname ? `"${value.substring(0, value.length - 1)}",` : value
//       jsonifyLines.push(`${doubleQuotedKey}: ${specialValue}`)
//     } else {
//       const lastLine = jsonifyLines.pop()
//       if (lastLine) {
//         const lineStrippedTrailComma = lastLine.endsWith(',') ? lastLine.substring(0, lastLine.length - 1) : lastLine
//         jsonifyLines.push(lineStrippedTrailComma)
//       }
//       jsonifyLines.push(key)
//     }
//   }

//   console.log(jsonifyLines)

//   const eslintJson = JSON.parse(jsonifyLines.join('\r\n'))
//   eslintJson.extends = uniq([...eslintJson.extends, 'plugin:prettier/recommended'])
//   eslintJson.rules = {
//     ...eslintJson.rules,
//     'prettier/prettier': prettierRule,
//   }

//   console.log(eslintJson)

//   const newEslintModuleExport = `module.exports = ${JSON.stringify(eslintJson, null)}`.replace('"__dirname",', dirname)
//   console.log('newEslintModuleExport', newEslintModuleExport)
//   tree.overwrite(configFileName, newEslintModuleExport)
// }

// function tokenizeKeyValue(idxLine: number, lines: string[]) {
//   const line = lines[idxLine]
//   const idxColon = line.indexOf(':')
//   const objKey = idxColon >= 0 ? line.substring(0, idxColon).trim() : line.trim()
//   const objValue = idxColon >= 0 ? line.substring(idxColon + 1).trim() : undefined

//   let strippedKey = objKey
//   let strippedValue = objValue
//   if (idxLine === lines.length - 2) {
//     if (strippedValue) {
//       if (strippedValue.endsWith(',')) {
//         strippedValue = strippedValue.substring(0, strippedValue.length - 1)
//       }
//     } else {
//       if (strippedKey.endsWith(',')) {
//         strippedKey = strippedKey.substring(0, strippedKey.length - 1)
//       }
//     }
//   } else if (idxLine === lines.length - 1) {
//     if (strippedKey.endsWith(';')) {
//       strippedKey = strippedKey.substring(0, strippedKey.length - 1)
//     }
//   }
//   return {
//     key: strippedKey,
//     value: strippedValue,
//   }
// }
