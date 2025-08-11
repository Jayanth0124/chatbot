import { useState, useCallback, useRef } from 'react';
import { OpenAIService } from '../services/openai';

export interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: ChatMessage[];
}

export const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  
  const openAIService = useRef(new OpenAIService());
  const abortController = useRef<AbortController | null>(null);

  const getCurrentConversation = useCallback(() => {
    return conversations.find(conv => conv.id === currentConversationId);
  }, [conversations, currentConversationId]);

  const createNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 8),
      title: 'New Chat',
      timestamp: new Date(),
      messages: []
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    openAIService.current.clearConversation();
    
    return newConversation.id;
  }, []);

  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => {
      const filtered = prev.filter(conv => conv.id !== conversationId);
      if (currentConversationId === conversationId) {
        if (filtered.length > 0) {
          // Set current conversation to next available conversation without creating a new one
          setCurrentConversationId(filtered[0].id);
          openAIService.current.clearConversation();
        } else {
          // No conversations left, set currentConversationId to null without creating new conversation
          setCurrentConversationId(null);
          openAIService.current.clearConversation();
        }
      }
      return filtered;
    });
  }, [currentConversationId]);

  const selectConversation = useCallback((conversationId: string) => {
    setCurrentConversationId(conversationId);
    // Note: In a real app, you'd want to restore the OpenAI conversation context here
  }, []);

  const addMessage = useCallback((message: string, isBot: boolean = false, isStreaming: boolean = false) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString() + Math.random(),
      message,
      isBot,
      timestamp: new Date(),
      isStreaming
    };
    
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        const updatedMessages = [...conv.messages, newMessage];
        return {
          ...conv,
          messages: updatedMessages,
          // Update title with first user message
          title: !isBot && conv.messages.length === 0 
            ? message.slice(0, 50) + (message.length > 50 ? '...' : '')
            : conv.title
        };
      }
      return conv;
    }));
    
    return newMessage.id;
  }, [currentConversationId]);

  const updateStreamingMessage = useCallback((messageId: string, content: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, message: content }
              : msg
          )
        };
      }
      return conv;
    }));
  }, [currentConversationId]);

  const finishStreamingMessage = useCallback((messageId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg => 
            msg.id === messageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        };
      }
      return conv;
    }));
    setIsStreaming(false);
    setStreamingMessageId(null);
  }, [currentConversationId]);

  const sendMessage = useCallback(async (message: string) => {
    if (!currentConversationId) {
      createNewConversation();
    }

    // Add user message
    addMessage(message, false);
    
    // Start streaming response
    setIsTyping(true);
    setIsStreaming(true);
    
    try {
      // Create initial bot message for streaming
      const botMessageId = addMessage('', true, true);
      setStreamingMessageId(botMessageId);
      
      let streamedContent = '';
      const responseStream = await openAIService.current.sendMessage(message);
      
      setIsTyping(false);
      
      for await (const chunk of responseStream) {
        if (abortController.current?.signal.aborted) {
          break;
        }
        
        streamedContent += chunk;
        updateStreamingMessage(botMessageId, streamedContent);
      }
      
      finishStreamingMessage(botMessageId);
      
    } catch (error) {
      setIsTyping(false);
      setIsStreaming(false);
      setStreamingMessageId(null);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Sorry, I encountered an error. Please try again.';
      
      addMessage(errorMessage, true);
    }
  }, [currentConversationId, createNewConversation, addMessage, updateStreamingMessage, finishStreamingMessage]);

  const stopStreaming = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    
    if (streamingMessageId) {
      finishStreamingMessage(streamingMessageId);
    }
    
    setIsStreaming(false);
    setIsTyping(false);
  }, [streamingMessageId, finishStreamingMessage]);

  // Initialize with a default conversation if none exists
  const initializeChat = useCallback(() => {
    if (conversations.length === 0) {
      createNewConversation();
    }
  }, [conversations.length, createNewConversation]);

  return {
    conversations,
    currentConversationId,
    currentConversation: getCurrentConversation(),
    isTyping,
    isStreaming,
    sendMessage,
    createNewConversation,
    selectConversation,
    stopStreaming,
    initializeChat,
    deleteConversation
  };
};