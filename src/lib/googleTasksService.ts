import { GoogleTaskItem, TaskPriority } from '../types';

const GOOGLE_TASKS_API_BASE = 'https://tasks.googleapis.com/tasks/v1';

/**
 * Format date string (YYYY-MM-DD) to RFC 3339 format for Google Tasks API
 * e.g., '2026-08-29' -> '2026-08-29T00:00:00.000Z'
 */
export function formatDueForGoogleTasks(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  try {
    if (dateStr.includes('T') && dateStr.endsWith('Z')) {
      return dateStr;
    }
    const cleanDate = dateStr.split('T')[0];
    return `${cleanDate}T00:00:00.000Z`;
  } catch {
    return undefined;
  }
}

/**
 * Extract simple YYYY-MM-DD from Google Tasks due RFC 3339 string
 */
export function extractDateFromGoogleDue(dueStr?: string): string | undefined {
  if (!dueStr) return undefined;
  return dueStr.split('T')[0];
}

/**
 * 1. GOOGLE TASKS LIST:
 * Lists tasks from the user's default list (@default) using Google Tasks API v1
 */
export async function listGoogleTasks(
  accessToken: string,
  tasklistId: string = '@default',
  options: { showCompleted?: boolean; showHidden?: boolean } = { showCompleted: true, showHidden: true }
): Promise<GoogleTaskItem[]> {
  if (!accessToken) {
    throw new Error('Google erişim anahtarı (access token) bulunamadı. Lütfen Google ile giriş yapın.');
  }

  const queryParams = new URLSearchParams({
    showCompleted: options.showCompleted !== false ? 'true' : 'false',
    showHidden: options.showHidden !== false ? 'true' : 'false',
    maxResults: '100'
  });

  const response = await fetch(
    `${GOOGLE_TASKS_API_BASE}/lists/${encodeURIComponent(tasklistId)}/tasks?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Tasks listesi alınamadı (${response.status})`
    );
  }

  const data = await response.json();
  const rawItems = data.items || [];

  const todayStr = new Date().toISOString().split('T')[0];

  return rawItems.map((item: any) => {
    const dueDate = extractDateFromGoogleDue(item.due);
    const isPastDue = dueDate && dueDate < todayStr && item.status === 'needsAction';
    const hasRolloverNote = item.notes && (item.notes.includes('Devredildi') || item.notes.includes('Rollover'));

    return {
      id: item.id,
      title: item.title || '(Başlıksız Görev)',
      notes: item.notes || '',
      status: item.status === 'completed' ? 'completed' : 'needsAction',
      due: item.due,
      completed: item.completed,
      updated: item.updated,
      position: item.position,
      selfLink: item.selfLink,
      webViewLink: item.webViewLink,
      isRolledOver: isPastDue || hasRolloverNote,
      rolledOverFrom: hasRolloverNote ? dueDate : undefined,
      priority: inferPriorityFromTitleOrNotes(item.title, item.notes),
      category: inferCategoryFromTitle(item.title, item.notes),
      source: 'google-tasks'
    };
  });
}

/**
 * 2. GOOGLE TASKS INSERT:
 * Inserts a new task into the user's default list (@default)
 */
export async function insertGoogleTask(
  accessToken: string,
  task: {
    title: string;
    notes?: string;
    due?: string; // YYYY-MM-DD or RFC 3339
    status?: 'needsAction' | 'completed';
  },
  tasklistId: string = '@default'
): Promise<GoogleTaskItem> {
  if (!accessToken) {
    throw new Error('Google ile giriş yapılmamış.');
  }

  const payload: any = {
    title: task.title,
    notes: task.notes || '',
    status: task.status || 'needsAction'
  };

  if (task.due) {
    payload.due = formatDueForGoogleTasks(task.due);
  }

  const response = await fetch(
    `${GOOGLE_TASKS_API_BASE}/lists/${encodeURIComponent(tasklistId)}/tasks`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Görev eklenemedi (${response.status})`
    );
  }

  const created = await response.json();
  return {
    id: created.id,
    title: created.title,
    notes: created.notes || '',
    status: created.status === 'completed' ? 'completed' : 'needsAction',
    due: created.due,
    completed: created.completed,
    updated: created.updated,
    priority: inferPriorityFromTitleOrNotes(created.title, created.notes),
    category: inferCategoryFromTitle(created.title, created.notes),
    source: 'google-tasks'
  };
}

/**
 * 3. GOOGLE TASKS STATUS UPDATE:
 * Updates task status to 'completed' or 'needsAction'
 */
export async function updateGoogleTaskStatus(
  accessToken: string,
  taskId: string,
  isCompleted: boolean,
  tasklistId: string = '@default'
): Promise<GoogleTaskItem> {
  if (!accessToken) {
    throw new Error('Google erişim tokenı bulunamadı.');
  }

  const payload: any = {
    status: isCompleted ? 'completed' : 'needsAction'
  };

  if (isCompleted) {
    payload.completed = new Date().toISOString();
  } else {
    payload.completed = null;
  }

  const response = await fetch(
    `${GOOGLE_TASKS_API_BASE}/lists/${encodeURIComponent(tasklistId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Görev durumu güncellenemedi (${response.status})`
    );
  }

  const updated = await response.json();
  return {
    id: updated.id,
    title: updated.title,
    notes: updated.notes || '',
    status: updated.status === 'completed' ? 'completed' : 'needsAction',
    due: updated.due,
    completed: updated.completed,
    updated: updated.updated,
    source: 'google-tasks'
  };
}

/**
 * 4. GOOGLE TASKS PATCH:
 * Updates fields like title, notes, due date
 */
export async function patchGoogleTask(
  accessToken: string,
  taskId: string,
  updates: {
    title?: string;
    notes?: string;
    due?: string;
    status?: 'needsAction' | 'completed';
  },
  tasklistId: string = '@default'
): Promise<GoogleTaskItem> {
  if (!accessToken) {
    throw new Error('Google erişim tokenı bulunamadı.');
  }

  const payload: any = {};
  if (updates.title !== undefined) payload.title = updates.title;
  if (updates.notes !== undefined) payload.notes = updates.notes;
  if (updates.status !== undefined) payload.status = updates.status;
  if (updates.due !== undefined) {
    payload.due = formatDueForGoogleTasks(updates.due);
  }

  const response = await fetch(
    `${GOOGLE_TASKS_API_BASE}/lists/${encodeURIComponent(tasklistId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Görev güncellenemedi (${response.status})`
    );
  }

  const resData = await response.json();
  return {
    id: resData.id,
    title: resData.title,
    notes: resData.notes || '',
    status: resData.status === 'completed' ? 'completed' : 'needsAction',
    due: resData.due,
    completed: resData.completed,
    updated: resData.updated,
    source: 'google-tasks'
  };
}

/**
 * 5. GOOGLE TASKS DELETE:
 * Deletes a task by ID
 */
export async function deleteGoogleTask(
  accessToken: string,
  taskId: string,
  tasklistId: string = '@default'
): Promise<void> {
  if (!accessToken) {
    throw new Error('Google erişim tokenı bulunamadı.');
  }

  const response = await fetch(
    `${GOOGLE_TASKS_API_BASE}/lists/${encodeURIComponent(tasklistId)}/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok && response.status !== 404) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Google Görev silinemedi (${response.status})`
    );
  }
}

/**
 * 6. GÜNLÜK OTOMATİK DEVİR (ROLLOVER) VE KONTROL:
 * Dünden kalan ve tamamlanmamış (status === 'needsAction') görevleri tespit eder.
 * Bu görevlerin due değerini 'Bugün' olarak günceller ve [Dünden Devredildi] notu ekler.
 */
export async function rolloverOverdueGoogleTasks(
  accessToken: string,
  tasks: GoogleTaskItem[],
  targetTodayDate?: string
): Promise<{
  rolledOverCount: number;
  rolledOverTasks: GoogleTaskItem[];
  updatedAllTasks: GoogleTaskItem[];
}> {
  const todayStr = targetTodayDate || new Date().toISOString().split('T')[0];
  const todayDueIso = `${todayStr}T00:00:00.000Z`;

  const overdueTasks = tasks.filter(t => {
    const taskDate = extractDateFromGoogleDue(t.due);
    return taskDate && taskDate < todayStr && t.status === 'needsAction';
  });

  if (overdueTasks.length === 0) {
    return {
      rolledOverCount: 0,
      rolledOverTasks: [],
      updatedAllTasks: tasks
    };
  }

  const rolledOverTasks: GoogleTaskItem[] = [];
  const updatedAll = [...tasks];

  for (const task of overdueTasks) {
    const originalDate = extractDateFromGoogleDue(task.due) || 'Geçmiş';
    const rolloverTag = `[Dünden Devredildi: ${originalDate}]`;
    const newNotes = task.notes && task.notes.includes('Devredildi')
      ? task.notes
      : `${rolloverTag} ${task.notes || ''}`.trim();

    try {
      if (accessToken && task.source === 'google-tasks') {
        const patched = await patchGoogleTask(accessToken, task.id, {
          due: todayDueIso,
          notes: newNotes
        });

        const rolledItem: GoogleTaskItem = {
          ...patched,
          due: todayDueIso,
          notes: newNotes,
          isRolledOver: true,
          rolledOverFrom: originalDate,
          rolledOverCount: (task.rolledOverCount || 0) + 1
        };

        rolledOverTasks.push(rolledItem);

        const idx = updatedAll.findIndex(t => t.id === task.id);
        if (idx >= 0) updatedAll[idx] = rolledItem;
      } else {
        // Local rollover
        const rolledItem: GoogleTaskItem = {
          ...task,
          due: todayDueIso,
          notes: newNotes,
          isRolledOver: true,
          rolledOverFrom: originalDate,
          rolledOverCount: (task.rolledOverCount || 0) + 1
        };
        rolledOverTasks.push(rolledItem);
        const idx = updatedAll.findIndex(t => t.id === task.id);
        if (idx >= 0) updatedAll[idx] = rolledItem;
      }
    } catch (err) {
      console.error(`Rollover failed for task ${task.id}:`, err);
    }
  }

  return {
    rolledOverCount: rolledOverTasks.length,
    rolledOverTasks,
    updatedAllTasks: updatedAll
  };
}

/**
 * 7. TEST VE DENEME ÖZELLİĞİ (TEST MODU):
 * Google Tasks'e otomatik 2 tane örnek görev (biri dünün tarihiyle, biri bugünün tarihiyle) ekler.
 * Böylece hem veri çekmeyi hem de erteleme (rollover) sisteminin anında çalıştığı test edilir.
 */
export async function createTestGoogleTasks(
  accessToken: string
): Promise<{ success: boolean; createdTasks: GoogleTaskItem[]; message: string }> {
  if (!accessToken) {
    throw new Error('Google Tasks için yetkili oturum bulunamadı. Lütfen Google ile giriş yapın.');
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  // Yesterday's date
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const sampleTasksToCreate = [
    {
      title: '🐍 [Test Görevi] Dünden Kalan Python Alıştırması & OOP Vaka Analizi',
      notes: 'Bu görev dünün tarihiyle oluşturuldu. Otomatik Rollover (Dünden Bugüne Devir) mekanizmasını test etmek için eklendi.',
      due: yesterdayStr,
      status: 'needsAction' as const
    },
    {
      title: '🚀 [Test Görevi] Bugünün CareerGen & AI Masterclass Oturum Hazırlığı',
      notes: 'Bu görev bugünün tarihiyle oluşturuldu. Görevi tamamlamak için solundaki onay kutusuna tıklayabilirsiniz.',
      due: todayStr,
      status: 'needsAction' as const
    }
  ];

  const createdTasks: GoogleTaskItem[] = [];

  for (const sample of sampleTasksToCreate) {
    try {
      const created = await insertGoogleTask(accessToken, sample);
      createdTasks.push(created);
    } catch (err: any) {
      console.error('Test task creation error:', err);
      throw new Error(`Test görevi oluşturulamadı: ${err.message}`);
    }
  }

  return {
    success: true,
    createdTasks,
    message: `🎉 2 Adet Google Test Görevi (1 Dün + 1 Bugün) başarıyla Google Tasks hesabınıza eklendi!`
  };
}

/**
 * Priority inference helper based on keywords
 */
function inferPriorityFromTitleOrNotes(title: string = '', notes: string = ''): TaskPriority {
  const text = `${title} ${notes}`.toLowerCase();
  if (text.includes('kritik') || text.includes('critical') || text.includes('acil') || text.includes('sınav') || text.includes('keynote') || text.includes('teslim')) {
    return 'critical';
  }
  if (text.includes('yüksek') || text.includes('high') || text.includes('ödev') || text.includes('proje') || text.includes('mülakat')) {
    return 'high';
  }
  if (text.includes('düşük') || text.includes('low') || text.includes('okuma') || text.includes('inceleme')) {
    return 'low';
  }
  return 'medium';
}

/**
 * Category inference helper based on keywords
 */
function inferCategoryFromTitle(title: string = '', notes: string = ''): string {
  const text = `${title} ${notes}`.toLowerCase();
  if (text.includes('careergen') || text.includes('bootcamp')) return 'CareerGen';
  if (text.includes('masterclass') || text.includes('pythiango') || text.includes('yapay zeka') || text.includes('ai')) return 'Yapay Zeka';
  if (text.includes('python') || text.includes('yazılım') || text.includes('kod')) return 'Python';
  if (text.includes('cop31') || text.includes('iklim') || text.includes('gönüllü')) return 'COP31';
  if (text.includes('tübitak') || text.includes('2209')) return 'TÜBİTAK';
  if (text.includes('staj') || text.includes('kariyer') || text.includes('cv') || text.includes('linkedin')) return 'Kariyer';
  return 'Google Görev';
}
