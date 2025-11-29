import React from 'react';
import { Group, Participant } from '../types';
import { ShieldCheck, AlertTriangle, Star, User, Sparkles } from 'lucide-react';

interface Props {
  groups: Group[];
  participants: Participant[]; // in case we want to show unassigned
  onReset: () => void;
}

export const GroupingResults: React.FC<Props> = ({ groups, onReset }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-3xl font-bold text-gray-900">Optimal Grouping Configuration</h2>
            <p className="text-gray-600">Generated based on your rules and participant compatibility.</p>
        </div>
        <button 
            onClick={onReset}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
        >
            Start New Event
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {groups.map((group) => (
          <div key={group.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-6 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-indigo-900">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{group.members.length} members</span>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-current" />
                            <span className="text-sm font-semibold text-gray-700">{group.compatibilityScore}% match</span>
                        </div>
                    </div>
                </div>
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                    {group.members.length}
                </div>
            </div>

            <div className="p-6 space-y-6 flex-grow">
                {/* Members */}
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Team Composition</h4>
                    <div className="space-y-3">
                        {group.members.map((member) => (
                            <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/50 hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800 text-sm">{member.name}</p>
                                    <p className="text-xs text-indigo-600 font-medium">{member.role}</p>
                                </div>
                                {member.strengths && member.strengths.length > 0 && (
                                    <div className="hidden sm:flex gap-1">
                                        {member.strengths.slice(0, 2).map((s, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-[10px] text-gray-500">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Analysis */}
                <div className="space-y-4">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 mb-2">
                            <Sparkles className="w-4 h-4" />
                            Why this works
                        </h4>
                        <p className="text-sm text-blue-900 leading-relaxed">
                            {group.justification}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2 uppercase">
                                <ShieldCheck className="w-3 h-3" />
                                Key Strengths
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                {group.strengths.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <span className="mt-1 block w-1 h-1 rounded-full bg-emerald-400" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div>
                            <h4 className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2 uppercase">
                                <AlertTriangle className="w-3 h-3" />
                                Potential Risks
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                {group.risks.map((s, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                        <span className="mt-1 block w-1 h-1 rounded-full bg-amber-400" />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};