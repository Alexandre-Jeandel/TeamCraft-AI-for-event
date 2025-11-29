import React, { useState } from 'react';
import { Participant, Question } from '../types';
import { Users, Bot, UserPlus, Play, CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  questions: Question[];
  participants: Participant[];
  onGenerateMocks: (count: number) => void;
  onAnalyze: () => void;
  isGeneratingMocks: boolean;
  isAnalyzing: boolean;
}

export const ParticipantCollection: React.FC<Props> = ({
  questions,
  participants,
  onGenerateMocks,
  onAnalyze,
  isGeneratingMocks,
  isAnalyzing
}) => {
  const [mockCount, setMockCount] = useState(12);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-indigo-900 text-white rounded-2xl p-8 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Collection Phase</h2>
          <p className="text-indigo-200 mb-6">
            Share this link with your participants. For this demo, you can generate realistic AI personas to test the matching algorithm immediately.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
             <div className="flex-grow w-full bg-indigo-800/50 rounded-lg px-4 py-3 font-mono text-sm text-indigo-300 border border-indigo-700 flex justify-between items-center">
                <span className="truncate">https://teamcraft.ai/e/hackathon-2024/join</span>
                <span className="ml-4 text-xs bg-indigo-600 px-2 py-1 rounded text-white cursor-pointer hover:bg-indigo-500">Copy</span>
             </div>
             <button className="w-full sm:w-auto px-6 py-3 bg-white text-indigo-900 font-semibold rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Open Form
             </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Mock Generator Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Simulate Participants</h3>
            </div>
            <p className="text-gray-600 text-sm mb-6">
                Don't want to wait? Generate diverse AI personas with realistic answers to test your matching rules.
            </p>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Number of Participants</label>
                    <input 
                        type="range" 
                        min="4" 
                        max="30" 
                        value={mockCount} 
                        onChange={(e) => setMockCount(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>4</span>
                        <span className="font-bold text-purple-600">{mockCount} participants</span>
                        <span>30</span>
                    </div>
                </div>

                <button 
                    onClick={() => onGenerateMocks(mockCount)}
                    disabled={isGeneratingMocks || isAnalyzing}
                    className="w-full py-3 bg-purple-50 text-purple-700 font-semibold rounded-xl hover:bg-purple-100 border border-purple-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {isGeneratingMocks ? (
                         <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    Generate AI Participants
                </button>
            </div>
        </div>

        {/* Status Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-lg">
                    <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Current Roster</h3>
            </div>
            
            <div className="flex-grow">
                {participants.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-8">
                        <Users className="w-12 h-12 mb-3 opacity-20" />
                        <p>No participants yet.<br/>Share link or generate mock data.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                        {participants.map((p) => (
                            <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                                        {p.name.charAt(0)}
                                    </div>
                                    <span className="font-medium text-gray-700">{p.name}</span>
                                </div>
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>

      {participants.length > 0 && (
          <div className="sticky bottom-6 flex justify-center animate-in fade-in slide-in-from-bottom-4">
            <button
                onClick={onAnalyze}
                disabled={isAnalyzing || isGeneratingMocks}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-12 py-4 rounded-full font-bold shadow-2xl hover:scale-105 transition-all disabled:opacity-70 disabled:hover:scale-100"
            >
                {isAnalyzing ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analyzing & Grouping...
                    </>
                ) : (
                    <>
                        <Play className="w-5 h-5 fill-current" />
                        Create Optimal Groups
                    </>
                )}
            </button>
          </div>
      )}
    </div>
  );
};