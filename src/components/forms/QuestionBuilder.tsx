// src/components/forms/QuestionBuilder.tsx
import React, { useState } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from "react-icons/fi";
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
      <div className="bg-[#FAFAF6] rounded-lg p-4 border border-[#E4E1D9]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter question..."
              className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-[#5B6472]">
              <input
                type="checkbox"
                checked={newIsRequired}
                onChange={(e) => setNewIsRequired(e.target.checked)}
                className="h-4 w-4 rounded border-[#E4E1D9] text-[#E8A23D] focus:ring-[#E8A23D]"
              />
              Required
            </label>
            <button
              onClick={handleAdd}
              disabled={!newQuestion.trim() || isAdding}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              <FiPlus className="h-4 w-4" />
              {isAdding ? "Adding..." : "Add Question"}
            </button>
          </div>
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-2">
        {questions.length === 0 ?
          <div className="text-center py-8 text-[#5B6472]">
            <p className="text-sm">No questions added yet.</p>
            <p className="text-xs mt-1">Add a question using the form above.</p>
          </div>
        : questions.map((question, index) => (
            <div
              key={question.id}
              className="bg-white rounded-lg border border-[#E4E1D9] p-4 hover:border-[#E8A23D]/50 transition-all">
              {
                editingId === question.id ?
                  // Edit Mode
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        className="w-full px-4 py-2 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826] text-sm"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleUpdate(question.id);
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-[#5B6472]">
                        <input
                          type="checkbox"
                          checked={editIsRequired}
                          onChange={(e) => setEditIsRequired(e.target.checked)}
                          className="h-4 w-4 rounded border-[#E4E1D9] text-[#E8A23D] focus:ring-[#E8A23D]"
                        />
                        Required
                      </label>
                      <button
                        onClick={() => handleUpdate(question.id)}
                        disabled={!editQuestion.trim()}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <FiCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  // View Mode
                : <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-sm font-medium text-[#5B6472] w-6">
                        {index + 1}.
                      </span>
                      <div>
                        <p className="text-sm text-[#101826]">
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
                          <span className="text-xs text-[#5B6472]">
                            Order: {question.displayOrder}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => handleEditStart(question)}
                        className="p-2 hover:bg-[#FAFAF6] rounded-lg transition-colors text-[#5B6472] hover:text-[#101826]"
                        title="Edit question">
                        <FiEdit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-[#5B6472] hover:text-red-600"
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
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-[#E8A23D] border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};
