// Registry helpers removed for this project. Stubs provided so imports
// elsewhere in the codebase continue to type-check during build.

export interface Component {
  name: string;
  type: string;
  title: string;
  description?: string;
  files?: { path: string; type: string; target: string }[];
}

export function getRegistryItems(): Component[] {
  return [];
}

export function getRegistryItem(name: string): Component {
  throw new Error(`Registry not available: component "${name}" not found`);
}

export function getBlocks() {
  return [] as Component[];
}

export function getUIPrimitives() {
  return [] as Component[];
}

export function getComponents() {
  return [] as Component[];
}
