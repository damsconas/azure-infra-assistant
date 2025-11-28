import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import WelcomeScreen from './components/WelcomeScreen';
import ChatMessages from './components/ChatMessages';
import ChatInput from './components/ChatInput';
import { Conversation, Message, UploadedFile } from './types';

export default function AzureChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleNewChat = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Conversation',
      timestamp: new Date(),
      messages: []
    };
    setConversations([newConversation, ...conversations]);
    setActiveConversationId(newConversation.id);
  };

  const handleDeleteConversation = (id: string) => {
    setConversations(conversations.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleSendMessage = async (content: string, files?: UploadedFile[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    let conversationId = activeConversationId;

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : `${files?.length} file(s) uploaded`,
        timestamp: new Date(),
        messages: []
      };
      setConversations([newConversation, ...conversations]);
      conversationId = newConversation.id;
      setActiveConversationId(conversationId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      files
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, userMessage];
        const updatedTitle = conv.messages.length === 0 
          ? (content ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : `${files?.length} file(s) uploaded`)
          : conv.title;
        return { ...conv, messages: updatedMessages, title: updatedTitle };
      }
      return conv;
    }));

    setIsLoading(true);

    try {
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
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I received your query but got an empty response.',
        timestamp: new Date()
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, messages: [...conv.messages, aiMessage] };
        }
        return conv;
      }));

    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = `I encountered an error while processing your query: ${error instanceof Error ? error.message : 'Unknown error'}.`;
      
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

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return { ...conv, messages: [...conv.messages, errorMessage] };
        }
        return conv;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (query: string) => {
    handleSendMessage(query);
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={setActiveConversationId}
        onDeleteConversation={handleDeleteConversation}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader 
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <div className="flex-1 overflow-y-auto">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <WelcomeScreen onExampleClick={handleExampleClick} />
          ) : (
            <ChatMessages 
              messages={activeConversation.messages} 
              isLoading={isLoading}
            />
          )}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </div>
  );
}