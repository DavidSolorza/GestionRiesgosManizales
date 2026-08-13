import { useEffect, useRef, useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
}

export function Captcha({ onVerify }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [error, setError] = useState(false);

  const generateCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setUserInput('');
    setError(false);
    onVerify(false); // Reset verification

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (lines)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Add noise (dots)
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw text
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw characters with slight rotation and distortion
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      ctx.translate(20 + i * 20, canvas.height / 2);
      ctx.rotate((Math.random() - 0.5) * 0.4);
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  }, [onVerify]);

  useEffect(() => {
    generateCaptcha();
  }, [generateCaptcha]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    if (value.length === captchaText.length) {
      const isValid = value.toLowerCase() === captchaText.toLowerCase();
      setError(!isValid);
      onVerify(isValid);
    } else {
      setError(false);
      onVerify(false);
    }
  };

  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        Verificación de seguridad <span className="text-alert-600">*</span>
      </label>
      <div className="flex gap-2 items-center mb-3">
        <canvas 
          ref={canvasRef} 
          width="150" 
          height="40" 
          className="rounded-lg border border-slate-300 bg-white"
        />
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-200 rounded-lg transition-colors"
          title="Generar nuevo código"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
      <input 
        type="text" 
        required
        maxLength={6}
        placeholder="Ingresa el código"
        className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm ${
          error ? 'border-alert-500 focus:ring-alert-500' : 'border-slate-200 focus:ring-brand-500'
        }`}
        value={userInput}
        onChange={handleChange}
      />
      {error && <p className="text-alert-600 text-xs mt-1 font-medium">El código no coincide. Intenta de nuevo.</p>}
    </div>
  );
}
