import React from "react";
import { type FieldValues } from "react-hook-form";
import { useMultiStepFormContext } from "./multi-step-form";

export interface FormStepIndicatorProps {
  /** Optional: Custom className for the container */
  className?: string;
  /** Optional: Render prop for custom step rendering */
  renderStep?: (params: {
    step: number;
    label: string;
    status: "complete" | "current" | "pending" | "error";
    isFirst: boolean;
    isLast: boolean;
  }) => React.ReactNode;
  /** Optional: Show step labels */
  showLabels?: boolean;
  /** Optional: Enable click navigation */
  enableClickNavigation?: boolean;
}

/**
 * FormStepIndicator - Step numbers with visual status
 *
 * Displays all steps with their current status (complete, current, pending, error).
 * Supports custom rendering via renderStep prop or default styling.
 *
 * @example
 * // Default rendering
 * <FormStepIndicator showLabels />
 *
 * // Custom rendering
 * <FormStepIndicator
 *   renderStep={({ step, label, status }) => (
 *     <div className={`step step-${status}`}>
 *       <span>{step}</span>
 *       <p>{label}</p>
 *     </div>
 *   )}
 * />
 */
export function FormStepIndicator<TFieldValues extends FieldValues>({
  className = "",
  renderStep,
  showLabels = true,
  enableClickNavigation = false,
}: FormStepIndicatorProps) {
  const { multiStep } = useMultiStepFormContext<TFieldValues>();

  const handleStepClick = async (step: number) => {
    if (!enableClickNavigation) return;
    await multiStep.goToStep(step);
  };

  // Default step renderer
  const defaultRenderStep = ({
    step,
    label,
    status,
    isFirst,
    isLast,
  }: {
    step: number;
    label: string;
    status: "complete" | "current" | "pending" | "error";
    isFirst: boolean;
    isLast: boolean;
  }) => {
    // Base classes
    const stepClasses = {
      complete: "bg-green-600 text-white border-green-600",
      current: "bg-blue-600 text-white border-blue-600",
      pending: "bg-gray-200 text-gray-500 border-gray-300",
      error: "bg-red-600 text-white border-red-600",
    };

    const lineClasses = {
      complete: "bg-green-600",
      current: "bg-gray-300",
      pending: "bg-gray-300",
      error: "bg-red-600",
    };

    const isClickable = enableClickNavigation && status !== "pending";

    return (
      <div key={step} className="flex items-center flex-1">
        <div className="flex flex-col items-center flex-1">
          <button
            type="button"
            onClick={() => handleStepClick(step)}
            disabled={!isClickable}
            className={`
              w-10 h-10 rounded-full border-2 flex items-center justify-center
              font-semibold text-sm transition-all duration-200
              ${stepClasses[status]}
              ${isClickable ? "cursor-pointer hover:scale-110" : "cursor-default"}
              ${!isClickable ? "opacity-75" : ""}
            `}
            aria-current={status === "current" ? "step" : undefined}
            aria-label={`Step ${step}: ${label}`}
          >
            {status === "complete" ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : status === "error" ? (
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              step
            )}
          </button>
          {showLabels && (
            <span
              className={`
                mt-2 text-xs font-medium text-center max-w-[100px]
                ${status === "current" ? "text-blue-600" : "text-gray-600"}
              `}
            >
              {label}
            </span>
          )}
        </div>
        {!isLast && (
          <div className="flex-1 h-0.5 mx-2 -mt-5">
            <div
              className={`h-full transition-all duration-300 ${lineClasses[status]}`}
            />
          </div>
        )}
      </div>
    );
  };

  const stepRenderer = renderStep || defaultRenderStep;

  return (
    <div
      className={`flex items-start ${className}`}
      role="navigation"
      aria-label="Form steps"
    >
      {multiStep.stepsConfig.map((stepConfig, index) => {
        const status = multiStep.getStepStatus(stepConfig.step);

        return stepRenderer({
          step: stepConfig.step,
          label: stepConfig.label,
          status,
          isFirst: index === 0,
          isLast: index === multiStep.stepsConfig.length - 1,
        });
      })}
    </div>
  );
}
