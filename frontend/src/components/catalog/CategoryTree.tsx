/** CategoryTree component for displaying hierarchical categories. */

import { useState } from 'react';
import type { CategoryTree as CategoryTreeType } from '../../shared/types';

interface CategoryTreeProps {
  categories: CategoryTreeType[];
  onSelect?: (category: CategoryTreeType) => void;
  selectedId?: string;
  onEdit?: (category: CategoryTreeType) => void;
  onDelete?: (category: CategoryTreeType) => void;
  editable?: boolean;
}

export function CategoryTree({
  categories,
  onSelect,
  selectedId,
  onEdit,
  onDelete,
  editable = false,
}: CategoryTreeProps) {
  // Handle case where categories might not be an array (API returns object with data)
  const categoryArray = Array.isArray(categories) ? categories : [];

  return (
    <div className="category-tree">
      {categoryArray.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay categorías</p>
      ) : (
        <ul className="space-y-1">
          {categoryArray.map((category) => (
            <CategoryTreeNode
              key={category.id}
              category={category}
              level={0}
              onSelect={onSelect}
              selectedId={selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              editable={editable}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface CategoryTreeNodeProps {
  category: CategoryTreeType;
  level: number;
  onSelect?: (category: CategoryTreeType) => void;
  selectedId?: string;
  onEdit?: (category: CategoryTreeType) => void;
  onDelete?: (category: CategoryTreeType) => void;
  editable?: boolean;
}

function CategoryTreeNode({
  category,
  level,
  onSelect,
  selectedId,
  onEdit,
  onDelete,
  editable,
}: CategoryTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedId === category.id;

  return (
    <li>
      <div
        className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* Expand/collapse button */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <span className="w-5" />
        )}

        {/* Category name */}
        <span
          onClick={() => onSelect?.(category)}
          className="flex-1 text-sm font-medium text-gray-700"
        >
          {category.name}
        </span>

        {/* Actions */}
        {editable && (
          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(category);
              }}
              className="p-1 text-blue-600 hover:text-blue-800 text-xs"
              title="Editar"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(category);
              }}
              className="p-1 text-red-600 hover:text-red-800 text-xs"
              title="Eliminar"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul>
          {category.children.map((child) => (
            <CategoryTreeNode
              key={child.id}
              category={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              onEdit={onEdit}
              onDelete={onDelete}
              editable={editable}
            />
          ))}
        </ul>
      )}
    </li>
  );
}