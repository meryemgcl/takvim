/**
 * Otomatik Takvim ve Görev Dağıtıcı Servisi (smartTaskDispatcher.ts)
 * Sesli komuttan çıkarılan yapılandırılmış veriyi Google Takvim ve Google Tasks'e dağıtır.
 */

import { CalendarEvent, GoogleTaskItem, TaskItem, UserAuth, ProgramCategory } from '../types';
import { addEventToGoogleCalendar } from '../lib/googleCalendar';
import { insertGoogleTask } from '../lib/googleTasksService';
import { ParsedVoiceCommand } from './geminiNlpService';

export interface DispatchResult {
  success: boolean;
  eventCreated?: CalendarEvent;
  taskCreated?: TaskItem | GoogleTaskItem;
  googleCalendarSynced: boolean;
  googleTasksSynced: boolean;
  notificationSet: boolean;
  message: string;
}

export interface DispatchOptions {
  parsed: ParsedVoiceCommand;
  user: UserAuth | null;
  onAddLocalEvent?: (event: CalendarEvent) => void;
  onAddLocalTask?: (task: TaskItem) => void;
}

/**
 * Akıllı Dağıtıcı Ana Fonksiyonu
 */
export async function dispatchSmartVoiceTask(options: DispatchOptions): Promise<DispatchResult> {
  const { parsed, user, onAddLocalEvent, onAddLocalTask } = options;
  const accessToken = user?.accessToken;

  let googleCalendarSynced = false;
  let googleTasksSynced = false;
  let googleCalendarEventId: string | undefined = undefined;
  let googleTaskId: string | undefined = undefined;

  const dueIsoDate = parsed.dueDate; // YYYY-MM-DD
  const hasTime = Boolean(parsed.hasSpecificTime && parsed.dueTime);

  // 1. Etkinlik Zamanlarını Hesapla
  let startDateTime = `${dueIsoDate}T09:00:00`;
  let endDateTime = `${dueIsoDate}T10:00:00`;

  if (hasTime && parsed.dueTime) {
    const timeClean = parsed.dueTime.includes(':') ? parsed.dueTime : `${parsed.dueTime}:00`;
    startDateTime = `${dueIsoDate}T${timeClean}:00`;
    
    // Bitiş saatini hesapla (varsayılan 60 dk veya belirtilen süre)
    const [h, m] = timeClean.split(':').map(Number);
    const duration = parsed.durationMinutes || 60;
    const endMinutesTotal = (h * 60 + m) + duration;
    const endH = Math.floor(endMinutesTotal / 60) % 24;
    const endM = endMinutesTotal % 60;
    endDateTime = `${dueIsoDate}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00`;
  }

  // 2. Kategoriye Uygun Program ve Renk Seçimi
  const programCategory = mapCategoryToProgram(parsed.category);
  const eventColor = mapCategoryToColor(parsed.category);

  // 3. Yerel Takvim Etkinliği Nesnesi Oluştur
  const newEvent: CalendarEvent = {
    id: `voice-evt-${Date.now()}`,
    title: parsed.title,
    description: parsed.notes || `[Sesli Komut: "${parsed.rawCommand}"]\nKategori: ${parsed.category}`,
    startDate: startDateTime,
    endDate: endDateTime,
    allDay: !hasTime,
    location: hasTime ? 'Planlanan Saat' : 'Tüm Gün',
    type: parsed.eventType || (hasTime ? 'meeting' : 'self-paced'),
    program: programCategory,
    isMandatory: parsed.priority === 'critical' || parsed.priority === 'high',
    color: eventColor,
    reminderMinutes: parsed.reminderMinutesBefore || 15,
    priority: parsed.priority,
    tags: [parsed.category, 'Sesli Komut', 'Akıllı Ajanda']
  };

  // 4. Yerel Görev Nesnesi Oluştur
  const newTask: TaskItem = {
    id: `voice-task-${Date.now()}`,
    title: parsed.title,
    description: `Kategori: ${parsed.category} | ${parsed.notes || ''}`,
    completed: false,
    dueDate: hasTime ? startDateTime : dueIsoDate,
    priority: parsed.priority,
    category: parsed.category,
    createdAt: new Date().toISOString(),
    source: accessToken ? 'google-tasks' : 'local'
  };

  // 5. GOOGLE TAKVİM SENKRONİZASYONU (Saat belirtilmişse veya kullanıcı bağlıysa)
  if (accessToken && hasTime) {
    try {
      const gEventResult = await addEventToGoogleCalendar(accessToken, {
        ...newEvent,
        reminderMinutes: 15 // 15 dakika öncesinde Google bildirimi kurulur
      });
      if (gEventResult?.id) {
        googleCalendarSynced = true;
        googleCalendarEventId = gEventResult.id;
        newEvent.googleCalendarEventId = gEventResult.id;
        newEvent.syncedToGoogle = true;
      }
    } catch (err) {
      console.warn('Google Takvim senkronizasyonunda hata:', err);
    }
  }

  // 6. GOOGLE TASKS SENKRONİZASYONU (Her iki durumda da Google Tasks'e ekle)
  if (accessToken) {
    try {
      const taskNotes = `[${parsed.category}] ${hasTime ? `Saat: ${parsed.dueTime} | ` : ''}15 dk önce bildirim ayarlandı.\n${parsed.notes || ''}`;
      const gTaskResult = await insertGoogleTask(accessToken, {
        title: parsed.title,
        notes: taskNotes,
        due: dueIsoDate,
        status: 'needsAction'
      });
      if (gTaskResult?.id) {
        googleTasksSynced = true;
        googleTaskId = gTaskResult.id;
        newTask.googleTaskId = gTaskResult.id;
      }
    } catch (err) {
      console.warn('Google Tasks senkronizasyonunda hata:', err);
    }
  }

  // 7. Yerel Durumlara (State) Ekle
  if (onAddLocalEvent) {
    onAddLocalEvent(newEvent);
  }
  if (onAddLocalTask) {
    onAddLocalTask(newTask);
  }

  // 8. Sonuç Mesajı
  let message = '';
  if (hasTime) {
    message = `"${parsed.title}" görevi ${dueIsoDate} saat ${parsed.dueTime} için Takvim ve Tasks'e eklendi (15 dk önce Google bildirimi kuruldu).`;
  } else {
    message = `"${parsed.title}" görevi ${dueIsoDate} gününe to-do olarak eklendi ve takvime yerleştirildi.`;
  }

  return {
    success: true,
    eventCreated: newEvent,
    taskCreated: newTask,
    googleCalendarSynced,
    googleTasksSynced,
    notificationSet: hasTime,
    message
  };
}

function mapCategoryToProgram(category?: string): ProgramCategory {
  switch (category) {
    case 'TÜBİTAK & Projeler':
      return 'tubitak-yarisma';
    case 'KPSS & Eğitim':
      return 'python-100-gun';
    case 'Kariyer & Staj':
      return 'kariyer-yetenek';
    default:
      return 'custom';
  }
}

function mapCategoryToColor(category?: string): string {
  switch (category) {
    case 'TÜBİTAK & Projeler':
      return '#8B5CF6'; // Mor
    case 'KPSS & Eğitim':
      return '#6366F1'; // İndigo / Mavi
    case 'Kariyer & Staj':
      return '#06B6D4'; // Camgöbeği / Cyan
    case 'Kişisel / Rutin':
    default:
      return '#F59E0B'; // Kehribar / Amber
  }
}
