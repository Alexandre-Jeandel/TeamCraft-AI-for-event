import React, { useState } from 'react';
import { EventDetails } from '../types';
import { ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  onNext: (details: EventDetails) => void;
  isLoading: boolean;
}

export const OrganizerSetup: React.FC<Props> = ({ onNext, isLoading }) => {
  const [details, setDetails] = useState<EventDetails>({
    eventName: 'AI Hackathon 2024',
    context: 'A 48-hour hackathon focused on building generative AI apps. Participants range from students to senior engineers.',
    groupSize: '3-4 people',
    matchingRules: 'Mix technical and non-technical skills. Ensure at least one senior developer per team.',
    mandatoryTopics: 'Coding experience (Python/JS), Design skills, Project Management interest, Time zone.',
    matchingPhilosophy: 'Balanced teams with diverse skill sets to ensure every team can ship a product.'
  });

  const handleChange = (field: keyof EventDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(details);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Define Your Event</h2>
          <p className="text-indigo-100">Tell us about your goals, and AI will craft the perfect questionnaire.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Event Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={details.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Target Group Size</label>
              <input
                type="text"
                required
                placeholder="e.g., 4 people, Pairs, 3-5"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={details.groupSize}
                onChange={(e) => handleChange('groupSize', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Event Context & Goals</label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={details.context}
              onChange={(e) => handleChange('context', e.target.value)}
              placeholder="What is this event? Who are the participants?"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Matching Rules</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={details.matchingRules}
                onChange={(e) => handleChange('matchingRules', e.target.value)}
                placeholder="e.g., Avoid putting two leaders together, mix experience levels..."
              />
            </div>
             <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Matching Philosophy</label>
              <textarea
                required
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                value={details.matchingPhilosophy}
                onChange={(e) => handleChange('matchingPhilosophy', e.target.value)}
                placeholder="e.g., Maximize diversity, optimize for speed, create conflict-free zones..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mandatory Topics to Cover</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={details.mandatoryTopics}
              onChange={(e) => handleChange('mandatoryTopics', e.target.value)}
              placeholder="e.g., Skills, Timezone, Languages"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Thinking...
                </>
              ) : (
                <>
                  Generate Questionnaire
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
