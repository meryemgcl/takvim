import fs from 'fs';
import path from 'path';
import { GoogleTaskItem } from '../types';

export interface TaskAuditLog {
  timestamp: string;
  action: 'CREATED' | 'UPDATED' | 'COMPLETED' | 'ROLLED_OVER' | 'SYNCED' | 'ARCHIVED';
  taskId: string;
  taskTitle: string;
  details?: string;
}

export interface TaskHistoryDataset {
  schemaVersion: string;
  userEmail: string;
  lastUpdated: string;
  stats: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    completionPercentage: number;
    p0Count: number;
    p1Count: number;
    carriedOverCount: number;
  };
  activeTasks: GoogleTaskItem[];
  archivedCompletedTasks: GoogleTaskItem[];
  rolloverHistory: Array<{
    timestamp: string;
    targetDate: string;
    count: number;
    tasksSummary: string[];
  }>;
  auditLogs: TaskAuditLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const HISTORY_FILE_PATH = path.join(DATA_DIR, 'tasks_history.json');

// Initial seed dataset reflecting Meryem Güçlü's portfolio & academic milestones
const INITIAL_DATASET: TaskHistoryDataset = {
  schemaVersion: '2.0',
  userEmail: 'meriguclu123@gmail.com',
  lastUpdated: new Date().toISOString(),
  stats: {
    totalTasks: 7,
    completedTasks: 1,
    pendingTasks: 6,
    completionPercentage: 14,
    p0Count: 2,
    p1Count: 3,
    carriedOverCount: 1
  },
  activeTasks: [
    {
      id: 'task-jci-maltepe',
      title: '🚨 [P0] JCI Maltepe: AIP Staj Ön Değerlendirme Mülakatı',
      notes: 'Platform: Google Meet (meet.google.com/dyz-fxcd-rpg)\nSaat: 19:40 – 19:50\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: 19:35 kamera, mikrofon, aydınlatma testi ve teknik CV hazırlığı.\n• [Uygulama]: Mülakata katıl, mühendislik vizyonu ve staj hedeflerini aktar.\n• [Teslimat / Takip]: Değerlendirme notlarını kaydet ve süreci takip et.',
      status: 'needsAction',
      due: '2026-09-17T19:40:00.000Z',
      priority: 'critical',
      category: 'Kariyer & Staj',
      syncHash: 'cal_sync_jci-maltepe-aip-interview_2026-09-17',
      updated_at: '2026-09-17T10:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-akbank-deadline',
      title: '🚨 [P0] Akbank Python (10million.AI) Final Sertifikasyon Teslimi',
      notes: 'Platform: courses.10million.ai\nSon Tarih: 27 Eylül 2026, 23:59\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Eksik kurs modüllerini ve quizleri listele.\n• [Uygulama]: Kodlama pratiklerini bitir ve mentorluk sorularını çöz.\n• [Teslimat / Takip]: Bitirme sertifikalarını indir ve portfolyoya ekle.',
      status: 'needsAction',
      due: '2026-09-27T23:59:00.000Z',
      priority: 'critical',
      category: 'KPSS & Eğitim',
      syncHash: 'cal_sync_akbank-python-deadline_2026-09-27',
      updated_at: '2026-09-15T08:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-tech-prompt-eng',
      title: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) Atölyesi',
      notes: 'Platform: Online Canlı Atölye (Tech Istanbul)\nSaat: 16:00 – 20:00\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Çok modlu LLM araçlarını (Gemini, Claude, GPT) hazırla.\n• [Uygulama]: Canlı atölyeye katıl, Few-Shot ve CoT pratiklerini yap.\n• [Teslimat / Takip]: Prompt kütüphanesi notlarını GitHub\'a kaydet.',
      status: 'needsAction',
      due: '2026-09-16T16:00:00.000Z',
      priority: 'high',
      category: 'Kariyer & Staj',
      syncHash: 'cal_sync_tech-istanbul-prompt-eng-1_2026-09-16',
      updated_at: '2026-09-15T12:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-tubitak-2209a',
      title: '⚡ [P1] TÜBİTAK 2209-A Araştırma Önerisi ve İş Paketleri',
      notes: 'Kurum: Sivas Cumhuriyet Üniversitesi\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Yapay zeka ve sürdürülebilirlik literatür taramasını bitir.\n• [Uygulama]: Gantt şeması, bütçe tablosu ve danışman onayını hazırla.\n• [Teslimat / Takip]: BİDEB/TYBS portalına başvuru taslağını yükle.',
      status: 'needsAction',
      due: '2026-10-15T00:00:00.000Z',
      priority: 'high',
      category: 'TÜBİTAK & Projeler',
      syncHash: 'cal_sync_tubitak-2209a-prep_2026-10-15',
      updated_at: '2026-09-14T09:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-cezeri-fergani',
      title: '⚡ [P1] CEZERİ & FERGANİ 2027 Aday Mühendislik Teknik Portfolyo Revizyonu',
      notes: 'Savunma & Havacılık Uzun Dönem Staj Başvurusu Hazırlığı\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Savunma sanayii yazılım yetkinliklerini (C++, Python) listele.\n• [Uygulama]: GitHub repolarını ve teknik CV\'yi güncelle.\n• [Teslimat / Takip]: Başvuru takvimini haftalık takip et.',
      status: 'needsAction',
      due: '2026-10-01T00:00:00.000Z',
      priority: 'high',
      category: 'Kariyer & Staj',
      syncHash: 'cal_sync_cezeri-fergani-portfolio_2026-10-01',
      updated_at: '2026-09-12T14:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-python100-carried',
      title: '📌 [P2] [Carried Over from Yesterday ↩️] Python 100 Gün: Algoritma Pratiği',
      notes: 'Atıl Samancıoğlu Python Kampı 1. Modül alıştırmaları.\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Jupyter çalışma defterini aç.\n• [Uygulama]: Algoritma ve veri yapısı problemlerini kodla.\n• [Teslimat / Takip]: Çözümleri GitHub deposuna push et.',
      status: 'needsAction',
      due: '2026-09-16T00:00:00.000Z',
      isRolledOver: true,
      rolledOverFrom: '2026-09-15',
      rolledOverCount: 1,
      priority: 'medium',
      category: 'KPSS & Eğitim',
      syncHash: 'cal_sync_python-100-oop-practice_2026-09-16',
      updated_at: '2026-09-16T00:00:00.000Z',
      source: 'google-tasks'
    },
    {
      id: 'task-tr72-yesil-ekonomi',
      title: 'ℹ️ [P3] TR72 Bölgesi Yeşil Ekonomik Fırsatlar ve Zorluklar İstişare Toplantısı',
      notes: 'ShortURL: shorturl.at/SdbGG | ID: 852 0484 8792 | Şifre: 760833\nSaat: 14:00 – 16:00\n\n📋 3 Aşamalı Kontrol Listesi:\n• [Hazırlık]: Bağlantı bilgilerini kontrol et, kadın & genç istihdamı notlarını hazırla.\n• [Uygulama]: Çevrim içi oturuma katıl, bölgesel fırsatları not al.\n• [Teslimat / Takip]: Çıktıları TÜBİTAK proje fikir havuzuna kaydet.',
      status: 'needsAction',
      due: '2026-09-16T14:00:00.000Z',
      priority: 'low',
      category: 'TÜBİTAK & Projeler',
      syncHash: 'cal_sync_tr72-yesil-ekonomi_2026-09-16',
      updated_at: '2026-09-15T15:00:00.000Z',
      source: 'google-tasks'
    }
  ],
  archivedCompletedTasks: [
    {
      id: 'archived-task-huawei-lab',
      title: '⚡ [P1] Huawei ICT Academy: Computer Networks Canlı Lab Katılımı',
      notes: 'YouTube Canlı Lab katılımı tamamlandı, eNSP topoloji notları alındı.',
      status: 'completed',
      completed: '2026-09-11T21:30:00.000Z',
      due: '2026-09-11T20:00:00.000Z',
      priority: 'high',
      category: 'Kariyer & Staj',
      syncHash: 'cal_sync_huawei-ict-lab_2026-09-11',
      updated_at: '2026-09-11T21:30:00.000Z',
      source: 'google-tasks'
    }
  ],
  rolloverHistory: [
    {
      timestamp: '2026-09-16T00:00:00.000Z',
      targetDate: '2026-09-16',
      count: 1,
      tasksSummary: ['Python 100 Gün: Algoritma Pratiği']
    }
  ],
  auditLogs: [
    {
      timestamp: '2026-09-15T12:24:00.000Z',
      action: 'CREATED',
      taskId: 'task-tech-prompt-eng',
      taskTitle: '⚡ [P1] Tech Istanbul: Prompt Engineering 2.0 (Multimodal) Atölyesi',
      details: 'Tech Istanbul kabul e-postasından 3 aşamalı subtask ile oluşturuldu.'
    },
    {
      timestamp: '2026-09-16T00:00:00.000Z',
      action: 'ROLLED_OVER',
      taskId: 'task-python100-carried',
      taskTitle: '📌 [P2] Python 100 Gün: Algoritma Pratiği',
      details: '15 Eylül tarihinden 16 Eylül tarihine devredildi.'
    }
  ]
};

function ensureStorage(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(HISTORY_FILE_PATH)) {
      fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(INITIAL_DATASET, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[TASK HISTORY STORE] Error ensuring directory or file:', err);
  }
}

export function loadTaskDataset(): TaskHistoryDataset {
  ensureStorage();
  try {
    const raw = fs.readFileSync(HISTORY_FILE_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.warn('[TASK HISTORY STORE] Failed reading dataset file, returning memory dataset:', err);
    return INITIAL_DATASET;
  }
}

export function saveTaskDataset(dataset: TaskHistoryDataset): boolean {
  ensureStorage();
  try {
    dataset.lastUpdated = new Date().toISOString();
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(dataset, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[TASK HISTORY STORE] Failed saving dataset file:', err);
    return false;
  }
}

export function syncTasksToPersistentHistory(incomingTasks: GoogleTaskItem[]): TaskHistoryDataset {
  const current = loadTaskDataset();
  const nowIso = new Date().toISOString();

  const activeMap = new Map<string, GoogleTaskItem>();
  current.activeTasks.forEach(t => activeMap.set(t.id, t));

  incomingTasks.forEach(incoming => {
    const existing = activeMap.get(incoming.id) || 
      (incoming.syncHash ? Array.from(activeMap.values()).find(t => t.syncHash === incoming.syncHash) : undefined);

    if (existing) {
      const existingTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
      const incomingTime = incoming.updated_at ? new Date(incoming.updated_at).getTime() : Date.now();

      // Last-Write-Wins arbitration
      if (incomingTime >= existingTime) {
        const merged: GoogleTaskItem = {
          ...existing,
          ...incoming,
          updated_at: nowIso
        };
        activeMap.set(existing.id, merged);

        // Check completion archival
        if (incoming.status === 'completed' && existing.status !== 'completed') {
          current.archivedCompletedTasks.push({
            ...merged,
            completed: nowIso
          });
          current.auditLogs.push({
            timestamp: nowIso,
            action: 'COMPLETED',
            taskId: merged.id,
            taskTitle: merged.title,
            details: 'Görev başarıyla tamamlandı ve kalıcı arşive kaydedildi.'
          });
        }
      }
    } else {
      const stamped: GoogleTaskItem = {
        ...incoming,
        updated_at: incoming.updated_at || nowIso
      };
      activeMap.set(stamped.id, stamped);

      current.auditLogs.push({
        timestamp: nowIso,
        action: 'CREATED',
        taskId: stamped.id,
        taskTitle: stamped.title,
        details: 'Yeni görev persistent veritabanına eklendi.'
      });
    }
  });

  const updatedActive = Array.from(activeMap.values());
  const completed = updatedActive.filter(t => t.status === 'completed').length + current.archivedCompletedTasks.length;
  const total = updatedActive.length + current.archivedCompletedTasks.length;
  const pending = updatedActive.filter(t => t.status === 'needsAction').length;
  const p0Count = updatedActive.filter(t => t.priority === 'critical' || t.title.includes('🚨') || t.title.includes('[P0]')).length;
  const p1Count = updatedActive.filter(t => t.priority === 'high' || t.title.includes('⚡') || t.title.includes('[P1]')).length;
  const carriedOverCount = updatedActive.filter(t => t.isRolledOver || t.title.includes('↩️')).length;

  current.activeTasks = updatedActive;
  current.stats = {
    totalTasks: total,
    completedTasks: completed,
    pendingTasks: pending,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    p0Count,
    p1Count,
    carriedOverCount
  };

  saveTaskDataset(current);
  return current;
}
