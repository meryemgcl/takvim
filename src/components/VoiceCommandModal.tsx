import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Sparkles,
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  ArrowRight,
  Layers,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { ParsedVoiceCommand, parseVoiceCommandWithGemini, getCategoryBadgeStyle } from '../services/geminiNlpService';
import { dispatchSmartVoiceTask, DispatchResult } from '../services/smartTaskDispatcher';
import { CalendarEvent, TaskItem, UserAuth } from '../types';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserAuth | null;
  onAddLocalEvent: (event: CalendarEvent) => void;
  onAddLocalTask: (task: TaskItem) => void;
  onShowToast: (msg: string) => void;
}

type ModalStep = 'listening' | 'processing' | 'preview' | 'success' | 'error';

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  user,
  onAddLocalEvent,
  onAddLocalTask,
  onShowToast
}) => {
  const [step, setStep] = useState<ModalStep>('listening');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [manualText, setManualText] = useState<string>('');
  const [parsedData, setParsedData] = useState<ParsedVoiceCommand | null>(null);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0.3);

  // Örnek sesli komutlar
  const exampleCommands = [
    "Yarın saat 15:00'te KPSS Vatandaşlık soru çözümü yap",
    "Pazartesi TÜBİTAK 2209 proje raporunu teslim et",
    "Akşam 20:00'de Akbank mentorluk toplantısına katıl",
    "Cuma günü kişisel kitap okuma saati"
  ];

  // Web Speech API Başlatma
  useEffect(() => {
    if (!isOpen) {
      stopRecording();
      setStep('listening');
      setTranscript('');
      setParsedData(null);
      setDispatchResult(null);
      setErrorMessage('');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage('Mikrofon izni verilmedi. Lütfen tarayıcı izinlerinden mikrofonu açın.');
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;

      // Modal açıldığında otomatik dinlemeye başla
      startRecording();
    } catch (err) {
      console.error('Speech recognition init error:', err);
      setIsSpeechSupported(false);
    }

    return () => {
      stopRecording();
    };
  }, [isOpen]);

  // Mikrofon Ses Seviyesi Simülasyonu / Analizörü
  useEffect(() => {
    if (isRecording) {
      const interval = setInterval(() => {
        setAudioLevel(0.2 + Math.random() * 0.8);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0.2);
    }
  }, [isRecording]);

  const startRecording = () => {
    setErrorMessage('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        // Zaten çalışıyor olabilir
      }
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {}
    }
    setIsRecording(false);
  };

  // Komutu Gemini AI ile Çözümle
  const handleProcessCommand = async (textToProcess?: string) => {
    const text = textToProcess || transcript || manualText;
    if (!text || text.trim().length < 3) {
      setErrorMessage('Lütfen önce bir komut söyleyin veya yazın.');
      return;
    }

    stopRecording();
    setStep('processing');
    setErrorMessage('');

    try {
      const parsed = await parseVoiceCommandWithGemini(text);
      setParsedData(parsed);
      setStep('preview');
    } catch (err: any) {
      console.error('NLP Parse error:', err);
      setErrorMessage(err.message || 'Komut analiz edilirken bir hata oluştu.');
      setStep('error');
    }
  };

  // Onay ve Dağıtma (Google Takvim & Tasks)
  const handleConfirmAndDispatch = async () => {
    if (!parsedData) return;

    setStep('processing');
    try {
      const result = await dispatchSmartVoiceTask({
        parsed: parsedData,
        user,
        onAddLocalEvent,
        onAddLocalTask
      });

      setDispatchResult(result);
      setStep('success');
      onShowToast(`🎉 ${result.message}`);
    } catch (err: any) {
      console.error('Dispatch error:', err);
      setErrorMessage(err.message || 'Görev ve takvim kaydı dağıtılırken bir sorun oluştu.');
      setStep('error');
    }
  };

  // Sıfırla ve yeniden başla
  const handleReset = () => {
    setTranscript('');
    setManualText('');
    setParsedData(null);
    setDispatchResult(null);
    setErrorMessage('');
    setStep('listening');
    startRecording();
  };

  if (!isOpen) return null;

  const badgeStyle = parsedData ? getCategoryBadgeStyle(parsedData.category) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg bg-[#0F1420] border border-[#263047] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative text-[#F1F5F9]"
      >
        {/* Modal Üst Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E273D] bg-[#151B2B]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Akıllı Sesli Asistan
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#A5B4FC] border border-[#6366F1]/40">
                  Gemini AI
                </span>
              </h2>
              <p className="text-xs text-[#94A3B8]">Sesinizle Takvim & Tasks'e anında görev ekleyin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#1E273D] text-[#94A3B8] hover:text-white flex items-center justify-center hover:bg-[#263047] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Gövde */}
        <div className="p-6 flex flex-col items-center">
          {/* DURUM 1: Dinleme / Ses Kaydı */}
          {step === 'listening' && (
            <div className="w-full flex flex-col items-center text-center">
              {/* Parlayan Dalga Animasyonu ve Mikrofon */}
              <div className="relative my-6 flex items-center justify-center">
                {isRecording && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                      className="absolute w-36 h-36 rounded-full bg-[#6366F1]/20 blur-xl pointer-events-none"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.9, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                      className="absolute w-28 h-28 rounded-full bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 pointer-events-none"
                    />
                  </>
                )}

                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition cursor-pointer relative z-10 ${
                    isRecording
                      ? 'bg-gradient-to-tr from-[#EC4899] to-[#EF4444] text-white shadow-[#EC4899]/50 animate-pulse'
                      : 'bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] text-white shadow-[#6366F1]/50 hover:scale-105'
                  }`}
                  title={isRecording ? 'Kaydı Durdur' : 'Dinlemeyi Başlat'}
                >
                  {isRecording ? <Mic className="w-9 h-9" /> : <MicOff className="w-9 h-9" />}
                </button>
              </div>

              {/* Dalga Ses Çubukları */}
              <div className="flex items-center justify-center gap-1.5 h-6 mb-4">
                {[40, 75, 100, 60, 90, 45, 80, 50, 95, 65, 30].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={
                      isRecording
                        ? {
                            height: [`${Math.max(6, h * 0.2)}px`, `${Math.max(8, h * audioLevel)}px`, `${Math.max(6, h * 0.2)}px`]
                          }
                        : { height: '6px' }
                    }
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 3) * 0.2,
                      ease: 'easeInOut'
                    }}
                    className={`w-1.5 rounded-full ${
                      isRecording ? 'bg-gradient-to-t from-[#6366F1] to-[#EC4899]' : 'bg-[#263047]'
                    }`}
                  />
                ))}
              </div>

              <div className="mb-4">
                <span className="text-sm font-semibold text-[#E2E8F0]">
                  {isRecording ? 'Dinliyorum... 🎙️' : 'Konuşmak için mikrofona dokunun'}
                </span>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  Örn: "Yarın saat 15:00'te KPSS Vatandaşlık soru çözümü yap"
                </p>
              </div>

              {/* Canlı Transkript Kutusu */}
              <div className="w-full bg-[#151B2B] border border-[#263047] rounded-2xl p-4 min-h-[72px] flex items-center justify-center text-center mb-4 relative">
                {transcript ? (
                  <p className="text-sm font-medium text-[#F8FAFC] leading-relaxed italic">
                    "{transcript}"
                  </p>
                ) : (
                  <p className="text-xs text-[#64748B]">
                    Söyledikleriniz burada canlı olarak yazıya dökülecek...
                  </p>
                )}
              </div>

              {/* Manuel Metin Girişi veya Alternatif */}
              <div className="w-full flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleProcessCommand(manualText);
                  }}
                  placeholder="veya buraya yazın (Örn: Cuma 14:00 TÜBİTAK toplantısı)"
                  className="flex-1 bg-[#151B2B] border border-[#263047] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#6366F1]"
                />
                <button
                  onClick={() => handleProcessCommand(manualText || transcript)}
                  disabled={!transcript && !manualText}
                  className="px-4 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:hover:bg-[#6366F1] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-[#6366F1]/20"
                >
                  <span>Ayrıştır</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Hızlı Örnek Komut Rozetleri */}
              <div className="w-full text-left">
                <p className="text-[11px] font-semibold text-[#64748B] mb-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#A5B4FC]" /> Hızlı Deneme Örnekleri:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exampleCommands.map((cmd, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTranscript(cmd);
                        handleProcessCommand(cmd);
                      }}
                      className="text-[11px] px-2.5 py-1.5 rounded-lg bg-[#1E273D]/70 hover:bg-[#1E273D] text-[#CBD5E1] hover:text-white border border-[#263047] transition text-left cursor-pointer"
                    >
                      🗣️ {cmd}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DURUM 2: İşleniyor (Gemini AI NLP) */}
          {step === 'processing' && (
            <div className="w-full py-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                  className="w-full h-full rounded-full border-3 border-[#6366F1]/30 border-t-[#6366F1] border-r-[#8B5CF6]"
                />
                <Sparkles className="w-6 h-6 text-[#A5B4FC] absolute inset-0 m-auto animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Gemini AI Analiz Ediyor... 🤖</h3>
              <p className="text-xs text-[#94A3B8] max-w-xs">
                Doğal dil komutunuzdan tarih, saat, kategori ve hatırlatıcı parametreleri çıkarılıyor.
              </p>
            </div>
          )}

          {/* DURUM 3: Önizleme & Onay Kartı */}
          {step === 'preview' && parsedData && (
            <div className="w-full flex flex-col text-left">
              <div className="mb-4 pb-3 border-b border-[#1E273D]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#94A3B8]">Algılanan Komut:</span>
                  {badgeStyle && (
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badgeStyle.dot }} />
                      {badgeStyle.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#CBD5E1] italic">"{parsedData.rawCommand}"</p>
              </div>

              {/* Yapılandırılmış Görev Kartı */}
              <div className="bg-[#151B2B] border border-[#263047] rounded-2xl p-4 mb-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-1">
                    Görev / Etkinlik Başlığı
                  </label>
                  <input
                    type="text"
                    value={parsedData.title}
                    onChange={(e) => setParsedData({ ...parsedData, title: e.target.value })}
                    className="w-full bg-[#0F1420] border border-[#263047] rounded-xl px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-[#6366F1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0F1420] border border-[#263047] rounded-xl p-2.5 flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-[#6366F1] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#64748B] font-medium">Hedef Tarih</p>
                      <p className="text-xs font-bold text-white">{parsedData.dueDate}</p>
                    </div>
                  </div>

                  <div className="bg-[#0F1420] border border-[#263047] rounded-xl p-2.5 flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#06B6D4] shrink-0" />
                    <div>
                      <p className="text-[10px] text-[#64748B] font-medium">Saat</p>
                      <p className="text-xs font-bold text-white">
                        {parsedData.hasSpecificTime && parsedData.dueTime
                          ? parsedData.dueTime
                          : 'Tüm Gün (To-Do)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dağıtım Hedefleri Bilgilendirmesi */}
                <div className="pt-2 border-t border-[#1E273D] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {parsedData.hasSpecificTime
                        ? 'Google Takvim: Belirtilen saatte etkinlik olarak yerleşir.'
                        : 'Google Takvim: Günün üstünde mini rozet hap şeklinde gösterilir.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google Tasks: Kategori etiketiyle yapılacaklar listesine eklenir.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-amber-300">
                    <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>15 Dakika Önceden Google Bildirimi + 06:00 Sabah Raporu Senkronizasyonu.</span>
                  </div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-[#1E273D] hover:bg-[#263047] text-[#CBD5E1] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Yeniden Söyle</span>
                </button>
                <button
                  onClick={handleConfirmAndDispatch}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#4F46E5] hover:to-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-[#6366F1]/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Kaydet ve Dağıt 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* DURUM 4: Başarılı */}
          {step === 'success' && dispatchResult && (
            <div className="w-full py-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Başarıyla Eklendi ve Dağıtıldı!</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mb-4 leading-relaxed">
                {dispatchResult.message}
              </p>

              <div className="w-full bg-[#151B2B] border border-[#263047] rounded-xl p-3 text-left text-xs space-y-1.5 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Google Takvim Senkronizasyonu:</span>
                  <span className={dispatchResult.googleCalendarSynced ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {dispatchResult.googleCalendarSynced ? '✅ Senkronize Edildi' : 'ℹ️ Yerel Takvime Eklendi'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">Google Tasks Senkronizasyonu:</span>
                  <span className={dispatchResult.googleTasksSynced ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                    {dispatchResult.googleTasksSynced ? '✅ Görev Oluşturuldu' : 'ℹ️ Yerel Görevlere Eklendi'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94A3B8]">06:00 Sabah Raporu:</span>
                  <span className="text-emerald-400 font-semibold">✅ Otomatik Dahil</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 bg-[#1E273D] hover:bg-[#263047] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Yeni Komut Ver 🎙️
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}

          {/* DURUM 5: Hata */}
          {step === 'error' && (
            <div className="w-full py-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Bir Sorun Oluştu</h3>
              <p className="text-xs text-rose-300 max-w-sm mb-4 leading-relaxed">
                {errorMessage || 'İşlem tamamlanamadı.'}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Tekrar Dene 🎙️
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-[#1E273D] hover:bg-[#263047] text-[#94A3B8] rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
