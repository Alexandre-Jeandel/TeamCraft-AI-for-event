import React from 'react';
import { Question } from '../types';
import { Check, Edit2, ListChecks, MessageSquare, BarChart } from 'lucide-react';

interface Props {
  questions: Question[];
  onConfirm: () => void;
}

export const QuestionnaireReview: React.FC<Props> = ({ questions, onConfirm }) => {
  const getIcon = (type: Question['type']) => {
    switch (type) {
      case 'scale': return <BarChart className="w-4 h-4 text-purple-600" />;
      case 'choice': return <ListChecks className="w-4 h-4 text-blue-600" />;
      default: return <MessageSquare className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Review Questionnaire</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          The AI has crafted these questions based on your event constraints. 
          Review them before distributing to participants.
        </p>
      </div>

      <div className="grid gap-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-500 text-sm">
                {idx + 1}
              </div>
              <div className="flex-grow space-y-2">
                <h3 className="text-lg font-medium text-gray-900">{q.text}</h3>
                
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700 uppercase tracking-wide">
                        {getIcon(q.type)}
                        {q.type}
                    </span>
                    {q.options && (
                        <span className="text-xs text-gray-500">
                            Options: {q.options.join(', ')}
                        </span>
                    )}
                </div>
              </div>
              {/* Future: Add Edit functionality */}
              {/* <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                <Edit2 className="w-4 h-4" />
              </button> */}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onConfirm}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-xl font-bold shadow-xl shadow-indigo-200 hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
          <Check className="w-5 h-5" />
          Approve & Start Collecting
        </button>
      </div>
    </div>
  );
};
