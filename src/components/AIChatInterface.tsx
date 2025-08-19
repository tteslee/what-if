'use client';

import { useState, useRef, useEffect } from 'react';
import { aiService, AIChatMessage } from '../lib/ai-service';

interface AIChatInterfaceProps {
  context: 'city' | 'intervention';
  onGenerate: (description: string) => void;
  onCancel: () => void;
}

export default function AIChatInterface({ context, onGenerate, onCancel }: AIChatInterfaceProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contextTitle = context === 'city' ? 'City Profile' : 'Intervention Profile';
  const contextDescription = context === 'city' 
    ? 'Describe the urban context you want to simulate. Include details about population, geography, challenges, and characteristics.'
    : 'Describe the intervention you want to simulate. Include details about the approach, goals, and implementation strategy.';

  useEffect(() => {
    // Add initial system message
    setMessages([
      {
        role: 'assistant',
        content: `Hello! I'm here to help you create a ${contextTitle.toLowerCase()}. ${contextDescription}`
      }
    ]);
  }, [context, contextTitle, contextDescription]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: inputValue.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.chat(userMessage.content, context);
      const assistantMessage: AIChatMessage = {
        role: 'assistant',
        content: response
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateProfile = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      // Combine all user messages to create a comprehensive description
      const userMessages = messages
        .filter(msg => msg.role === 'user')
        .map(msg => msg.content)
        .join('. ');
      
      if (!userMessages.trim()) {
        const errorMessage: AIChatMessage = {
          role: 'assistant',
          content: 'Please provide some description before generating a profile.'
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
      onGenerate(userMessages);
    } catch (error: unknown) {
      console.error('Error generating profile:', error);
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error while generating the profile. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-96 bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI Assistant</h3>
          <p className="text-sm text-slate-600">Creating {contextTitle}</p>
        </div>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 text-slate-900 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and Actions */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={handleGenerateProfile}
            disabled={isGenerating || messages.filter(m => m.role === 'user').length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? 'Generating...' : 'Generate Profile'}
          </button>
          
          <button
            onClick={() => {
              aiService.clearConversation();
              setMessages([
                {
                  role: 'assistant',
                  content: `Hello! I'm here to help you create a ${contextTitle.toLowerCase()}. ${contextDescription}`
                }
              ]);
            }}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Reset Chat
          </button>
        </div>
      </div>
    </div>
  );
}
