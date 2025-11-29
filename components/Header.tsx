import React from 'react';
import { Users, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-indigo-100 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">TeamCraft AI</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini 2.5</span>
        </div>
      </div>
    </header>
  );
};
