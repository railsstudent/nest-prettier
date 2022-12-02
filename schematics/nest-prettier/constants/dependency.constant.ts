import { NodeDependency, NodeDependencyType } from '@schematics/angular/utility/dependencies'

export const prettier: NodeDependency = {
  name: 'prettier',
  type: NodeDependencyType.Dev,
  version: '2.8.0',
}

export const eslintConfigPrettier: NodeDependency = {
  name: 'eslint-config-prettier',
  type: NodeDependencyType.Dev,
  version: '8.5.0',
}

export const eslintPluginPrettier: NodeDependency = {
  name: 'eslint-plugin-prettier',
  type: NodeDependencyType.Dev,
  version: '4.2.1',
}
