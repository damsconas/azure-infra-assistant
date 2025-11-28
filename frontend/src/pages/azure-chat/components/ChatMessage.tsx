import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return 'ri-file-pdf-line';
    if (type.includes('word') || type.includes('document')) return 'ri-file-word-line';
    if (type.includes('excel') || type.includes('sheet')) return 'ri-file-excel-line';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'ri-file-ppt-line';
    if (type.includes('image')) return 'ri-image-line';
    if (type.includes('text')) return 'ri-file-text-line';
    return 'ri-file-line';
  };

  const getFileColor = (type: string) => {
    if (type.includes('pdf')) return 'text-red-400 bg-red-500/10';
    if (type.includes('word') || type.includes('document')) return 'text-blue-400 bg-blue-500/10';
    if (type.includes('excel') || type.includes('sheet')) return 'text-green-400 bg-green-500/10';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'text-orange-400 bg-orange-500/10';
    if (type.includes('image')) return 'text-purple-400 bg-purple-500/10';
    return 'text-gray-400 bg-gray-500/10';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={`flex gap-4 mb-8 animate-fade-in ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
            <i className="ri-cloud-line text-white"></i>
          </div>
        </div>
      )}
      <div className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600'
              : 'bg-gradient-to-br from-gray-800/80 to-gray-800/40 text-gray-100 border border-gray-700/50 hover:border-gray-600/50'
          }`}
        >
          {/* Files */}
          {message.files && message.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {message.files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getFileColor(file.type)} border-current/20`}
                >
                  <i className={`${getFileIcon(file.type)} text-lg`}></i>
                  <div className="flex flex-col">
                    <span className="text-gray-100 text-sm font-medium max-w-[200px] truncate">
                      {file.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message Text */}
          {message.content && (
            isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 mt-5 text-white">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium mb-2 mt-4 text-white">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 leading-relaxed text-gray-100">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1 text-gray-100">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-100">{children}</ol>,
                    li: ({ children }) => <li className="ml-4 text-gray-100">{children}</li>,
                    code: ({ children, className }) => {
                      const isInline = !className;
                      if (isInline) {
                        return (
                          <code className="bg-gray-700/50 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        );
                      }
                      return (
                        <pre className="bg-gray-900/80 text-cyan-300 p-4 rounded-lg overflow-x-auto my-4 border border-gray-700">
                          <code className="font-mono text-sm">{children}</code>
                        </pre>
                      );
                    },
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-300 bg-gray-800/30 py-2">
                        {children}
                      </blockquote>
                    ),
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-4">
                        <table className="min-w-full border-collapse border border-gray-600">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-700/50">{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => <tr className="border-b border-gray-600">{children}</tr>,
                    th: ({ children }) => (
                      <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-white">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="border border-gray-600 px-4 py-2 text-gray-100">{children}</td>
                    ),
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline transition-colors"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )
          )}
          <div className={`text-xs mt-3 ${isUser ? 'text-blue-200' : 'text-gray-500'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
      {isUser && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
          <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
            <i className="ri-user-line text-white"></i>
          </div>
        </div>
      )}
    </div>
  );
}