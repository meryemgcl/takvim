import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, AlignLeft, ShieldAlert, Sparkles, Plus, Trash2, Tag, CheckSquare, Layers, Clock, Bell, Video, ExternalLink, RefreshCw } from 'lucide-react';
import { CalendarEvent, EventType, ProgramCategory, EventDeliverable, UserAuth } from '../types';
import { createGoogleMeetSpace, saveMeetingToHistory } from '../lib/googleMeetService';

interface AddEditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  initialEvent?: CalendarEvent | null;
  defaultDate?: string;
  user?: UserAuth | null;
}

export const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEvent,
  defaultDate,
  user
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState<EventType>('webinar');
  const [program, setProgram] = useState<ProgramCategory>('tubitak-yarisma');
  const [isMandatory, setIsMandatory] = useState(false);
  const [color, setColor] = useState('#0284c7');
  const [reminderMinutes, setReminderMinutes] = useState<number>(30);
  const [trlLevel, setTrlLevel] = useState<number>(3);
  const [priority, setPriority] = useState<'critical' | 'high' | 'medium' | 'low'>('medium');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [deliverables, setDeliverables] = useState<EventDeliverable[]>([]);
  const [newDeliverableText, setNewDeliverableText] = useState<string>('');
  const [isGeneratingMeet, setIsGeneratingMeet] = useState(false);

  useEffect(() => {
    if (initialEvent) {
      setTitle(initialEvent.title);
      setDescription(initialEvent.description || '');
      setStartDate(initialEvent.startDate);
      setEndDate(initialEvent.endDate || initialEvent.startDate);
      setAllDay(initialEvent.allDay || false);
      setLocation(initialEvent.location || '');
      setLink(initialEvent.link || '');
      setType(initialEvent.type || 'webinar');
      setProgram(initialEvent.program || 'tubitak-yarisma');
      setIsMandatory(initialEvent.isMandatory || false);
      setColor(initialEvent.color || '#0284c7');
      setReminderMinutes(initialEvent.reminderMinutes ?? 30);
      setTrlLevel(initialEvent.trlLevel ?? 3);
      setPriority(initialEvent.priority || (initialEvent.isMandatory ? 'critical' : 'medium'));
      setTagsInput(initialEvent.tags ? initialEvent.tags.join(', ') : '');
      setDeliverables(initialEvent.deliverables || []);
    } else {
      const start = defaultDate || '2026-08-20T09:00';
      setTitle('');
      setDescription('');
      setStartDate(start);
      setEndDate(start);
      setAllDay(false);
      setLocation('');
      setLink('');
      setType('workshop');
      setProgram('tubitak-yarisma');
      setIsMandatory(false);
      setColor('#059669');
      setReminderMinutes(30);
      setTrlLevel(3);
      setPriority('medium');
      setTagsInput('');
      setDeliverables([]);
    }
  }, [initialEvent, defaultDate, isOpen]);

  const handleAddDeliverable = () => {
    if (!newDeliverableText.trim()) return;
    const newDel: EventDeliverable = {
      id: `del-${Date.now()}`,
      text: newDeliverableText.trim(),
      completed: false
    };
    setDeliverables([...deliverables, newDel]);
    setNewDeliverableText('');
  };

  const handleRemoveDeliverable = (id: string) => {
    setDeliverables(deliverables.filter(d => d.id !== id));
  };

  const handleToggleDeliverable = (id: string) => {
    setDeliverables(deliverables.map(d => d.id === id ? { ...d, completed: !d.completed } : d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate) return;

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const newEvent: CalendarEvent = {
      id: initialEvent?.id || `custom-${Date.now()}`,
      title,
      description,
      startDate,
      endDate: endDate || startDate,
      allDay,
      location,
      link,
      type,
      program,
      isMandatory,
      color,
      reminderMinutes,
      trlLevel,
      priority,
      tags: parsedTags,
      deliverables,
      syncedToGoogle: initialEvent?.syncedToGoogle || false,
      googleCalendarEventId: initialEvent?.googleCalendarEventId
    };

    onSave(newEvent);
    onClose();
  };

  const handleGenerateMeetLink = async () => {
    setIsGeneratingMeet(true);
    try {
      const space = await createGoogleMeetSpace(user?.accessToken || '', { accessType: 'OPEN' });
      setLink(space.meetingUri);
      setLocation(`Google Meet (${space.meetingCode})`);
      setType('meeting');
      if (title.trim()) {
        saveMeetingToHistory({
          id: `meet-${Date.now()}`,
          title: title.trim(),
          meetingUri: space.meetingUri,
          meetingCode: space.meetingCode,
          spaceName: space.name,
          createdAt: new Date().toISOString(),
          scheduledDate: startDate.split('T')[0],
          scheduledTime: startDate.includes('T') ? startDate.split('T')[1] : '09:00',
          category: program
        });
      }
    } catch (err) {
      console.error('Failed to generate Meet link', err);
    } finally {
      setIsGeneratingMeet(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {initialEvent ? 'Etkinlik / Aşamayı Düzenle' : 'Yeni İnovasyon & Takvim Etkinliği Ekle'}
              </h3>
              <p className="text-xs text-slate-400">Tarih, TRL seviyesi, evrak kontrolü ve detayları güncelleyin</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">Etkinlik & Aşama Başlığı *</label>
            <input
              type="text"
              required
              placeholder="Örn: TÜBİTAK 10 Sayfalık Sunum Mizanpajı veya Akbank AI Oturumu"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm font-semibold text-slate-900"
            />
          </div>

          {/* Program & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Kategori / Ekosistem</label>
              <select
                value={program}
                onChange={e => setProgram(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
              >
                <option value="akbank-python">🔴 Akbank Python'a Giriş (10million.AI / 7 - 27 Eylül)</option>
                <option value="nocode-lowcode">🛠️ No-Code & Low-Code ile Fikirden Ürüne (Pupilica / Engin Deniz Alpman)</option>
                <option value="tech-istanbul-bootcamp">⚡ Tech Istanbul: Uygulamalı YZ Geliştirme Bootcamp (8 Eylül - 8 Ekim)</option>
                <option value="pythiango-ai-masterclass">🤖 PythianGo: Yapay Zeka Masterclass (4 Hafta)</option>
                <option value="careergen-bootcamp">🚀 CareerGen: Kariyere İlk Adım Bootcamp 1. Dönem (career-gen.com)</option>
                <option value="python-100-gun">🐍 Python: 100 Günlük Yazılım Kampı (Atıl Samancıoğlu / Udemy)</option>
                <option value="cop31-gonullu">🌍 COP31 Türkiye Gönüllülük Programı (akademi.csb.gov.tr)</option>
                <option value="kariyer-yetenek">💼 Kariyer, Staj & Genç Yetenek Programları (Turkcell, Aselsan, NASA vb.)</option>
                <option value="tubitak-yarisma">🏆 TÜBİTAK Bilim Genç & 2209-A</option>
                <option value="arge-inovasyon">🔬 Ar-Ge ve İnovasyon Proje Pazarı</option>
                <option value="cezeri-staj">🚀 CEZERİ Havacılık & Staj</option>
                <option value="fergani-staj">🛰️ FERGANİ Uzay & Staj</option>
                <option value="akbank-genai">🔴 Akbank Yapay Zeka & GenAI</option>
                <option value="teknofest-gonullu">🇹🇷 TEKNOFEST Akademisi</option>
                <option value="girisimcilik-patent">💡 Girişimcilik & Patent / TÜRKPATENT</option>
                <option value="burs-basvuru">🎓 Burs Başvuruları (MÜKAD / TEV)</option>
                <option value="komut-muhendisligi">💻 Prompt Mühendisliği</option>
                <option value="meta-yapay-zeka">♾️ Meta ile Yapay Zeka</option>
                <option value="gelecegin-meslekleri">🌱 Geleceğin Meslekleri</option>
                <option value="pupilica">📊 Pupilica Etkinliği</option>
                <option value="sergi-kultur">🖼️ Sergi & Kültür-Sanat</option>
                <option value="kavcar-canli">📹 Kamil Kavcar Canlı Yayınları</option>
                <option value="custom">Özel Etkinlik / Görev</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Etkinlik Türü</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
              >
                <option value="workshop">Atölye & Uygulama</option>
                <option value="submission">Son Başvuru / Sınav / Teslim</option>
                <option value="milestone">İnovasyon Kilometre Taşı</option>
                <option value="pitch">Jüri / Yatırımcı Sunumu</option>
                <option value="webinar">Canlı Oturum / Webinar</option>
                <option value="meeting">Mentor & Tanışma</option>
                <option value="self-paced">Bireysel / Self-Paced Eğitim</option>
                <option value="other">Diğer</option>
              </select>
            </div>
          </div>

          {/* Dates & All Day Checkbox */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Başlangıç Zamanı *</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                required
                value={startDate ? (allDay ? startDate.split('T')[0] : startDate.slice(0, 16)) : ''}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Bitiş Zamanı</label>
              <input
                type={allDay ? 'date' : 'datetime-local'}
                value={endDate ? (allDay ? endDate.split('T')[0] : endDate.slice(0, 16)) : ''}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-semibold"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 text-xs">
                <input
                  type="checkbox"
                  checked={allDay}
                  onChange={e => setAllDay(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Tüm Gün Etkinliği (Aşama / Başvuru Aralığı)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-900 text-xs">
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={e => setIsMandatory(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Zorunlu / Kritik Aşama</span>
              </label>
            </div>
          </div>

          {/* TRL Level, Priority & Reminder */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">TRL Seviyesi (1-9)</label>
              <select
                value={trlLevel}
                onChange={e => setTrlLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
              >
                <option value={1}>TRL 1: Temel İlkeler</option>
                <option value={2}>TRL 2: Konsept Tanımı</option>
                <option value={3}>TRL 3: Kavram Kanıtı (PoC)</option>
                <option value={4}>TRL 4: Laboratuvar Doğrulaması</option>
                <option value={5}>TRL 5: Benzetimli Ortam Testi</option>
                <option value={6}>TRL 6: Prototip Gösterimi</option>
                <option value={7}>TRL 7: Saha Prototipi</option>
                <option value={8}>TRL 8: Kalifiye Sistem</option>
                <option value={9}>TRL 9: Başarılı Operasyon</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Öncelik Seviyesi</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
              >
                <option value="critical">🚨 Kritik (Öncelikli)</option>
                <option value="high">🔥 Yüksek</option>
                <option value="medium">⚡ Normal</option>
                <option value="low">🌱 İsteğe Bağlı</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Otomatik Hatırlatıcı</label>
              <select
                value={reminderMinutes}
                onChange={e => setReminderMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs font-medium"
              >
                <option value={1440}>1 Gün Önce</option>
                <option value={720}>12 Saat Önce</option>
                <option value={120}>2 Saat Önce</option>
                <option value={60}>1 Saat Önce</option>
                <option value={30}>30 Dakika Önce</option>
                <option value={15}>15 Dakika Önce</option>
                <option value={0}>Hatırlatma Yok</option>
              </select>
            </div>
          </div>

          {/* Google Meet Quick Integration */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                  <span>Google Meet Video Konferansı</span>
                  {link && link.includes('meet.google.com') && (
                    <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                      Bağlandı
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-emerald-700">Tek tıkla benzersiz bir Meet odası oluşturup bağlayın</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateMeetLink}
              disabled={isGeneratingMeet}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 disabled:opacity-50 shadow-xs"
            >
              {isGeneratingMeet ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Oluşturuluyor...</span>
                </>
              ) : (
                <>
                  <Video className="w-3.5 h-3.5" />
                  <span>Meet Linki Oluştur 🎥</span>
                </>
              )}
            </button>
          </div>

          {/* Location & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Konum / Platform</label>
              <input
                type="text"
                placeholder="Örn: bilimgenc.tubitak.gov.tr veya MS Teams"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1 text-xs">Bağlantı URL'si</label>
              <input
                type="url"
                placeholder="https://..."
                value={link}
                onChange={e => setLink(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">Etiketler (Virgülle ayırın)</label>
            <input
              type="text"
              placeholder="Örn: TÜBİTAK, 10 Sayfalık Sunum, 3D Render, Patent"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            />
          </div>

          {/* Deliverables Checklist Builder */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block font-bold text-slate-800 text-xs">Teslim Edilecek Evrak & Hazırlık Maddeleri (Kontrol Listesi)</label>
            
            {deliverables.length > 0 && (
              <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-slate-50 rounded-xl border border-slate-200">
                {deliverables.map(del => (
                  <div key={del.id} className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleToggleDeliverable(del.id)}
                      className={`text-xs flex items-center gap-1.5 font-medium ${del.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
                    >
                      <CheckSquare className={`w-3.5 h-3.5 ${del.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span>{del.text}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveDeliverable(del.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Yeni teslim maddesi ekleyin..."
                value={newDeliverableText}
                onChange={e => setNewDeliverableText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDeliverable();
                  }
                }}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
              />
              <button
                type="button"
                onClick={handleAddDeliverable}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Madde Ekle</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">Detaylı Açıklama & Notlar</label>
            <textarea
              rows={3}
              placeholder="Aşama gereksinimleri, başvuru şartları, linkler ve önemli hatırlatmalar..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs leading-relaxed"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block font-bold text-slate-800 mb-1 text-xs">Vurgu Rengi</label>
            <div className="flex items-center gap-2">
              {['#059669', '#0284c7', '#7c3aed', '#dc2626', '#d97706', '#0d9488', '#e11d48', '#2563eb'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-xl transition cursor-pointer ${
                    color === c ? 'ring-2 ring-slate-900 scale-110' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs transition cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-950/40 transition cursor-pointer"
            >
              {initialEvent ? 'Değişiklikleri Kaydet' : 'Etkinliği Oluştur'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
