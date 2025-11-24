interface Conversation {
  id: string;
  title: string;
  messages: Array<{ id: string; role: string; content: string; timestamp: Date }>;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
}: SidebarProps) {
  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-0'
      } bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700/50 transition-all duration-300 flex flex-col overflow-hidden backdrop-blur-xl shadow-2xl`}
    >
      <div className="p-4 border-b border-gray-700/50">
        <button
          onClick={onNewChat}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer font-medium shadow-lg hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 whitespace-nowrap"
        >
          <i className="ri-add-line text-xl"></i>
          <span>New Chat</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
              conv.id === currentConversationId
                ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 shadow-lg'
                : 'hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
            }`}
          >
            <div
              onClick={() => onSelectConversation(conv.id)}
              className="px-4 py-3 flex items-center gap-3"
            >
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                conv.id === currentConversationId 
                  ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-500/50' 
                  : 'bg-gray-600'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200 truncate font-medium">{conv.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {conv.messages.length} {conv.messages.length === 1 ? 'message' : 'messages'}
                </p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conv.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-red-600/80 hover:bg-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer hover:scale-110 shadow-lg"
            >
              <i className="ri-delete-bin-line text-white text-sm"></i>
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700/50 bg-gradient-to-t from-gray-900 to-transparent">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800/50 rounded-xl border border-gray-700/50">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <i className="ri-cloud-line text-white"></i>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-300">Azure AI</p>
            <p className="text-xs text-gray-500">Infrastructure Assistant</p>
          </div>
        </div>
      </div>
    </div>
  );
}