import React, { useState } from 'react';
import { ResumeData } from '../../types/resume';
import { Sparkles, Send, Bot, User, RefreshCw, X, Lightbulb } from 'lucide-react';
import { AIService } from '../../services/aiService';

interface AICoachPanelProps {
  resume: ResumeData;
  activeSection: string;
  onClose?: () => void;
  onApplyImprovement?: (field: string, value: any) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedActions?: string[];
}

export const AICoachPanel: React.FC<AICoachPanelProps> = ({
  resume,
  activeSection,
  onClose,
  onApplyImprovement,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${resume.personalInfo?.fullName?.split(' ')[0] || 'there'}! I'm your AI Resume Coach. I'm currently reviewing your **${activeSection}** section. How can I assist you with keyword optimization, metric quantification, or role-targeting today?`,
      suggestedActions: [
        'How can I improve my bullet points?',
        'What high-priority keywords are missing?',
        'Suggest an executive summary',
        'Review my quantified metrics',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await AIService.coachChat({
        message: textToSend,
        history,
        currentResume: resume,
        activeSection,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply,
        suggestedActions: res.suggestedActions,
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'I ran into an issue connecting to the AI career service. Please try asking again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Coach Header */}
      <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-100">AI Career Coach</h4>
            <span className="text-[10px] text-indigo-400 font-medium">Context: {activeSection}</span>
          </div>
        </div>

        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Suggested Action Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1">
                  {msg.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(act)}
                      className="text-[10px] bg-slate-900/80 hover:bg-indigo-700 text-slate-300 hover:text-white px-2 py-0.5 rounded-md border border-slate-700 transition-colors text-left"
                    >
                      {act}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5 text-slate-300" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-[11px] p-2 bg-slate-800/50 rounded-lg w-fit">
            <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
            <span>AI Coach is crafting personalized guidance...</span>
          </div>
        )}
      </div>

      {/* Input Field */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask AI Coach for advice or rewrite help..."
            className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
