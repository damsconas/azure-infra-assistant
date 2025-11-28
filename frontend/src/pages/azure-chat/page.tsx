import { useState, useRef, useEffect } from 'react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import Sidebar from './components/Sidebar';
import { Conversation, Message, UploadedFile } from './types';

export default function AzureChat() {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Azure VM Queries',
      messages: [],
      timestamp: new Date()
    }
  ]);
  const [currentConversationId, setCurrentConversationId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = conversations.find(c => c.id === currentConversationId);
  const messages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, files?: UploadedFile[]) => {
    if ((!content.trim() && (!files || files.length === 0)) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      files
    };

    setConversations(prev => prev.map(conv =>
      conv.id === currentConversationId
        ? {
            ...conv,
            messages: [...conv.messages, userMessage],
            title: conv.messages.length === 0 ?
              (content ? content.slice(0, 30) : `${files?.length} file(s) uploaded`) :
              conv.title
          }
        : conv
    ));

    setIsLoading(true);

    try {
      // Make API call to our backend
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: content.trim(),
          files: files?.map(f => ({
            name: f.name,
            size: f.size,
            type: f.type,
            blobUrl: f.blobUrl
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I received your query but got an empty response.',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, assistantMessage]
            }
          : conv
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = `I encountered an error while processing your query: ${error instanceof Error ? error.message : 'Unknown error'}.`;
      
      // Provide more specific guidance based on error type
      if (error instanceof Error) {
        if (error.message.includes('Azure authentication failed')) {
          errorContent = 'Azure authentication failed. Please check your Azure credentials in the backend .env file. File uploads will still work, but querying Azure resources requires valid credentials.';
        } else if (error.message.includes('OpenAI connection failed')) {
          errorContent = 'Azure OpenAI connection failed. Please check your OpenAI configuration in the backend .env file.';
        } else if (error.message.includes('HTTP error! status: 400')) {
          errorContent = 'The backend server responded with an error. This is likely due to invalid Azure or OpenAI configuration. Please check your .env file settings.';
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv =>
        conv.id === currentConversationId
          ? {
              ...conv,
              messages: [...conv.messages, errorMessage]
            }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id && conversations.length > 1) {
      const remainingConvs = conversations.filter(c => c.id !== id);
      setCurrentConversationId(remainingConvs[0].id);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="h-14 border-b border-gray-700/50 backdrop-blur-xl bg-gray-800/80 flex items-center justify-between px-4 shadow-lg">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-700/50 rounded-lg transition-all duration-200 cursor-pointer hover:scale-110"
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Azure Infrastructure Assistant
            </span>
          </div>
          <div className="w-8"></div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-2xl px-4 animate-fade-in">
                <div className="relative mb-8 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                    <i className="ri-cloud-line text-4xl text-white"></i>
                  </div>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Azure Infrastructure Assistant
                </h2>
                <p className="text-gray-400 mb-12 text-lg">
                  Ask me anything about your Azure resources. I can help you query VMs, storage accounts, databases, and more.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <button
                    onClick={() => handleSendMessage('What is the size of my production VM?')}
                    className="group p-5 bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:from-gray-700/80 hover:to-gray-700/40 rounded-2xl text-left transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-blue-500/50 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="ri-server-line text-white"></i>
                      </div>
                      <span className="font-semibold text-gray-100">VM Information</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">What is the size of my production VM?</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('List all storage accounts in my subscription')}
                    className="group p-5 bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:from-gray-700/80 hover:to-gray-700/40 rounded-2xl text-left transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-purple-500/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="ri-database-2-line text-white"></i>
                      </div>
                      <span className="font-semibold text-gray-100">Storage Accounts</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">List all storage accounts in my subscription</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('Show me the status of all VMs in resource group XYZ')}
                    className="group p-5 bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:from-gray-700/80 hover:to-gray-700/40 rounded-2xl text-left transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-green-500/50 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="ri-pulse-line text-white"></i>
                      </div>
                      <span className="font-semibold text-gray-100">Resource Status</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">Show me the status of all VMs in resource group XYZ</p>
                  </button>
                  <button
                    onClick={() => handleSendMessage('What are the costs for my Azure resources this month?')}
                    className="group p-5 bg-gradient-to-br from-gray-800/80 to-gray-800/40 hover:from-gray-700/80 hover:to-gray-700/40 rounded-2xl text-left transition-all duration-300 cursor-pointer border border-gray-700/50 hover:border-yellow-500/50 backdrop-blur-sm hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <i className="ri-money-dollar-circle-line text-white"></i>
                      </div>
                      <span className="font-semibold text-gray-100">Cost Analysis</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">What are the costs for my Azure resources this month?</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex gap-4 mb-8 animate-fade-in">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <i className="ri-cloud-line text-white"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}