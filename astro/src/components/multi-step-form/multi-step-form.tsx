import React, { createContext, useContext } from "react";
import { type FieldValues, type UseFormReturn } from "react-hook-form";
import {
  useMultiStepForm,
  type UseMultiStepFormOptions,
  type UseMultiStepFormReturn,
} from "./use-multi-step-form";
import { actions } from "astro:actions";

// Context for multi-step form state
interface MultiStepFormContextValue<TFieldValues extends FieldValues> {
  lang: "es" | "en";
  multiStep: UseMultiStepFormReturn<TFieldValues>;
  form: UseFormReturn<TFieldValues>;
}

const MultiStepFormContext =
  createContext<MultiStepFormContextValue<any> | null>(null);

// Hook to access multi-step form context
export function useMultiStepFormContext<TFieldValues extends FieldValues>() {
  const context = useContext(MultiStepFormContext);

  if (!context) {
    throw new Error(
      "useMultiStepFormContext must be used within a MultiStepForm component",
    );
  }

  return context as MultiStepFormContextValue<TFieldValues>;
}

// MultiStepForm component props
export interface MultiStepFormProps<TFieldValues extends FieldValues>
  extends Omit<UseMultiStepFormOptions<TFieldValues>, "form"> {
  lang: "es" | "en";
  /** React Hook Form instance */
  form: UseFormReturn<TFieldValues>;
  /** Form submission handler */
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  /** Children components */
  children: React.ReactNode;
  /** Optional: Custom form className */
  className?: string;
  /** Optional: Custom form id */
  id?: string;
}

/**
 * MultiStepForm - Main container component for multi-step forms
 *
 * Provides context for all child components and manages form submission.
 * Use this as the root component for your multi-step form.
 *
 * @example
 * ```tsx
 * <MultiStepForm
 *   form={form}
 *   totalSteps={6}
 *   steps={stepsConfig}
 *   onSubmit={handleSubmit}
 * >
 *   <FormProgressBar />
 *   <FormStepIndicator />
 *   <FormStep step={1}>
 *     {/* Step 1 fields *\/}
 *   </FormStep>
 *   <FormNavigation />
 * </MultiStepForm>
 * ```
 */
export function MultiStepForm<TFieldValues extends FieldValues>({
  lang,
  form,
  totalSteps,
  steps,
  initialStep,
  onStepChange,
  allowDirectNavigation,
  onSubmit,
  children,
  className,
  id,
}: MultiStepFormProps<TFieldValues>) {
  // Initialize multi-step form logic
  const multiStep = useMultiStepForm({
    form,
    totalSteps,
    steps,
    initialStep,
    onStepChange,
    allowDirectNavigation,
  });

  // Handle form submission
  const handleSubmit = form.handleSubmit(onSubmit);

  // Context value
  const contextValue: MultiStepFormContextValue<TFieldValues> = {
    multiStep,
    form,
    lang,
  };

  return (
    <MultiStepFormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={className} id={id} noValidate>
        {children}
      </form>
    </MultiStepFormContext.Provider>
  );
}
