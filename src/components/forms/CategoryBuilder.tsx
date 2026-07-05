// src/components/forms/CategoryBuilder.tsx
import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { QuestionBuilder } from "./QuestionBuilder";
import type { EvaluationCategory } from "../../types/evaluationCategory.types";

interface CategoryBuilderProps {
  categories: EvaluationCategory[];
  onAddCategory: (name: string, description?: string) => Promise<void>;
  onUpdateCategory: (
    id: number,
    name: string,
    description?: string,
  ) => Promise<void>;
  onDeleteCategory: (id: number) => Promise<void>;
  onAddQuestion: (
    categoryId: number,
    question: string,
    isRequired: boolean,
  ) => Promise<void>;
  onUpdateQuestion: (
    id: number,
    question: string,
    isRequired: boolean,
  ) => Promise<void>;
  onDeleteQuestion: (id: number) => Promise<void>;
  loading?: boolean;
}

export const CategoryBuilder: React.FC<CategoryBuilderProps> = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  onAddQuestion,
  onUpdateQuestion,
  onDeleteQuestion,
  loading = false,
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  );
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsAddingCategory(true);
    await onAddCategory(
      newCategoryName.trim(),
      newCategoryDescription.trim() || undefined,
    );
    setNewCategoryName("");
    setNewCategoryDescription("");
    setIsAddingCategory(false);
  };

  const handleEditStart = (category: EvaluationCategory) => {
    setEditingCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || "");
  };

  const handleEditCancel = () => {
    setEditingCategoryId(null);
    setEditCategoryName("");
    setEditCategoryDescription("");
  };

  const handleUpdateCategory = async (id: number) => {
    if (!editCategoryName.trim()) return;
    await onUpdateCategory(
      id,
      editCategoryName.trim(),
      editCategoryDescription.trim() || undefined,
    );
    setEditingCategoryId(null);
    setEditCategoryName("");
    setEditCategoryDescription("");
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category and all its questions?",
      )
    ) {
      await onDeleteCategory(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Category */}
      <div className="bg-[#FAFAF6] rounded-lg p-4 border border-[#E4E1D9]">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name..."
                className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Category description (optional)..."
                className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
            </div>
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isAddingCategory}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              <FiPlus className="h-4 w-4" />
              {isAddingCategory ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-4">
        {categories.length === 0 ?
          <div className="text-center py-8 text-[#5B6472]">
            <p className="text-sm">No categories added yet.</p>
            <p className="text-xs mt-1">Add a category using the form above.</p>
          </div>
        : categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg border border-[#E4E1D9] overflow-hidden">
              {/* Category Header */}
              <div className="p-4 hover:bg-[#FAFAF6] transition-colors">
                {
                  editingCategoryId === category.id ?
                    // Edit Mode
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          className="w-full px-4 py-2 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editCategoryDescription}
                          onChange={(e) =>
                            setEditCategoryDescription(e.target.value)
                          }
                          placeholder="Description..."
                          className="w-full px-4 py-2 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={!editCategoryName.trim()}
                          className="px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm disabled:opacity-50">
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-4 py-2 text-[#5B6472] hover:text-[#101826] rounded-lg transition-colors text-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                    // View Mode
                  : <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer"
                        onClick={() => toggleCategory(category.id)}>
                        <button className="text-[#5B6472] hover:text-[#101826] transition-colors">
                          {expandedCategories.has(category.id) ?
                            <FiChevronDown className="h-5 w-5" />
                          : <FiChevronRight className="h-5 w-5" />}
                        </button>
                        <div>
                          <h4 className="text-sm font-medium text-[#101826]">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-xs text-[#5B6472] mt-0.5">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs text-[#5B6472] ml-auto">
                          {category.questionCount || 0} questions
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditStart(category)}
                          className="p-2 hover:bg-[#FAFAF6] rounded-lg transition-colors text-[#5B6472] hover:text-[#101826]"
                          title="Edit category">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-[#5B6472] hover:text-red-600"
                          title="Delete category">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                }
              </div>

              {/* Questions */}
              {expandedCategories.has(category.id) && category.questions && (
                <div className="border-t border-[#E4E1D9] p-4 bg-[#FAFAF6]">
                  <QuestionBuilder
                    questions={category.questions}
                    onAdd={(question: string, isRequired: boolean) =>
                      onAddQuestion(category.id, question, isRequired)
                    }
                    onUpdate={onUpdateQuestion}
                    onDelete={onDeleteQuestion}
                    loading={loading}
                  />
                </div>
              )}
            </div>
          ))
        }
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
