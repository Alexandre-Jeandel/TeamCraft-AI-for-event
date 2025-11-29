import React, { useState } from 'react';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { OrganizerSetup } from './components/OrganizerSetup';
import { QuestionnaireReview } from './components/QuestionnaireReview';
import { ParticipantCollection } from './components/ParticipantCollection';
import { GroupingResults } from './components/GroupingResults';
import { AppState, AppStep, EventDetails, Group, Participant, Question } from './types';
import { generateQuestionnaire, generateMockParticipants, generateGroups } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    step: 'setup',
    eventDetails: {} as EventDetails,
    questions: [],
    participants: [],
    groups: [],
    isLoading: false,
    error: null,
  });

  const handleError = (error: any) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred." 
    }));
  };

  const handleSetupComplete = async (details: EventDetails) => {
    setState(prev => ({ ...prev, isLoading: true, error: null, eventDetails: details }));
    try {
      const questions = await generateQuestionnaire(details);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        questions, 
        step: 'questionnaire' 
      }));
    } catch (err) {
      handleError(err);
    }
  };

  const handleQuestionnaireConfirmed = () => {
    setState(prev => ({ ...prev, step: 'collection' }));
  };

  const handleGenerateMocks = async (count: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const mocks = await generateMockParticipants(count, state.questions, state.eventDetails);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        participants: [...prev.participants, ...mocks] 
      }));
    } catch (err) {
      handleError(err);
    }
  };

  const handleAnalyze = async () => {
    setState(prev => ({ ...prev, step: 'grouping', isLoading: true, error: null }));
    try {
      const groups = await generateGroups(state.eventDetails, state.questions, state.participants);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        groups, 
        step: 'results' 
      }));
    } catch (err) {
        // If grouping fails, go back to collection
      setState(prev => ({ 
          ...prev, 
          step: 'collection',
          isLoading: false, 
          error: err instanceof Error ? err.message : "Failed to generate groups."
        }));
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure? This will clear all current event data.")) {
        setState({
            step: 'setup',
            eventDetails: {} as EventDetails,
            questions: [],
            participants: [],
            groups: [],
            isLoading: false,
            error: null,
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={state.step} />

        <div className="mt-8">
            {state.error && (
                <div className="max-w-3xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{state.error}</span>
                    <button 
                        onClick={() => setState(prev => ({ ...prev, error: null }))} 
                        className="text-red-500 hover:text-red-700 font-bold"
                    >
                        ✕
                    </button>
                </div>
            )}

            {state.step === 'setup' && (
                <OrganizerSetup onNext={handleSetupComplete} isLoading={state.isLoading} />
            )}

            {state.step === 'questionnaire' && (
                <QuestionnaireReview 
                    questions={state.questions} 
                    onConfirm={handleQuestionnaireConfirmed} 
                />
            )}

            {state.step === 'collection' && (
                <ParticipantCollection 
                    questions={state.questions}
                    participants={state.participants}
                    onGenerateMocks={handleGenerateMocks}
                    onAnalyze={handleAnalyze}
                    isGeneratingMocks={state.isLoading}
                    isAnalyzing={false} // Loading state for analyze is handled by 'grouping' step usually, but visual can be here
                />
            )}
             {/* Use collection component visually but with loading overlay if needed, or simple spinner screen */}
            {state.step === 'grouping' && (
                <div className="flex flex-col items-center justify-center py-20">
                     <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />
                     <h2 className="text-2xl font-bold text-gray-800">AI is forming teams...</h2>
                     <p className="text-gray-500 mt-2">Analyzing {state.participants.length} participants against {state.questions.length} dimensions.</p>
                </div>
            )}

            {state.step === 'results' && (
                <GroupingResults 
                    groups={state.groups} 
                    participants={state.participants} 
                    onReset={handleReset} 
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
