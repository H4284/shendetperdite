import type { Category, CategoryTreeNode } from "@/types/catalog";

export function flattenCategoryTree(tree: CategoryTreeNode[]): CategoryTreeNode[] {
  const nodes: CategoryTreeNode[] = [];
  for (const node of tree) {
    nodes.push(node, ...flattenCategoryTree(node.children));
  }
  return nodes;
}

export function categoryMap(tree: CategoryTreeNode[]): Map<string, CategoryTreeNode> {
  return new Map(flattenCategoryTree(tree).map((node) => [node.id, node]));
}

export function categoryPath(
  tree: CategoryTreeNode[],
  category: Category,
): Category[] {
  const byId = categoryMap(tree);
  const path: Category[] = [];
  let current: Category | undefined = byId.get(category.id) ?? category;

  while (current) {
    path.unshift(current);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return path;
}

export function productCategoryPath(
  tree: CategoryTreeNode[],
  categoryIds: string[],
): Category[] {
  const byId = categoryMap(tree);
  const matches = categoryIds
    .map((id) => byId.get(id))
    .filter((category): category is CategoryTreeNode => Boolean(category));

  if (matches.length === 0) return [];

  const preferred =
    matches.find((category) => category.parentId) ?? matches[0];

  return categoryPath(tree, preferred);
}
