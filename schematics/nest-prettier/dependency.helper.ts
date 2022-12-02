import { SchematicContext, Tree } from '@angular-devkit/schematics';
import {
  addPackageJsonDependency,
  getPackageJsonDependency,
  NodeDependency,
} from '@schematics/angular/utility/dependencies';

export function addDependencies(tree: Tree, context: SchematicContext, dependencies: NodeDependency[]) {
  const pkgPath = 'package.json';
  for (const dependency of dependencies) {
    const result = getPackageJsonDependency(tree, dependency.name, pkgPath);
    if (!result) {
      addPackageJsonDependency(tree, dependency);
      context.logger.info(`Added ${dependency.name}@${dependency.version}`);
    } else {
      context.logger.info(`Found ${dependency.name}@${dependency.version}, do not add dependency`);
    }
  }
}
