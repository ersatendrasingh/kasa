"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackToolEvent } from "@/lib/tool-analytics";

type ToolEventConfig = {
  primary?: string;
  completed?: string;
  downloaded?: string;
  copied?: string;
  printed?: string;
  shared?: string;
};

const EVENTS: Record<string, ToolEventConfig> = {
  "final-year-project-kit-generator": { primary: "project_kit_generation_started", completed: "project_kit_generated", downloaded: "project_starter_zip_downloaded", copied: "project_kit_copied", shared: "project_kit_shared" },
  "resume-ats-checker": { downloaded: "ats_report_downloaded" },
  "ai-resume-builder": { primary: "resume_generation_started", completed: "resume_generated", downloaded: "resume_downloaded", copied: "resume_copied", printed: "resume_printed", shared: "resume_shared" },
  "ai-career-roadmap": { primary: "roadmap_generation_started", completed: "roadmap_generated", downloaded: "roadmap_downloaded", copied: "roadmap_copied", printed: "roadmap_printed" },
  "resume-builder-studio": { downloaded: "resume_downloaded", copied: "resume_copied", printed: "resume_printed", shared: "resume_shared" },
  "attendance-calculator": { completed: "attendance_calculated" },
  "marks-percentage-calculator": { completed: "marks_percentage_calculated" },
  "gpa-calculator": { completed: "gpa_calculated" },
  "grade-calculator": { completed: "weighted_grade_calculated" },
  "final-exam-calculator": { completed: "final_score_required_calculated", downloaded: "result_downloaded", copied: "result_copied", printed: "result_printed" },
  "study-timetable-generator": { completed: "timetable_generated", downloaded: "timetable_downloaded", copied: "timetable_copied", printed: "timetable_printed", shared: "timetable_shared" },
  "scholarship-eligibility-calculator": { completed: "scholarship_eligibility_checked", downloaded: "result_downloaded", copied: "result_copied", printed: "result_printed" },
  "study-hours-calculator": { completed: "study_hours_calculated", downloaded: "study_plan_downloaded", copied: "study_plan_copied" },
  "assignment-deadline-planner": { completed: "deadline_plan_generated", downloaded: "assignment_plan_downloaded", copied: "assignment_plan_copied" },
  "exam-score-goal-planner": { completed: "score_goal_plan_generated", downloaded: "score_goal_plan_downloaded", copied: "score_goal_plan_copied" },
  "cgpa-percentage-converter": { completed: "cgpa_percentage_converted", downloaded: "conversion_result_downloaded", copied: "conversion_result_copied" },
  "board-percentage-calculator": { completed: "board_percentage_calculated", downloaded: "board_result_downloaded", copied: "board_result_copied" },
  "worksheet-generator": { primary: "worksheet_generation_started", completed: "worksheet_generated", downloaded: "worksheet_downloaded", copied: "worksheet_copied", printed: "worksheet_printed" },
  "report-card-generator": { primary: "report_card_generation_started", completed: "report_card_generated", downloaded: "report_card_downloaded", copied: "report_card_copied", printed: "report_card_printed" },
  "assignment-generator": { primary: "assignment_generation_started", completed: "assignment_generated", downloaded: "assignment_downloaded", copied: "assignment_copied", printed: "assignment_printed" },
  "lesson-plan-generator": { primary: "lesson_plan_generation_started", completed: "lesson_plan_generated", downloaded: "lesson_plan_downloaded", copied: "lesson_plan_copied", printed: "lesson_plan_printed" },
  "quiz-generator": { primary: "quiz_generation_started", completed: "quiz_generated", downloaded: "quiz_downloaded", copied: "quiz_copied", printed: "quiz_printed" },
  "question-paper-generator": { primary: "question_paper_generation_started", completed: "question_paper_generated", downloaded: "question_paper_downloaded", copied: "question_paper_copied", printed: "question_paper_printed" },
  "course-pricing-calculator": { completed: "course_pricing_calculated", downloaded: "pricing_plan_downloaded", copied: "pricing_plan_copied" },
  "profit-calculator": { completed: "academy_profit_calculated", downloaded: "profit_report_downloaded", copied: "profit_report_copied" },
  "fee-receipt-generator": { completed: "fee_receipt_created", downloaded: "receipt_downloaded", copied: "receipt_copied", printed: "receipt_printed" },
  "admission-form-generator": { completed: "admission_form_created", downloaded: "admission_form_downloaded", copied: "admission_form_copied", printed: "admission_form_printed" },
  "batch-capacity-calculator": { completed: "batch_capacity_calculated", downloaded: "capacity_report_downloaded", copied: "capacity_report_copied" },
  "certificate-generator": { completed: "certificate_created", downloaded: "certificate_pdf_downloaded", copied: "certificate_copied", printed: "certificate_printed" },
};

function getTool(pathname: string) {
  const match = pathname.match(/^\/(?:tools|pdf-tools)\/([^/?#]+)/);
  return match?.[1] ?? null;
}

function textFor(target: EventTarget | null) {
  const element = target instanceof Element ? target.closest("button, a") : null;
  return element?.textContent?.replace(/\s+/g, " ").trim().toLowerCase() ?? "";
}

/** Tracks shared tool actions centrally, keeping all input content out of analytics. */
export function ToolAnalytics() {
  const pathname = usePathname();
  const started = useRef(false);
  const calculationTimer = useRef<number | null>(null);

  useEffect(() => {
    const tool = getTool(pathname);
    if (!tool || pathname.startsWith("/pdf-tools/")) return;
    const config = EVENTS[tool] ?? {};
    started.current = false;
    trackToolEvent("tool_viewed", { tool_slug: tool, tool_area: "education" });

    const base = { tool_slug: tool, tool_area: "education" };
    const markStarted = () => {
      if (started.current) return;
      started.current = true;
      trackToolEvent("tool_started", base);
    };
    const onChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
      markStarted();
      if (target instanceof HTMLInputElement && target.type === "file") {
        trackToolEvent("tool_file_selected", { ...base, input_kind: "file" });
      }
      // Live calculators render their outcome immediately after valid inputs change.
      if (!config.primary && config.completed) {
        if (calculationTimer.current) window.clearTimeout(calculationTimer.current);
        calculationTimer.current = window.setTimeout(() => trackToolEvent(config.completed!, base), 550);
      }
    };
    const onClick = (event: MouseEvent) => {
      const label = textFor(event.target);
      if (!label) return;
      markStarted();
      if (/\breset\b/.test(label)) trackToolEvent("tool_reset", base);
      if (/(generate|calculate|convert|create)/.test(label) && config.primary) trackToolEvent(config.primary, base);
      if (/\bdownload/.test(label) && config.downloaded) trackToolEvent(config.downloaded, base);
      if (/\bcopy\b/.test(label) && config.copied) trackToolEvent(config.copied, base);
      if (/\bprint\b/.test(label) && config.printed) trackToolEvent(config.printed, base);
      if (/\bshare\b/.test(label) && config.shared) trackToolEvent(config.shared, base);
      if (tool === "resume-ats-checker" && /keyword/.test(label)) trackToolEvent("keyword_analysis_opened", base);
      if (tool === "resume-ats-checker" && /apply to improved draft/.test(label)) trackToolEvent("improvement_applied", base);
    };
    const completed = new Set<string>();
    const observer = new MutationObserver((records) => {
      if (!config.completed || completed.has(config.completed)) return;
      const changedText = records
        .flatMap((record) => [...record.addedNodes])
        .map((node) => node.textContent ?? "")
        .join(" ")
        .toLowerCase();
      // Every generator shows one of these success messages only after its result
      // has been created. We deliberately inspect UI copy, never form values.
      if (/(generated successfully|generated\.|analysis is ready|report generated|ready to copy|ready to save|ready to download)/.test(changedText)) {
        completed.add(config.completed);
        trackToolEvent(config.completed, base);
      }
    });
    document.addEventListener("change", onChange, true);
    document.addEventListener("click", onClick, true);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("click", onClick, true);
      observer.disconnect();
      if (calculationTimer.current) window.clearTimeout(calculationTimer.current);
    };
  }, [pathname]);

  return null;
}
