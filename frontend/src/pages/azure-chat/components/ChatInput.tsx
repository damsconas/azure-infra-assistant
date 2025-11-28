import { useState, useRef, useEffect } from 'react';
import FileUpload from './FileUpload';
import UploadedFiles from './UploadedFiles';
import { UploadedFile } from '../types';

interface ChatInputProps {
  onSendMessage: (message: string, files?: UploadedFile[]) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleFileSelect = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as const,
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload files to Azure Blob Storage via backend API
    for (const newFile of newFiles) {
      await uploadToAzureBlob(newFile, files.find(f => f.name === newFile.name)!);
    }
  };

  const uploadToAzureBlob = async (file: UploadedFile, originalFile: File) => {
    try {
      const formData = new FormData();
      formData.append('files', originalFile);

      // Update progress to show upload starting
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === file.id ? { ...f, progress: 10 } : f
        )
      );

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      const uploadResult = result.results.find((r: any) => r.originalName === file.name);

      if (uploadResult && uploadResult.uploadStatus === 'success') {
        // Mark as completed with actual blob URL
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === file.id
              ? {
                  ...f,
                  status: 'completed' as const,
                  progress: 100,
                  blobUrl: uploadResult.blobUrl
                }
              : f
          )
        );
      } else {
        throw new Error(uploadResult?.error || 'Upload failed');
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFiles(prev =>
        prev.map(f =>
          f.id === file.id
            ? { ...f, status: 'error' as const }
            : f
        )
      );
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = () => {
    if ((message.trim() || uploadedFiles.length > 0) && !isLoading) {
      const completedFiles = uploadedFiles.filter(f => f.status === 'completed');
      onSendMessage(message, completedFiles.length > 0 ? completedFiles : undefined);
      setMessage('');
      setUploadedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const isUploading = uploadedFiles.some(f => f.status === 'uploading');

  return (
    <div className="border-t border-gray-700/50 bg-gradient-to-b from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-4 shadow-2xl">
      <div className="max-w-3xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-3 border border-gray-700/50 group-hover:border-gray-600/50 transition-all duration-300 shadow-xl">
          <UploadedFiles files={uploadedFiles} onRemove={handleRemoveFile} />
          
          <div className="flex items-end gap-3">
            <FileUpload onFileSelect={handleFileSelect} disabled={isLoading || isUploading} />
            
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your Azure infrastructure..."
              disabled={isLoading || isUploading}
              className="flex-1 bg-transparent text-gray-100 placeholder-gray-500 resize-none outline-none max-h-32 min-h-[24px] py-2 px-2"
              rows={1}
              style={{ maxHeight: '120px' }}
            />
            
            <button
              onClick={handleSubmit}
              disabled={isLoading || isUploading || (!message.trim() && uploadedFiles.length === 0)}
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
      </div>
    </div>
  );
}