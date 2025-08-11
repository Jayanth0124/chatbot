import React, { useEffect, useRef, useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { useChat } from './hooks/useChat';

function App() {
  const { 
    conversations, 
    currentConversationId, 
    currentConversation,
    isTyping, 
    isStreaming,
    sendMessage,
    createNewConversation,
    selectConversation,
    stopStreaming,
    initializeChat,
    deleteConversation
  } = useChat();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isTyping]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Ensure a new conversation is created on load if none exists and chat UI is shown
  React.useEffect(() => {
    if (!currentConversationId && showChat) {
      createNewConversation();
    }
  }, [currentConversationId, createNewConversation, showChat]);

  const handleStartChat = (message: string) => {
    if (!currentConversationId) {
      createNewConversation();
    }
    setShowChat(true);
    sendMessage(message);
  };

  const handleNewChat = () => {
    if (isTyping || isStreaming) {
      // Prevent creating multiple chats while typing or streaming
      return;
    }
    createNewConversation();
    setShowChat(true);
  };

  const handleDeleteConversation = (id: string) => {
    deleteConversation(id);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={selectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-gray-900">Verinox GPT</h1>
          <div className="w-9" /> {/* Spacer for centering */}
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {!showChat ? (
            <WelcomeScreen onStartChat={handleStartChat} />
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                {currentConversation?.messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.message}
                    isBot={msg.isBot}
                    timestamp={msg.timestamp}
                    isStreaming={msg.isStreaming}
                  />
                ))}

                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <ChatInput
                onSendMessage={sendMessage}
                disabled={isTyping}
                isStreaming={isStreaming}
                onStopStreaming={stopStreaming}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
