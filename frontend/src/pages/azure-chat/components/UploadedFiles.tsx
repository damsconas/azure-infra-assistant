import { UploadedFile } from '../types';

interface UploadedFilesProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

export default function UploadedFiles({ files, onRemove }: UploadedFilesProps) {
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
    if (type.includes('pdf')) return 'text-red-400';
    if (type.includes('word') || type.includes('document')) return 'text-blue-400';
    if (type.includes('excel') || type.includes('sheet')) return 'text-green-400';
    if (type.includes('powerpoint') || type.includes('presentation')) return 'text-orange-400';
    if (type.includes('image')) return 'text-purple-400';
    return 'text-gray-400';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (files.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {files.map((file) => (
        <div
          key={file.id}
          className="group relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl px-3 py-2 flex items-center gap-2 hover:border-gray-600 transition-all duration-300"
        >
          {file.status === 'uploading' && (
            <div className="absolute inset-0 bg-blue-500/10 rounded-xl overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 transition-all duration-300"
                style={{ width: `${file.progress}%` }}
              />
            </div>
          )}
          
          <div className="relative z-10 flex items-center gap-2">
            <i className={`${getFileIcon(file.type)} ${getFileColor(file.type)} text-xl`}></i>
            
            <div className="flex flex-col">
              <span className="text-gray-100 text-sm font-medium max-w-[150px] truncate">
                {file.name}
              </span>
              <span className="text-gray-500 text-xs">
                {file.status === 'uploading' ? `${file.progress}%` : formatFileSize(file.size)}
              </span>
            </div>

            {file.status === 'completed' && (
              <button
                onClick={() => onRemove(file.id)}
                className="ml-2 text-gray-400 hover:text-red-400 transition-colors duration-300"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            )}

            {file.status === 'uploading' && (
              <div className="ml-2">
                <i className="ri-loader-4-line text-blue-400 text-lg animate-spin"></i>
              </div>
            )}

            {file.status === 'completed' && (
              <div className="ml-2">
                <i className="ri-check-line text-green-400 text-lg"></i>
              </div>
            )}

            {file.status === 'error' && (
              <div className="ml-2">
                <i className="ri-error-warning-line text-red-400 text-lg"></i>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}