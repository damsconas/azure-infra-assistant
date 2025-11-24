import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">DevOps Tools Hub</h1>
          <p className="text-xl text-gray-600">Professional tools for modern infrastructure management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/signature"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-mail-line text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Email Signature</h2>
            <p className="text-gray-600 mb-4">
              Create professional email signatures with Experian branding
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Open Tool</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </div>
          </Link>

          <Link
            to="/azure-chat"
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
              <i className="ri-cloud-line text-3xl text-white"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Azure Assistant</h2>
            <p className="text-gray-600 mb-4">
              Query your Azure infrastructure using AI-powered natural language
            </p>
            <div className="flex items-center text-blue-600 font-medium">
              <span>Open Tool</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </div>
          </Link>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
