// src/components/forms/EvaluationFormList.tsx
import React from "react";
import type { EvaluationForm } from "../../types/evaluationForm";
import type { EvaluationLink } from "../../types/evaluationLink.types";
import { EvaluationFormCard } from "./EvaluationFormCard";
import { FiFileText } from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";

interface EvaluationFormListProps {
  forms: EvaluationForm[];
  onEdit: (form: EvaluationForm) => void;
  onDelete: (form: EvaluationForm) => void;
  onGenerateLink?: (form: EvaluationForm) => void;
  periodTitles?: Record<number, string>;
  formLinks?: Record<number, EvaluationLink[]>;
  loading?: boolean;
}

export const EvaluationFormList: React.FC<EvaluationFormListProps> = ({
  forms,
  onEdit,
  onDelete,
  onGenerateLink,
  periodTitles = {},
  formLinks = {},
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="sm" />
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EBF0FE] mb-4">
          <FiFileText className="h-8 w-8 text-[#3D6BFF]" />
        </div>
        <h3
          className="text-lg font-semibold text-[#101625] mb-2"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          No Evaluation Forms
        </h3>
        <p className="text-sm text-[#5A6478]">
          Create your first evaluation form to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {forms.map((form) => (
        <EvaluationFormCard
          key={form.id}
          form={form}
          onEdit={onEdit}
          onDelete={onDelete}
          onGenerateLink={onGenerateLink}
          periodTitle={periodTitles[form.evaluationPeriodId]}
          links={formLinks[form.id] || []}
        />
      ))}
    </div>
  );
};
