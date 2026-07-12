// src/components/analytics/AISummaryCard.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FiCpu,
  FiRefreshCw,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiCheck,
  FiCopy,
} from "react-icons/fi";
import { aiSummaryService } from "../../services/aiSummaryService";
import type { AnalyticsSummaryData } from "../../services/aiSummaryService";

interface AISummaryCardProps {
  data: AnalyticsSummaryData;
  title?: string;
  type?: "overall" | "teacher" | "department";
}

// A short header line on its own, e.g. "Summary:", "Next steps:" — but not
// a normal sentence that happens to contain a colon.
const isHeaderLine = (line: string) =>
  /^[A-Za-z][A-Za-z ]{1,24}:$/.test(line) && line.split(" ").length <= 4;

// Get color for header
const getHeaderColor = (header: string) => {
  const lower = header.toLowerCase();
  if (lower.includes("summary")) return "text-[#3D6BFF]";
  if (lower.includes("strength") || lower.includes("insight"))
    return "text-[#2E7D32]";
  if (
    lower.includes("improve") ||
    lower.includes("watch") ||
    lower.includes("area")
  )
    return "text-[#E65100]";
  if (lower.includes("recommend") || lower.includes("next"))
    return "text-[#6C2EB5]";
  if (lower.includes("top") || lower.includes("best")) return "text-[#00838F]";
  return "text-[#37474F]";
};

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  data,
  title = "AI Analytics Summary",
  type = "overall",
}) => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const isApiKeyConfigured =
    import.meta.env.VITE_GOOGLE_AI_API_KEY &&
    import.meta.env.VITE_GOOGLE_AI_API_KEY !== "your-google-ai-api-key-here";

  const generateSummary = useCallback(async () => {
    if (!isApiKeyConfigured) {
      setError(
        "Google AI API key is not configured. Add VITE_GOOGLE_AI_API_KEY to your .env file.",
      );
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let result = "";
      switch (type) {
        case "teacher":
          result = await aiSummaryService.generateTeacherSummary(data);
          break;
        case "department":
          result = await aiSummaryService.generateDepartmentSummary(data);
          break;
        default:
          result = await aiSummaryService.generateAnalyticsSummary(data);
      }

      setSummary(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate summary";
      setError(errorMessage);
      console.error("Summary generation error:", err);
    } finally {
      setLoading(false);
    }
  }, [data, type, isApiKeyConfigured]);

  // Auto-generate whenever the underlying data (or summary type) actually
  // changes. Guarded with a ref so it fires once per distinct data object
  // instead of on every render — relies on the parent memoizing `data`.
  const lastRequested = useRef<{
    data: AnalyticsSummaryData;
    type: string;
  } | null>(null);

  useEffect(() => {
    if (!isApiKeyConfigured) return;
    const prev = lastRequested.current;
    if (prev && prev.data === data && prev.type === type) return;
    lastRequested.current = { data, type };
    generateSummary();
  }, [data, type, isApiKeyConfigured, generateSummary]);

  const handleCopy = () => {
    navigator.clipboard?.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Parses the fixed "Summary: / Highlights: / Watch: / Next steps:"
  // format the prompts ask the model for.
  const formatSummary = (text: string) => {
    if (!text) return null;

    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let listItems: React.ReactNode[] = [];
    let listKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="space-y-2 mb-4">
            {listItems}
          </ul>,
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (isHeaderLine(trimmed)) {
        flushList();
        const headerText = trimmed.replace(/:$/, "");
        const color = getHeaderColor(headerText);
        elements.push(
          <div
            key={index}
            className={`text-sm font-bold ${color} uppercase tracking-wide mt-5 mb-2.5 first:mt-0 flex items-center gap-2`}>
            <span className="h-4 w-1 rounded-full bg-current" />
            {headerText}
          </div>,
        );
        return;
      }

      if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
        const content = trimmed.replace(/^[-•]\s*/, "");
        if (content) {
          listItems.push(
            <li
              key={index}
              className="flex items-start gap-2.5 text-sm text-[#1F2937] leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#3D6BFF] flex-shrink-0" />
              <span>{content}</span>
            </li>,
          );
        }
        return;
      }

      flushList();
      elements.push(
        <p
          key={index}
          className="text-sm text-[#1F2937] leading-relaxed mb-2.5">
          {trimmed}
        </p>,
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E8F0] shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br from-[#3D6BFF] to-[#6E8CFF] shadow-sm flex-shrink-0">
            <FiCpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3
              className="text-lg font-semibold text-[#101625]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              {loading && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EBF0FE] text-[#3D6BFF]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3D6BFF] animate-pulse" />
                  Generating
                </span>
              )}
              {summary && !loading && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32]">
                  <FiCheck className="h-3 w-3" />
                  Ready
                </span>
              )}
              {!isApiKeyConfigured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FBEEF0] text-[#C62828]">
                  <FiAlertCircle className="h-3 w-3" />
                  No API key
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {summary && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-[#5A6478] hover:bg-[#F4F6FA] transition-colors"
              title={isExpanded ? "Collapse" : "Expand"}>
              {isExpanded ?
                <FiChevronUp className="h-4 w-4" />
              : <FiChevronDown className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={generateSummary}
            disabled={loading || !isApiKeyConfigured}
            title="Regenerate summary"
            className="p-2 rounded-lg text-[#3D6BFF] hover:bg-[#EBF0FE] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <FiRefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Failed to generate summary</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[#9A3A50] hover:text-[#7A2A40] text-sm font-medium">
            Dismiss
          </button>
        </div>
      )}

      {loading && !summary && (
        <div className="space-y-3 py-4">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#EBF0FE] border-t-[#3D6BFF]" />
              <p className="text-sm text-[#5A6478]">Generating insights...</p>
            </div>
          </div>
        </div>
      )}

      {summary && isExpanded && (
        <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-5">
          <div className="prose prose-sm max-w-none">
            {formatSummary(summary)}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E4E8F0] flex items-center justify-between">
            <span className="text-xs font-medium text-[#8E97AE] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3D6BFF]" />
              Powered by Google AI Gemini
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#3D6BFF] hover:text-[#2A5BFF] transition-colors">
              {copied ?
                <>
                  <FiCheck className="h-3.5 w-3.5" /> Copied
                </>
              : <>
                  <FiCopy className="h-3.5 w-3.5" /> Copy
                </>
              }
            </button>
          </div>
        </div>
      )}

      {summary && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full text-left bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4 hover:bg-[#F4F6FA] transition-colors">
          <p className="text-sm text-[#1F2937] line-clamp-2">
            {summary
              .split("\n")
              .filter((l) => l.trim())
              .slice(0, 3)
              .join(" ") || "Summary ready"}
          </p>
          <p className="text-xs font-semibold text-[#3D6BFF] mt-2 flex items-center gap-1.5">
            <FiChevronDown className="h-3 w-3" />
            Click to expand full summary
          </p>
        </button>
      )}

      {!summary && !loading && !error && !isApiKeyConfigured && (
        <div className="text-center py-8">
          <div className="w-14 h-14 rounded-full bg-[#EBF0FE] flex items-center justify-center mx-auto mb-3">
            <FiCpu className="h-7 w-7 text-[#3D6BFF]" />
          </div>
          <p className="text-sm text-[#1F2937] font-medium">
            Add your Google AI API key
          </p>
          <p className="text-xs text-[#8E97AE] mt-1">
            Set VITE_GOOGLE_AI_API_KEY in your .env file
          </p>
        </div>
      )}
    </div>
  );
};

export default AISummaryCard;
