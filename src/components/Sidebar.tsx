import React, { useState } from 'react';
import { Plus, MessageSquare, HelpCircle, User, X, Globe, Zap } from 'lucide-react';
import { FaGithub, FaTwitter, FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";


interface SidebarProps {
  conversations: Array<{ id: string; title: string; timestamp: Date }>;
  currentConversationId: string | null;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative top-0 left-0 h-full bg-gray-900 text-white z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        w-80 lg:w-64 flex flex-col
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md shadow-purple-500/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">Verinox GPT</span>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-1 hover:bg-gray-800 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/20 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group
                  ${currentConversationId === conv.id 
                    ? 'bg-gray-800 text-white' 
                    : 'hover:bg-gray-800 text-gray-300'
                  }
                `}
              >
                <button
                  onClick={() => onSelectConversation(conv.id)}
                  className="flex-1 text-left"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-gray-500">
                        {conv.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onDeleteConversation(conv.id)}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="Delete Chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 space-y-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm">Help & FAQ</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Language: English</span>
          </button>
          
          <div className="flex items-center gap-3 px-3 py-2 text-gray-400">
            <User className="w-4 h-4" />
            <span className="text-sm">Free Plan</span>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4 text-gray-400 text-lg mt-4">
            <a href="https://github.com/Jayanth0124" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaGithub /></a>
            <a href="mailto:jayanthdonavalli0124@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaEnvelope /></a>
            <a href="https://www.linkedin.com/in/jayanth-donavalli" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaLinkedin /></a>
            <a href="https://www.instagram.com/jayanth.chowdary__/" target="_blank" rel="noopener noreferrer" className="hover:text-white"><FaInstagram /></a>
          </div>

          {/* Branding */}
          <div className="pt-3 mt-3 border-t border-gray-800 text-center text-xs text-gray-500">
            Designed by <a href="https://jayanth.site" target="_blank" rel="noopener noreferrer" className="text-white font-semibold hover:underline">Donavalli Jayanth</a>
          </div>
        </div>
      </div>
    </>
  );
};
