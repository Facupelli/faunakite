import React from "react";
import { type FieldValues } from "react-hook-form";
import { useMultiStepFormContext } from "./multi-step-form";

export interface FormStepProps {
  /** Step number (1-based) */
  step: number;
  /** Children to render when this step is active */
  children: React.ReactNode;
  /** Optional: Custom className for the step container */
  className?: string;
}

/**
 * FormStep - Conditional wrapper for step content
 *
 * Only renders its children when the current step matches the step prop.
 * Use this to organize your form fields into logical steps.
 *
 * @example
 * ```tsx
 * <FormStep step={1}>
 *   <h2>Personal Information</h2>
 *   <input {...register("name")} />
 *   <input {...register("email")} />
 * </FormStep>
 * ```
 */
export function FormStep<TFieldValues extends FieldValues>({
  step,
  children,
  className,
}: FormStepProps) {
  const { multiStep } = useMultiStepFormContext<TFieldValues>();

  // Only render if this is the current step
  if (multiStep.currentStep !== step) {
    return null;
  }

  return <div className={className}>{children}</div>;
}
