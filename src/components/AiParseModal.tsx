import React, { useState } from 'react';
import { Sparkles, X, RefreshCw, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { CalendarEvent } from '../types';

interface AiParseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventsParsed: (newEvents: CalendarEvent[]) => void;
}

export const AiParseModal: React.FC<AiParseModalProps> = ({
  isOpen,
  onClose,
  onEventsParsed
}) => {
  if (!isOpen) return null;

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<CalendarEvent[]>([]);

  const samplePromptText = `Akbank Yapay Zeka ve Generative AI Giriş Eğitimi Takvimi
📚 Self-Paced Eğitim: 7 Ağustos 2026 – 27 Ağustos 2026 (courses.10million.ai)
🎉 Açılış Webinarı: 7 Ağustos 2026 Cuma Saat: 20.00 (YouTube)
☕ Tanışma Oturumu: 10 Ağustos 2026 Pazartesi Saat: 20.00 (Teams)
📖 Eğitim Webinarı: 17 Ağustos 2026 Pazartesi Saat: 20.00 (YouTube)
👩‍🏫 Mentor Toplantısı: 24 Ağustos 2026 Pazartesi Saat: 20.00 (Teams)`;

  const handleParse = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/parse-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ayrıştırma işlemi başarısız oldu.');
      }

      setParsedPreview(data.events || []);
    } catch (err: any) {
      setError(err.message || 'Yapay Zeka servisine ulaşılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (parsedPreview.length > 0) {
      onEventsParsed(parsedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Metinden Etkinlik Çıkarıcı</h3>
              <p className="text-xs text-indigo-300 font-normal">Gelen e-posta veya mesaj metnini yapıştırın, etkinlikleri sizin için düzenleyelim</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-800">Duyuru veya Mesaj Metni:</label>
              <button
                type="button"
                onClick={() => setText(samplePromptText)}
                className="text-indigo-600 hover:underline font-semibold text-[11px] cursor-pointer"
              >
                Örnek Metin Doldur
              </button>
            </div>
            <textarea
              rows={6}
              placeholder="E-posta, WhatsApp veya Discord üzerinden gelen duyuru metnini buraya yapıştırabilirsiniz..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-end">
            <button
              onClick={handleParse}
              disabled={loading || !text.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Etkinlikleri Çıkar</span>
            </button>
          </div>

          {/* Parsed Events Preview */}
          {parsedPreview.length > 0 && (
            <div className="mt-4 pt-4 border-t space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center justify-between">
                <span>Bulunan Etkinlikler ({parsedPreview.length})</span>
                <span className="text-emerald-600 text-xs font-medium">✓ Başarıyla çözümlendi</span>
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {parsedPreview.map((ev, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{ev.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {ev.startDate} | Yer: {ev.location || 'Belirtilmedi'}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-800 font-medium">
                      {ev.type}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleImport}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 transition shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ajandaya Ekle</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
