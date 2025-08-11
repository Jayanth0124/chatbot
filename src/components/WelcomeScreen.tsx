import React, { useState } from 'react';
import { Zap, Globe, Shield, Brain, Code, BookOpen, Briefcase, HelpCircle } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface WelcomeScreenProps {
  onStartChat: (message: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat }) => {
  const [inputValue, setInputValue] = useState('');
  const [modalInfo, setModalInfo] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
  }>({
    isOpen: false,
    title: '',
    content: ''
  });

  const openModal = (type: 'help' | 'privacy' | 'terms') => {
    const contentMap = {
      help: `HELP CENTER

Welcome to Verinox GPT Help Center!

Getting Started:
• Simply type your question or request in the chat input box
• Be specific and clear for best results
• You can ask about any topic - from coding to cooking, from science to storytelling

Tips for Better Results:
• Break complex questions into smaller parts
• Provide context when asking technical questions
• Use examples to clarify what you're looking for

Features:
• Multi-language support - ask in any language
• Code generation and debugging assistance
• Educational explanations with step-by-step guidance
• Creative writing and brainstorming
• Data analysis and insights

Need More Help?
If you're experiencing issues or have specific questions about using Verinox GPT, feel free to ask directly in the chat. Our AI assistant is here to help!`,
      
      privacy: `PRIVACY POLICY

Last Updated: January 2024

Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use Verinox GPT.

Information We Collect:
• Chat messages and interactions with our AI assistant
• Usage data and analytics to improve our service
• Technical information like browser type and device information
• No personal identification information unless explicitly provided

How We Use Your Information:
• To provide and improve our AI assistant services
• To analyze usage patterns and enhance user experience
• To develop new features and capabilities
• To ensure security and prevent abuse

Data Security:
• All communications are encrypted using industry-standard protocols
• Data is stored securely with access controls
• Regular security audits and updates
• No selling or sharing of personal data with third parties

Your Rights:
• You can request deletion of your chat history
• You can opt out of data collection for improvement purposes
• You have the right to know what data we have about you

Contact:
For privacy-related questions, please reach out through our help center.`,
      
      terms: `TERMS OF SERVICE

Last Updated: January 2024

By using Verinox GPT, you agree to these Terms of Service.

Acceptable Use:
• Use for lawful purposes only
• Do not use to generate harmful, illegal, or malicious content
• Respect intellectual property rights
• Do not attempt to reverse engineer or exploit the service

Service Limitations:
• AI responses are generated based on training data and may not always be accurate
• We do not guarantee completeness or reliability of generated content
• Users should verify important information independently
• Service availability may vary and is subject to maintenance

User Responsibilities:
• You are responsible for how you use the generated content
• Do not share sensitive personal information in chats
• Report any bugs or security issues you discover
• Use the service in compliance with applicable laws

Intellectual Property:
• Generated content is provided for your use, but we retain rights to the service itself
• Do not claim ownership of the underlying AI technology
• Respect our trademarks and branding

Termination:
We reserve the right to suspend or terminate access for violations of these terms or for any reason at our discretion.

Changes to Terms:
We may update these terms from time to time. Continued use of the service constitutes acceptance of updated terms.`
    };

    setModalInfo({
      isOpen: true,
      title: type === 'help' ? 'Help Center' : type === 'privacy' ? 'Privacy Policy' : 'Terms of Service',
      content: contentMap[type]
    });
  };

  const closeModal = () => {
    setModalInfo(prev => ({ ...prev, isOpen: false }));
  };

  const capabilities = [
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: "Global Accessibility",
      description: "Clear, universally understandable communication in multiple languages"
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Trusted & Reliable",
      description: "Accurate information with fact-checking and source verification"
    },
    {
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      title: "Advanced Reasoning",
      description: "Complex problem-solving with step-by-step explanations"
    },
    {
      icon: <Code className="w-6 h-6 text-orange-500" />,
      title: "Code Generation",
      description: "Complete, functional solutions in multiple programming languages"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() !== '') {
      onStartChat(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Verinox GPT
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your elite AI assistant combining expert precision, educational clarity, 
            and trusted advisory capabilities for users worldwide.
          </p>
        </div>

        {/* Capabilities */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
              <div className="mb-4">{capability.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{capability.title}</h3>
              <p className="text-sm text-gray-600">{capability.description}</p>
            </div>
          ))}
        </div>

        {/* Chat Input Box replacing Example Prompts */}
        <div className="mb-12 max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Chat with Verinox GPT"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Powered by OpenAI GPT-4 • Online and ready to help</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <button 
              onClick={() => openModal('help')}
              className="flex items-center gap-1 hover:text-gray-700 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Help Center
            </button>
            <span>•</span>
            <button 
              onClick={() => openModal('privacy')}
              className="hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => openModal('terms')}
              className="hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
      
      <InfoModal
        isOpen={modalInfo.isOpen}
        onClose={closeModal}
        title={modalInfo.title}
        content={modalInfo.content}
      />
    </div>
  );
};
