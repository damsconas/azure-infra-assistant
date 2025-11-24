
import { useState, useEffect } from 'react';

export default function SignatureCard() {
  const [isVisible, setIsVisible] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div 
      id="signature-card"
      className={`transition-all duration-1000 transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <table cellPadding="0" cellSpacing="0" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.4' }}>
        <tbody>
          <tr>
            <td style={{ paddingRight: '20px', verticalAlign: 'top' }}>
              <div className={`transition-all duration-800 delay-300 ${logoLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                <img 
                  src="https://static.readdy.ai/image/21148c9c68349bef7f90880b07befde8/77feb059cd7bb795ecb1fcdc1978e6e3.png"
                  alt="Experian Logo"
                  style={{ 
                    width: '120px', 
                    height: 'auto',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                  onLoad={() => setLogoLoaded(true)}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
            </td>
            <td style={{ borderLeft: '3px solid #4F46E5', paddingLeft: '20px', verticalAlign: 'top' }}>
              <div className={`transition-all duration-800 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#1F2937',
                    marginBottom: '2px'
                  }}>
                    Your Name
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: '#4F46E5',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}>
                    Senior DevOps Engineer
                  </div>
                </div>
                
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                    color: '#1F2937',
                    marginBottom: '4px'
                  }}>
                    Experian
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    Global Information Services
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#374151' }}>
                  <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>📞</span>
                    <a href="tel:+444993845594" style={{ color: '#4F46E5', textDecoration: 'none' }}>
                      +44 499 384 5594
                    </a>
                  </div>
                  <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>✉️</span>
                    <a href="mailto:your.email@experian.com" style={{ color: '#4F46E5', textDecoration: 'none' }}>
                      your.email@experian.com
                    </a>
                  </div>
                  <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>🌐</span>
                    <a href="https://www.experian.com" style={{ color: '#4F46E5', textDecoration: 'none' }}>
                      www.experian.com
                    </a>
                  </div>
                </div>

                <div style={{ 
                  fontSize: '10px', 
                  color: '#9CA3AF',
                  borderTop: '1px solid #E5E7EB',
                  paddingTop: '8px',
                  marginTop: '8px'
                }}>
                  <div style={{ marginBottom: '2px' }}>
                    <strong>Experian:</strong> Unlocking the power of data to create opportunities for consumers, businesses and society.
                  </div>
                  <div>
                    This email and any attachments are confidential and may be privileged.
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
