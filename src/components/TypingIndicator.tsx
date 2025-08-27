import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          {/* Bot Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Typing Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900">Verinox GPT</span>
              <span className="text-xs text-gray-500">is typing...</span>
            </div>

            {/* Animated Dots */}
            <div aria-live="polite" className="flex items-center gap-1">
              <span className="typing-dot" style={{ animationDelay: '0ms' }}></span>
              <span className="typing-dot" style={{ animationDelay: '200ms' }}></span>
              <span className="typing-dot" style={{ animationDelay: '400ms' }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
