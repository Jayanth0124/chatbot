import React, { useState } from "react";
import {
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // change theme if you want

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isBot,
  timestamp,
  isStreaming = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback(feedback === type ? null : type);
  };

  return (
    <div className={`group relative ${isBot ? "bg-gray-50" : "bg-white"}`}>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isBot
                  ? "bg-gradient-to-br from-blue-500 to-purple-600"
                  : "bg-gray-800"
                }
            `}
            >
              {isBot ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900">
                {isBot ? "Verinox GPT" : "You"}
              </span>
              <span className="text-xs text-gray-500">
                {timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Markdown Rendering */}
            <div className="prose prose-gray max-w-none break-words">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
              >
                {message}
              </ReactMarkdown>
            </div>


            {/* Actions */}
            {isBot && !isStreaming && (
              <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
                >
                  {copied ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  onClick={() => handleFeedback("up")}
                  className={`p-1 rounded transition-colors ${feedback === "up"
                      ? "text-green-600 bg-green-100"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                    }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleFeedback("down")}
                  className={`p-1 rounded transition-colors ${feedback === "down"
                      ? "text-red-600 bg-red-100"
                      : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                    }`}
                >
                  <ThumbsDown className="w-3 h-3" />
                </button>

                <button className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                  <RotateCcw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
