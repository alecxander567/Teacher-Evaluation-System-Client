// src/components/forms/EvaluationFormList.tsx
import React from "react";
import type { EvaluationForm } from "../../types/evaluationForm";
import type { EvaluationLink } from "../../types/evaluationLink.types";
import { EvaluationFormCard } from "./EvaluationFormCard";
import { FiFileText } from "react-icons/fi";

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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  if (forms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FBEEDC] mb-4">
          <FiFileText className="h-8 w-8 text-[#B8791F]" />
        </div>
        <h3
          className="text-lg font-semibold text-[#101826] mb-2"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          No Evaluation Forms
        </h3>
        <p className="text-sm text-[#5B6472]">
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
