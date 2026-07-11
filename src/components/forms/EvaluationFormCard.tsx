// src/components/forms/EvaluationFormCard.tsx
import React, { useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiList,
  FiLink,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import type { EvaluationForm } from "../../types/evaluationForm";
import type { EvaluationLink } from "../../types/evaluationLink.types";
import { useNavigate } from "react-router-dom";

interface EvaluationFormCardProps {
  form: EvaluationForm;
  onEdit: (form: EvaluationForm) => void;
  onDelete: (form: EvaluationForm) => void;
  onGenerateLink?: (form: EvaluationForm) => void;
  periodTitle?: string;
  questionCount?: number;
  links?: EvaluationLink[];
}

export const EvaluationFormCard: React.FC<EvaluationFormCardProps> = ({
  form,
  onEdit,
  onDelete,
  onGenerateLink,
  periodTitle,
  questionCount = 0,
  links = [],
}) => {
  const navigate = useNavigate();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCardClick = () => {
    navigate(`/evaluation-forms/${form.id}`);
  };

  const handleCopy = (e: React.MouseEvent, link: EvaluationLink) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.fullLink);
    setCopiedToken(link.token);
    window.setTimeout(() => setCopiedToken(null), 2000);
  };

  const activeLinks = links.filter((link) => link.status === "active");

  return (
    <div
      className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6 hover:border-[#3D6BFF]/50 hover:shadow-sm transition-all cursor-pointer group"
      onClick={handleCardClick}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <h3
              className="text-lg font-semibold text-[#101625] truncate"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {form.title}
            </h3>
            <FiChevronRight className="h-5 w-5 text-[#5A6478] flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {periodTitle && (
            <p className="text-sm text-[#5A6478] mt-1 flex items-center gap-2">
              <FiCalendar className="h-4 w-4 flex-shrink-0" />
              <span>{periodTitle}</span>
            </p>
          )}
          {form.description && (
            <p className="text-sm text-[#5A6478] mt-2 line-clamp-2">
              {form.description}
            </p>
          )}
          <div className="flex items-center flex-wrap gap-4 mt-3">
            <p className="text-xs text-[#5A6478] flex items-center gap-1">
              <FiClock className="h-3.5 w-3.5" />
              Created: {formatDate(form.createdAt)}
            </p>
            {questionCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF0FE] text-[#3D6BFF] flex items-center gap-1">
                <FiList className="h-3 w-3" />
                {questionCount} {questionCount === 1 ? "question" : "questions"}
              </span>
            )}
          </div>

          {activeLinks.length > 0 && (
            <div className="mt-4 space-y-2">
              {activeLinks.map((link) => (
                <div
                  key={link.id}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-[#F4F6FA] rounded-lg p-2.5 border border-[#E4E8F0] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FiLink className="h-3.5 w-3.5 text-[#3D6BFF] flex-shrink-0" />
                    <code className="text-xs text-[#101625] truncate font-mono">
                      {link.fullLink}
                    </code>
                  </div>
                  <button
                    onClick={(e) => handleCopy(e, link)}
                    className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 bg-[#121A2E] text-white rounded-md hover:bg-[#1B2740] transition-colors text-xs font-medium">
                    {copiedToken === link.token ?
                      <>
                        <FiCheck className="h-3 w-3" />
                        Copied
                      </>
                    : <>
                        <FiCopy className="h-3 w-3" />
                        Copy
                      </>
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-4 flex-shrink-0">
          {onGenerateLink && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGenerateLink(form);
              }}
              className="p-2 hover:bg-[#EBF0FE] rounded-lg transition-colors text-[#5A6478] hover:text-[#3D6BFF]"
              title="Generate evaluation link">
              <FiLink className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(form);
            }}
            className="p-2 hover:bg-[#F4F6FA] rounded-lg transition-colors text-[#5A6478] hover:text-[#101625]"
            title="Edit form">
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(form);
            }}
            className="p-2 hover:bg-[#FBEEF0] rounded-lg transition-colors text-[#5A6478] hover:text-[#C4536A]"
            title="Delete form">
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
