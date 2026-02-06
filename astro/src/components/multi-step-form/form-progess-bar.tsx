import React from "react";
import { type FieldValues } from "react-hook-form";
import { useMultiStepFormContext } from "./multi-step-form";
import { useTranslations } from "../../i18n/utils";

export interface FormProgressBarProps {
  /** Optional: Custom className for the container */
  className?: string;
  /** Optional: Custom className for the progress bar */
  barClassName?: string;
  /** Optional: Custom className for the fill */
  fillClassName?: string;
  /** Optional: Show percentage text */
  showPercentage?: boolean;
  /** Optional: Custom percentage text className */
  percentageClassName?: string;
}

/**
 * FormProgressBar - Visual progress indicator
 *
 * Displays a progress bar showing completion percentage based on current step.
 * Fully customizable with className props for styling.
 *
 * @example
 * ```tsx
 * <FormProgressBar
 *   className="mb-6"
 *   barClassName="h-2 bg-gray-200 rounded-full"
 *   fillClassName="h-full bg-blue-600 rounded-full transition-all"
 *   showPercentage
 * />
 * ```
 */
export function FormProgressBar<TFieldValues extends FieldValues>({
  className = "",
  barClassName = "w-full h-2 bg-brand-blue rounded-full overflow-hidden",
  fillClassName = "h-full bg-brand-light transition-all duration-300 ease-in-out",
  showPercentage = false,
  percentageClassName = "text-sm font-semibold text-white",
}: FormProgressBarProps) {
  const { multiStep, lang } = useMultiStepFormContext<TFieldValues>();
  const t = useTranslations(lang);

  return (
    <div className={className}>
      {showPercentage && (
        <div className="flex justify-between items-center mb-2">
          <span className={percentageClassName}>
            {t("booked.step")} {multiStep.currentStep} {t("booked.step.of")}{" "}
            {multiStep.totalSteps}
          </span>
          <span className={percentageClassName}>
            {Math.round(multiStep.progress)}%
          </span>
        </div>
      )}
      <div className={barClassName}>
        <div
          className={fillClassName}
          style={{ width: `${multiStep.progress}%` }}
          role="progressbar"
          aria-valuenow={multiStep.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Step ${multiStep.currentStep} of ${multiStep.totalSteps}`}
        />
      </div>
    </div>
  );
}
