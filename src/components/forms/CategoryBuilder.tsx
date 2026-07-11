// src/components/forms/CategoryBuilder.tsx
import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiChevronRight,
  FiFolder,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { QuestionBuilder } from "./QuestionBuilder";
import { LoadingSpinner } from "../LoadingSpinner";
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
      <div className="bg-[#F4F6FA] rounded-xl p-5 border border-[#E4E8F0]">
        <div className="flex items-center gap-2 mb-3">
          <FiPlus className="h-4 w-4 text-[#3D6BFF]" />
          <h3 className="text-sm font-semibold text-[#101625]">
            Add a category
          </h3>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category name, e.g. Classroom Management"
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm placeholder:text-[#9AA3B8]"
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
                placeholder="Description (optional)"
                className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm placeholder:text-[#9AA3B8]"
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#121A2E] text-white rounded-lg hover:bg-[#1B2740] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              <FiPlus className="h-4 w-4" />
              {isAddingCategory ? "Adding..." : "Add Category"}
            </button>
          </div>
        </div>
      </div>

      {/* Category List */}
      <div className="space-y-3">
        {categories.length === 0 ?
          <div className="text-center py-10 border border-dashed border-[#E4E8F0] rounded-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EBF0FE] mb-3">
              <FiFolder className="h-5 w-5 text-[#3D6BFF]" />
            </div>
            <p className="text-sm font-medium text-[#101625]">
              No categories yet
            </p>
            <p className="text-xs text-[#5A6478] mt-1">
              Add one above to start building out questions.
            </p>
          </div>
        : categories.map((category) => (
            <div
              key={category.id}
              className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] overflow-hidden transition-colors hover:border-[#3D6BFF]/30">
              {/* Category Header */}
              <div className="p-4">
                {
                  editingCategoryId === category.id ?
                    // Edit Mode
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          autoFocus
                          className="w-full px-4 py-2 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm"
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
                          className="w-full px-4 py-2 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm placeholder:text-[#9AA3B8]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCategory(category.id)}
                          disabled={!editCategoryName.trim()}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2E56D9] transition-colors text-sm font-medium disabled:opacity-50">
                          <FiCheck className="h-3.5 w-3.5" />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center gap-1.5 px-4 py-2 text-[#5A6478] hover:text-[#101625] hover:bg-[#F4F6FA] rounded-lg transition-colors text-sm">
                          <FiX className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                      </div>
                    </div>
                    // View Mode
                  : <div className="flex items-center justify-between gap-4">
                      <div
                        className="flex items-center gap-3 flex-1 cursor-pointer min-w-0"
                        onClick={() => toggleCategory(category.id)}>
                        <button className="text-[#5A6478] hover:text-[#3D6BFF] transition-colors flex-shrink-0">
                          {expandedCategories.has(category.id) ?
                            <FiChevronDown className="h-5 w-5" />
                          : <FiChevronRight className="h-5 w-5" />}
                        </button>
                        <div className="min-w-0">
                          <h4 className="text-sm font-medium text-[#101625] truncate">
                            {category.name}
                          </h4>
                          {category.description && (
                            <p className="text-xs text-[#5A6478] mt-0.5 truncate">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF0FE] text-[#3D6BFF] ml-auto flex-shrink-0">
                          {category.questionCount || 0}{" "}
                          {category.questionCount === 1 ?
                            "question"
                          : "questions"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleEditStart(category)}
                          className="p-2 hover:bg-[#F4F6FA] rounded-lg transition-colors text-[#5A6478] hover:text-[#101625]"
                          title="Edit category">
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 hover:bg-[#FBEEF0] rounded-lg transition-colors text-[#5A6478] hover:text-[#C4536A]"
                          title="Delete category">
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                }
              </div>

              {/* Questions */}
              {expandedCategories.has(category.id) && category.questions && (
                <div className="border-t border-[#E4E8F0] p-4 bg-[#F4F6FA]">
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
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
};
