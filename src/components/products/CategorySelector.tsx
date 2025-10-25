"use client";

import Select from "../../components/common/Select";

interface CategorySelectorProps {
  categories: { id: string; name: string; slug: string }[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  isLoading: boolean;
}

export function CategorySelector({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading,
}: CategorySelectorProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
      <Select
        label="Product Category"
        value={selectedCategoryId}
        onChange={onSelectCategory}
        options={[
          { value: '', label: isLoading ? 'Loading...' : 'Select a category' },
          ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
        ]}
        disabled={isLoading}
        required
      />
    </div>
  );
}

