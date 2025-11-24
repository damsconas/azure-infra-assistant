import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-700/50 bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-4 shadow-2xl">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          <div className="relative flex items-end gap-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300 shadow-xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your Azure infrastructure..."
              className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none max-h-32 min-h-[24px] py-2 px-2"
              rows={1}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer disabled:cursor-not-allowed flex-shrink-0 shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 disabled:hover:scale-100"
            >
              <i className={`ri-send-plane-fill text-white ${isLoading ? 'animate-pulse' : ''}`}></i>
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Press <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-400">Enter</kbd> to send, 
          <kbd className="px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-400 ml-1">Shift + Enter</kbd> for new line
        </p>
      </form>
    </div>
  );
}