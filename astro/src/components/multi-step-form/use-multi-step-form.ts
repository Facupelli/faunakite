import { useState, useCallback, useMemo } from "react";
import {
  type UseFormReturn,
  type FieldValues,
  type Path,
} from "react-hook-form";

export interface StepConfig<TFieldValues extends FieldValues> {
  step: number;
  label: string;
  fields: Path<TFieldValues>[];
  description?: string;
}

export interface UseMultiStepFormOptions<TFieldValues extends FieldValues> {
  totalSteps: number;
  steps: StepConfig<TFieldValues>[];
  form: UseFormReturn<TFieldValues>;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  allowDirectNavigation?: boolean;
}

export interface UseMultiStepFormReturn<TFieldValues extends FieldValues> {
  currentStep: number;
  totalSteps: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoNext: boolean;
  canGoBack: boolean;
  goToNext: () => Promise<boolean>;
  goToBack: () => void;
  goToStep: (step: number) => Promise<boolean>;
  currentStepConfig: StepConfig<TFieldValues>;
  stepsConfig: StepConfig<TFieldValues>[];
  getStepStatus: (step: number) => "complete" | "current" | "pending" | "error";
}

export function useMultiStepForm<TFieldValues extends FieldValues>({
  totalSteps,
  steps,
  form,
  initialStep = 1,
  onStepChange,
  allowDirectNavigation = false,
}: UseMultiStepFormOptions<TFieldValues>): UseMultiStepFormReturn<TFieldValues> {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const currentStepConfig = useMemo(
    () => steps.find((s) => s.step === currentStep)!,
    [steps, currentStep],
  );

  const progress = useMemo(
    () => ((currentStep - 1) / (totalSteps - 1)) * 100,
    [currentStep, totalSteps],
  );

  const watchedValues = form.watch();

  const canGoNext = useMemo(() => {
    const currentFields = currentStepConfig.fields;
    const errors = form.formState.errors;

    const hasErrors = currentFields.some((field) => {
      const fieldPath = field.split(".");
      let errorObj: any = errors;

      for (const path of fieldPath) {
        if (!errorObj) return false;
        errorObj = errorObj[path];
      }

      return !!errorObj;
    });

    return !hasErrors;
  }, [currentStepConfig, form.formState.errors, watchedValues]);

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    const fields = currentStepConfig.fields;

    const isValid = await form.trigger(fields);

    return isValid;
  }, [currentStepConfig, form]);

  const goToNext = useCallback(async (): Promise<boolean> => {
    if (currentStep >= totalSteps) return false;

    const isValid = await validateCurrentStep();

    if (!isValid) return false;

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    onStepChange?.(nextStep);

    return true;
  }, [currentStep, totalSteps, validateCurrentStep, onStepChange]);

  const goToBack = useCallback(() => {
    if (currentStep <= 1) return;

    const prevStep = currentStep - 1;
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  }, [currentStep, onStepChange]);

  const goToStep = useCallback(
    async (targetStep: number): Promise<boolean> => {
      if (targetStep < 1 || targetStep > totalSteps) return false;
      if (targetStep === currentStep) return true;

      // If going forward, validate all intermediate steps
      if (targetStep > currentStep) {
        if (!allowDirectNavigation) return false;

        // Validate all steps between current and target
        for (let step = currentStep; step < targetStep; step++) {
          const stepConfig = steps.find((s) => s.step === step)!;
          const isValid = await form.trigger(stepConfig.fields);

          if (!isValid) return false;
        }
      }

      setCurrentStep(targetStep);
      onStepChange?.(targetStep);
      return true;
    },
    [currentStep, totalSteps, steps, form, allowDirectNavigation, onStepChange],
  );

  // Get validation status for any step
  const getStepStatus = useCallback(
    (step: number): "complete" | "current" | "pending" | "error" => {
      if (step === currentStep) return "current";
      if (step > currentStep) return "pending";

      // Check if step has errors
      const stepConfig = steps.find((s) => s.step === step);
      if (!stepConfig) return "pending";

      const errors = form.formState.errors;
      const hasErrors = stepConfig.fields.some((field) => {
        const fieldPath = field.split(".");
        let errorObj: any = errors;

        for (const path of fieldPath) {
          if (!errorObj) return false;
          errorObj = errorObj[path];
        }

        return !!errorObj;
      });

      return hasErrors ? "error" : "complete";
    },
    [currentStep, steps, form.formState.errors],
  );

  return {
    currentStep,
    totalSteps,
    progress,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    canGoNext,
    canGoBack: currentStep > 1,
    goToNext,
    goToBack,
    goToStep,
    currentStepConfig,
    stepsConfig: steps,
    getStepStatus,
  };
}
