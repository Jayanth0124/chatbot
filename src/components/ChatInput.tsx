import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Send, Paperclip, Mic, Square } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
  onStopStreaming?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  disabled = false,
  isStreaming = false,
  onStopStreaming
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isRecording && mediaRecorder) {
      mediaRecorder.stop();
    }
  }, [isRecording, mediaRecorder]);

  const handleSend = () => {
    if (message.trim() && !disabled && !isStreaming) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
  };

  const handleMicClick = async () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Microphone access is not supported in this browser.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setAudioChunks([]);

      recorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Here you can process the audioBlob, e.g., send to server or convert to text
        // For now, just log it
        console.log('Recorded audio blob:', audioBlob);
        // Stop all tracks to release the mic
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      alert('Could not access microphone: ' + error);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative flex items-end gap-3 -mt-2 sm:-mt-0">
          {/* Attachment button removed */}

          {/* Input container */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              placeholder="Message Verinox GPT..."
              disabled={disabled}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '200px' }}
            />
            
            {/* Voice input button */}
            <button
              type="button"
              onClick={handleMicClick}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${isRecording ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
              disabled={disabled || isStreaming}
              aria-label={isRecording ? 'Stop recording' : 'Start recording'}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {/* Send/Stop button */}
          {isStreaming ? (
            <button
              onClick={onStopStreaming}
              className="flex-shrink-0 p-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              <Square className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!message.trim() || disabled}
              className="flex-shrink-0 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Character count and tips */}
        <div className="flex flex-col items-center mt-2 text-xs text-gray-500">
          <div className="mb-1">
            <span className="text-center block">Verinox GPT can make mistakes. Consider checking important information.</span>
          </div>
          <span className="text-right w-full max-w-4xl">{message.length}/4000</span>
        </div>
      </div>
    </div>
  );
};
