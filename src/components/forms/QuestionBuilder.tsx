// src/components/forms/QuestionBuilder.tsx
import React, { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiHelpCircle,
} from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import type { EvaluationQuestion } from "../../types/evaluationCategory.types";

interface QuestionBuilderProps {
  questions: EvaluationQuestion[];
  onAdd: (question: string, isRequired: boolean) => Promise<void>;
  onUpdate: (
    id: number,
    question: string,
    isRequired: boolean,
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  loading?: boolean;
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({
  questions,
  onAdd,
  onUpdate,
  onDelete,
  loading = false,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newIsRequired, setNewIsRequired] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuestion, setEditQuestion] = useState("");
  const [editIsRequired, setEditIsRequired] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!newQuestion.trim()) return;
    setIsAdding(true);
    await onAdd(newQuestion.trim(), newIsRequired);
    setNewQuestion("");
    setNewIsRequired(true);
    setIsAdding(false);
  };

  const handleUpdate = async (id: number) => {
    if (!editQuestion.trim()) return;
    await onUpdate(id, editQuestion.trim(), editIsRequired);
    setEditingId(null);
    setEditQuestion("");
    setEditIsRequired(true);
  };

  const handleEditStart = (question: EvaluationQuestion) => {
    setEditingId(question.id);
    setEditQuestion(question.question);
    setEditIsRequired(question.isRequired);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditIsRequired(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await onDelete(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Question */}
      <div className="bg-[#F4F6FA] rounded-xl p-4 border border-[#E4E8F0]">
        <div className="flex items-center gap-2 mb-3">
          <FiPlus className="h-4 w-4 text-[#3D6BFF]" />
          <h4 className="text-sm font-semibold text-[#101625]">
            Add a question
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="e.g. Was the teacher well prepared for class?"
              className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm placeholder:text-[#9AA3B8]"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#5A6478] whitespace-nowrap">
              <input
                type="checkbox"
                checked={newIsRequired}
                onChange={(e) => setNewIsRequired(e.target.checked)}
                className="h-4 w-4 rounded border-[#E4E8F0] text-[#3D6BFF] focus:ring-[#3D6BFF]/30"
              />
              Required
            </label>
            <button
              onClick={handleAdd}
              disabled={!newQuestion.trim() || isAdding}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#121A2E] text-white rounded-lg hover:bg-[#1B2740] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              <FiPlus className="h-4 w-4" />
              {isAdding ? "Adding..." : "Add Question"}
            </button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-2">
        {questions.length === 0 ?
          <div className="text-center py-8 border border-dashed border-[#E4E8F0] rounded-xl">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#EBF0FE] mb-2">
              <FiHelpCircle className="h-4.5 w-4.5 text-[#3D6BFF]" />
            </div>
            <p className="text-sm font-medium text-[#101625]">
              No questions yet
            </p>
            <p className="text-xs text-[#5A6478] mt-1">
              Add one above to build out this category.
            </p>
          </div>
        : questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-[#FBFCFE] rounded-lg border border-[#E4E8F0] p-4 hover:border-[#3D6BFF]/40 transition-all">
              {
                editingId === question.id ?
                  // Edit Mode
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        autoFocus
                        className="w-full px-4 py-2 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdate(question.id);
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-[#5A6478] whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={editIsRequired}
                          onChange={(e) => setEditIsRequired(e.target.checked)}
                          className="h-4 w-4 rounded border-[#E4E8F0] text-[#3D6BFF] focus:ring-[#3D6BFF]/30"
                        />
                        Required
                      </label>
                      <button
                        onClick={() => handleUpdate(question.id)}
                        disabled={!editQuestion.trim()}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2E56D9] transition-colors text-sm font-medium disabled:opacity-50">
                        <FiCheck className="h-3.5 w-3.5" />
                        Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex items-center gap-1.5 px-3 py-2 text-[#5A6478] hover:text-[#101625] hover:bg-[#F4F6FA] rounded-lg transition-colors text-sm">
                        <FiX className="h-3.5 w-3.5" />
                        Cancel
                      </button>
                    </div>
                  </div>
                  // View Mode
                : <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <span className="text-sm font-medium text-[#5A6478] w-6 flex-shrink-0">
                        {index + 1}.
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm text-[#101625]">
                          {question.question}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              question.isRequired ?
                                "bg-red-50 text-red-600"
                              : "bg-gray-50 text-gray-600"
                            }`}>
                            {question.isRequired ? "Required" : "Optional"}
                          </span>
                          <span className="text-xs text-[#5A6478]">
                            Order: {question.displayOrder}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditStart(question)}
                        className="p-2 hover:bg-[#F4F6FA] rounded-lg transition-colors text-[#5A6478] hover:text-[#101625]"
                        title="Edit question">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 hover:bg-[#FBEEF0] rounded-lg transition-colors text-[#5A6478] hover:text-[#C4536A]"
                        title="Delete question">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

              }
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
