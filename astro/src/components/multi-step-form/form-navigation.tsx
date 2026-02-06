import React from "react";
import { type FieldValues } from "react-hook-form";
import { useMultiStepFormContext } from "./multi-step-form";
import { useTranslations } from "../../i18n/utils";

export interface FormNavigationProps {
  /** Optional: Custom className for the container */
  className?: string;
  /** Optional: Custom render for navigation buttons */
  renderNavigation?: (params: {
    isFirstStep: boolean;
    isLastStep: boolean;
    canGoNext: boolean;
    canGoBack: boolean;
    goToNext: () => Promise<boolean>;
    goToBack: () => void;
    currentStep: number;
    totalSteps: number;
  }) => React.ReactNode;
  /** Optional: Custom back button label */
  backLabel?: string;
  /** Optional: Custom next button label */
  nextLabel?: string;
  /** Optional: Custom submit button label */
  submitLabel?: string;
  /** Optional: Show step counter */
  showStepCounter?: boolean;
  /** Optional: Custom back button className */
  backButtonClassName?: string;
  /** Optional: Custom next button className */
  nextButtonClassName?: string;
  /** Optional: Custom submit button className */
  submitButtonClassName?: string;
}

/**
 * FormNavigation - Back/Next/Submit button controls
 *
 * Provides navigation buttons with automatic state management.
 * The Next button validates the current step before proceeding.
 * The Submit button only appears on the last step.
 *
 * @example
 * // Default rendering
 * <FormNavigation />
 *
 * // Custom labels
 * <FormNavigation
 *   backLabel="Previous"
 *   nextLabel="Continue"
 *   submitLabel="Complete Registration"
 *   showStepCounter
 * />
 *
 * // Fully custom rendering
 * <FormNavigation
 *   renderNavigation={({ goToNext, goToBack, isFirstStep, isLastStep }) => (
 *     <div>
 *       {!isFirstStep && <button onClick={goToBack}>Back</button>}
 *       {!isLastStep && <button onClick={goToNext}>Next</button>}
 *       {isLastStep && <button type="submit">Submit</button>}
 *     </div>
 *   )}
 * />
 */
export function FormNavigation<TFieldValues extends FieldValues>({
  className = "",
  renderNavigation,
  backLabel = "Back",
  nextLabel = "Next",
  submitLabel = "Submit",
  showStepCounter = false,
  backButtonClassName = "px-4 py-2 border border-gray-300 font-semibold rounded-3xl text-gray-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed",
  nextButtonClassName = "px-6 py-2 bg-brand-light text-brand-blue font-semibold rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed",
  submitButtonClassName = "px-6 py-2 bg-brand-red text-white font-semibold rounded-3xl disabled:opacity-50 disabled:cursor-not-allowed",
}: FormNavigationProps) {
  const { multiStep, form, lang } = useMultiStepFormContext<TFieldValues>();

  const t = useTranslations(lang);

  const { isSubmitting } = form.formState;

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    await multiStep.goToNext();
  };

  // Custom rendering if provided
  if (renderNavigation) {
    return (
      <div className={className}>
        {renderNavigation({
          isFirstStep: multiStep.isFirstStep,
          isLastStep: multiStep.isLastStep,
          canGoNext: multiStep.canGoNext,
          canGoBack: multiStep.canGoBack,
          goToNext: multiStep.goToNext,
          goToBack: multiStep.goToBack,
          currentStep: multiStep.currentStep,
          totalSteps: multiStep.totalSteps,
        })}
      </div>
    );
  }

  // Default rendering
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Back button */}
      <div>
        {!multiStep.isFirstStep && (
          <button
            type="button"
            onClick={multiStep.goToBack}
            disabled={!multiStep.canGoBack}
            className={backButtonClassName}
          >
            {backLabel}
          </button>
        )}
      </div>

      {/* Step counter (optional) */}
      {showStepCounter && (
        <div className="text-sm text-gray-600">
          {t("booked.step")} {multiStep.currentStep} {t("booked.step.of")}{" "}
          {multiStep.totalSteps}
        </div>
      )}

      {/* Next or Submit button */}
      <div>
        {multiStep.isLastStep ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className={submitButtonClassName}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("booked.button.processing")}
              </span>
            ) : (
              submitLabel
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!multiStep.canGoNext}
            className={nextButtonClassName}
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
