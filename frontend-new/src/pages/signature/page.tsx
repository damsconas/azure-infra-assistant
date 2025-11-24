
import { useState } from 'react';
import SignatureCard from './components/SignatureCard';

export default function Signature() {
  const [copied, setCopied] = useState(false);

  const handleCopySignature = () => {
    const signatureElement = document.getElementById('signature-card');
    if (signatureElement) {
      const range = document.createRange();
      range.selectNode(signatureElement);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Email Signature Generator</h1>
          <p className="text-lg text-gray-600">Professional signature card for Experian</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Signature</h2>
            <button
              onClick={handleCopySignature}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-file-copy-line"></i>
              {copied ? 'Copied!' : 'Copy Signature'}
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
            <SignatureCard />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How to Use</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <p>Click the "Copy Signature" button above to copy the signature to your clipboard</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <p>Open your email client (Outlook, Gmail, etc.) and go to signature settings</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <p>Paste the signature into your email signature field</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">4</span>
              </div>
              <p>Save your settings and your professional signature is ready to use!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
