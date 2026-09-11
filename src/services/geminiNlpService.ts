/**
 * Gemini NLP Doğal Dil Ayrıştırıcı Servisi (geminiNlpService.ts)
 * Kullanıcının Türkçe sesli komutlarını Gemini 3.7 Flash ile yapılandırılmış takvim/görev verisine dönüştürür.
 */

export interface ParsedVoiceCommand {
  title: string;
  category: 'KPSS & Eğitim' | 'TÜBİTAK & Projeler' | 'Kariyer & Staj' | 'Kişisel / Rutin' | string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm (örn. "15:00")
  hasSpecificTime: boolean;
  reminderMinutesBefore: number; // varsayılan 15
  durationMinutes?: number;
  notes?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  program?: string;
  eventType?: 'webinar' | 'meeting' | 'submission' | 'workshop' | 'self-paced' | 'other';
  rawCommand: string;
}

/**
 * Sunucu tarafındaki Gemini API'yi çağırarak Türkçe sesli komutu ayrıştırır.
 * Hata veya çevrimdışı durumlarda yerel kural tabanlı yedek motoru (Rule-based Fallback) devreye sokar.
 */
export async function parseVoiceCommandWithGemini(
  commandText: string,
  referenceDateStr?: string
): Promise<ParsedVoiceCommand> {
  const cleanCommand = (commandText || '').trim();
  if (!cleanCommand) {
    throw new Error('Boş sesli komut işlenemez.');
  }

  const now = new Date();
  const refDate = referenceDateStr || now.toISOString().split('T')[0];

  try {
    const response = await fetch('/api/gemini/parse-voice-command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        command: cleanCommand,
        referenceDate: refDate,
        currentTime: now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.parsed) {
        return sanitizeParsedCommand(data.parsed, cleanCommand, refDate);
      }
    }
    console.warn('Sunucu Gemini yanıt vermedi veya hata döndü, yerel NLP motoruna geçiliyor.');
  } catch (err) {
    console.warn('Gemini NLP API çağrısı başarısız oldu, yerel kural motoru devrede:', err);
  }

  // Akıllı Yerel Kural Motoru (Fallback NLP Parser)
  return fallbackLocalNlpParser(cleanCommand, refDate);
}

/**
 * Gelen veriyi doğrular ve eksik alanları tamamlar
 */
function sanitizeParsedCommand(
  raw: any,
  originalText: string,
  refDate: string
): ParsedVoiceCommand {
  const categoryMap: Record<string, string> = {
    'KPSS': 'KPSS & Eğitim',
    'Eğitim': 'KPSS & Eğitim',
    'KPSS & Eğitim': 'KPSS & Eğitim',
    'TÜBİTAK': 'TÜBİTAK & Projeler',
    'Proje': 'TÜBİTAK & Projeler',
    'TÜBİTAK & Projeler': 'TÜBİTAK & Projeler',
    'Kariyer': 'Kariyer & Staj',
    'Staj': 'Kariyer & Staj',
    'Kariyer & Staj': 'Kariyer & Staj',
    'Kişisel': 'Kişisel / Rutin',
    'Rutin': 'Kişisel / Rutin',
    'Kişisel / Rutin': 'Kişisel / Rutin'
  };

  let assignedCategory = raw.category || inferCategoryFromTurkish(originalText);
  if (categoryMap[assignedCategory]) {
    assignedCategory = categoryMap[assignedCategory];
  }

  const hasSpecificTime = Boolean(raw.hasSpecificTime || raw.dueTime);
  let dueDate = raw.dueDate || refDate;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
    dueDate = refDate;
  }

  return {
    title: raw.title || originalText,
    category: assignedCategory,
    dueDate,
    dueTime: raw.dueTime || undefined,
    hasSpecificTime,
    reminderMinutesBefore: Number(raw.reminderMinutesBefore) || 15,
    durationMinutes: Number(raw.durationMinutes) || (hasSpecificTime ? 60 : 0),
    notes: raw.notes || `[Sesli Komut İle Eklendi] "${originalText}"`,
    priority: raw.priority || inferPriorityFromTurkish(originalText),
    program: raw.program || 'custom',
    eventType: raw.eventType || (hasSpecificTime ? 'meeting' : 'self-paced'),
    rawCommand: originalText
  };
}

/**
 * Çevrimdışı ve kural tabanlı Türkçe NLP Ayrıştırıcı
 */
export function fallbackLocalNlpParser(
  command: string,
  refDateStr: string
): ParsedVoiceCommand {
  const lower = command.toLowerCase();
  const now = new Date(refDateStr.includes('T') ? refDateStr : `${refDateStr}T09:00:00`);
  
  let targetDate = new Date(now.getTime());
  let hasSpecificTime = false;
  let dueTime: string | undefined = undefined;

  // 1. Tarih Tespiti
  if (lower.includes('yarın') || lower.includes('yarin')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (lower.includes('öbür gün') || lower.includes('obur gun') || lower.includes('2 gün sonra')) {
    targetDate.setDate(targetDate.getDate() + 2);
  } else if (lower.includes('pazartesi')) {
    setNextDayOfWeek(targetDate, 1);
  } else if (lower.includes('salı') || lower.includes('sali')) {
    setNextDayOfWeek(targetDate, 2);
  } else if (lower.includes('çarşamba') || lower.includes('carsamba')) {
    setNextDayOfWeek(targetDate, 3);
  } else if (lower.includes('perşembe') || lower.includes('persembe')) {
    setNextDayOfWeek(targetDate, 4);
  } else if (lower.includes('cuma')) {
    setNextDayOfWeek(targetDate, 5);
  } else if (lower.includes('cumartesi')) {
    setNextDayOfWeek(targetDate, 6);
  } else if (lower.includes('pazar')) {
    setNextDayOfWeek(targetDate, 0);
  } else if (lower.includes('haftaya')) {
    targetDate.setDate(targetDate.getDate() + 7);
  }

  // 2. Saat Tespiti (Örn: "saat 15:00", "saat 15'te", "14:30'da", "akşam 8'de", "sabah 9'da")
  const timeRegexes = [
    /saat\s*(\d{1,2})[:.](\d{2})/i,
    /(\d{1,2})[:.](\d{2})['’]?(te|ta|de|da|e|a)?/i,
    /saat\s*(\d{1,2})['’]?(te|ta|de|da|e|a|de|si)?/i,
    /(öğleden sonra|öğlen|aksam|akşam|sabah|gece)\s*(\d{1,2})/i
  ];

  for (const regex of timeRegexes) {
    const match = lower.match(regex);
    if (match) {
      hasSpecificTime = true;
      let hour = parseInt(match[1], 10);
      const minute = match[2] && match[2].length === 2 && !isNaN(parseInt(match[2], 10)) ? parseInt(match[2], 10) : 0;

      if (lower.includes('akşam') || lower.includes('aksam') || lower.includes('öğleden sonra')) {
        if (hour < 12) hour += 12;
      }

      const hStr = hour.toString().padStart(2, '0');
      const mStr = minute.toString().padStart(2, '0');
      dueTime = `${hStr}:${mStr}`;
      break;
    }
  }

  // 3. Başlık Temizleme
  let title = command
    .replace(/(lütfen|lutfen|ekle|ayarla|oluştur|olustur|kaydet|yap|tamamla)/gi, '')
    .replace(/(yarın|yarin|bugün|bugun|öbür gün|pazartesi|salı|çarşamba|perşembe|cuma|cumartesi|pazar)/gi, '')
    .replace(/saat\s*\d{1,2}([:.]\d{2})?(['’]?(te|ta|de|da|e|a|de|si))?/gi, '')
    .replace(/\d{1,2}[:.]\d{2}['’]?(te|ta|de|da|e|a)?/gi, '')
    .replace(/(akşam|aksam|sabah|öğlen|gece)\s*\d{1,2}['’]?(de|da|e|a)?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!title || title.length < 3) {
    title = command;
  } else {
    // İlk harfleri düzgün yap
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  const category = inferCategoryFromTurkish(command);
  const priority = inferPriorityFromTurkish(command);

  return {
    title,
    category,
    dueDate: targetDate.toISOString().split('T')[0],
    dueTime,
    hasSpecificTime,
    reminderMinutesBefore: 15,
    durationMinutes: hasSpecificTime ? 60 : 0,
    notes: `[Sesli Komut] ${command}`,
    priority,
    program: 'custom',
    eventType: hasSpecificTime ? 'meeting' : 'self-paced',
    rawCommand: command
  };
}

function setNextDayOfWeek(date: Date, targetDay: number) {
  const currentDay = date.getDay();
  let distance = targetDay - currentDay;
  if (distance <= 0) {
    distance += 7;
  }
  date.setDate(date.getDate() + distance);
}

export function inferCategoryFromTurkish(text: string): 'KPSS & Eğitim' | 'TÜBİTAK & Projeler' | 'Kariyer & Staj' | 'Kişisel / Rutin' {
  const t = (text || '').toLowerCase();
  if (t.includes('kpss') || t.includes('vatandaşlık') || t.includes('matematik') || t.includes('tarih') || t.includes('eğitim') || t.includes('ders') || t.includes('soru çöz')) {
    return 'KPSS & Eğitim';
  }
  if (t.includes('tübitak') || t.includes('tubitak') || t.includes('2209') || t.includes('proje') || t.includes('ar-ge') || t.includes('patent') || t.includes('teknofest')) {
    return 'TÜBİTAK & Projeler';
  }
  if (t.includes('staj') || t.includes('kariyer') || t.includes('cezeri') || t.includes('fergani') || t.includes('akbank') || t.includes('mülakat') || t.includes('başvuru') || t.includes('özgeçmiş')) {
    return 'Kariyer & Staj';
  }
  return 'Kişisel / Rutin';
}

export function inferPriorityFromTurkish(text: string): 'low' | 'medium' | 'high' | 'critical' {
  const t = (text || '').toLowerCase();
  if (t.includes('acil') || t.includes('kritik') || t.includes('kesinlikle') || t.includes('son gün') || t.includes('son teslim')) {
    return 'critical';
  }
  if (t.includes('önemli') || t.includes('yüksek') || t.includes('sınav') || t.includes('mülakat')) {
    return 'high';
  }
  return 'medium';
}

export function getCategoryBadgeStyle(category?: string) {
  switch (category) {
    case 'TÜBİTAK & Projeler':
    case 'TÜBİTAK':
      return {
        bg: 'bg-[#8B5CF6]/15',
        text: 'text-[#C4B5FD]',
        border: 'border-[#8B5CF6]/40',
        dot: '#8B5CF6',
        label: 'TÜBİTAK & Proje'
      };
    case 'KPSS & Eğitim':
    case 'KPSS':
      return {
        bg: 'bg-[#6366F1]/15',
        text: 'text-[#A5B4FC]',
        border: 'border-[#6366F1]/40',
        dot: '#6366F1',
        label: 'KPSS & Eğitim'
      };
    case 'Kariyer & Staj':
    case 'Kariyer':
      return {
        bg: 'bg-[#06B6D4]/15',
        text: 'text-[#67E8F9]',
        border: 'border-[#06B6D4]/40',
        dot: '#06B6D4',
        label: 'Kariyer & Staj'
      };
    case 'Kişisel / Rutin':
    case 'Kişisel':
    default:
      return {
        bg: 'bg-[#F59E0B]/15',
        text: 'text-[#FDE68A]',
        border: 'border-[#F59E0B]/40',
        dot: '#F59E0B',
        label: 'Kişisel / Rutin'
      };
  }
}
