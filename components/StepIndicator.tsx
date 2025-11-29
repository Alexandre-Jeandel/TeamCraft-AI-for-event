import React from 'react';
import { AppStep } from '../types';
import { Check } from 'lucide-react';

interface Props {
  currentStep: AppStep;
}

export const StepIndicator: React.FC<Props> = ({ currentStep }) => {
  const steps: { id: AppStep; label: string }[] = [
    { id: 'setup', label: 'Setup' },
    { id: 'questionnaire', label: 'Review' },
    { id: 'collection', label: 'Collect' },
    { id: 'results', label: 'Groups' },
  ];

  const getStepStatus = (stepId: AppStep) => {
    const stepOrder = ['setup', 'questionnaire', 'collection', 'grouping', 'results'];
    // Treat 'grouping' as 'collection' visually or 'results' depending on loading, but usually just map strict ids
    const currentIndex = stepOrder.indexOf(currentStep === 'grouping' ? 'results' : currentStep);
    const stepIndex = stepOrder.indexOf(stepId);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
        {/* Connector Line */}
        <div className="absolute left-4 right-4 top-1/2 h-0.5 bg-gray-200 -z-10" />

        {steps.map((step) => {
          const status = getStepStatus(step.id);
          return (
            <div key={step.id} className="flex flex-col items-center bg-gray-50 px-2">
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                  ${status === 'completed' ? 'bg-indigo-600 border-indigo-600 text-white' : ''}
                  ${status === 'current' ? 'bg-white border-indigo-600 text-indigo-600 scale-110' : ''}
                  ${status === 'upcoming' ? 'bg-white border-gray-300 text-gray-400' : ''}
                `}
              >
                {status === 'completed' ? <Check className="w-4 h-4" /> : steps.indexOf(step) + 1}
              </div>
              <span 
                className={`
                  mt-2 text-xs font-medium uppercase tracking-wider
                  ${status === 'current' ? 'text-indigo-600' : 'text-gray-400'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
