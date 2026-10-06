export type EventType = 'webinar' | 'self-paced' | 'meeting' | 'submission' | 'workshop' | 'milestone' | 'pitch' | 'other';

export type ProgramCategory = 
  | 'nocode-lowcode'
  | 'akbank-python'
  | 'tech-istanbul-bootcamp'
  | 'pythiango-ai-masterclass'
  | 'careergen-bootcamp'
  | 'python-100-gun'
  | 'cop31-gonullu'
  | 'kariyer-yetenek'
  | 'tubitak-yarisma'
  | 'arge-inovasyon'
  | 'cezeri-staj'
  | 'fergani-staj'
  | 'akbank-genai'
  | 'komut-muhendisligi'
  | 'gelecegin-meslekleri'
  | 'teknofest-gonullu'
  | 'meta-yapay-zeka'
  | 'girisimcilik-patent'
  | 'burs-basvuru'
  | 'pupilica'
  | 'sergi-kultur'
  | 'kavcar-canli'
  | 'custom';

export interface EventDeliverable {
  id: string;
  text: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO format or YYYY-MM-DDTHH:mm
  endDate: string;   // ISO format or YYYY-MM-DDTHH:mm
  allDay?: boolean;
  location?: string;
  link?: string;
  type: EventType;
  program: ProgramCategory;
  isMandatory?: boolean;
  googleCalendarEventId?: string;
  syncedToGoogle?: boolean;
  completed?: boolean;
  color?: string;
  reminderMinutes?: number; // Minutes before event (e.g., 1440 = 1 day, 120 = 2 hours, 30 = 30 mins, 0 = none)
  trlLevel?: number; // Technology Readiness Level (1-9)
  tags?: string[];
  deliverables?: EventDeliverable[];
  priority?: 'critical' | 'high' | 'medium' | 'low';
}

export interface UserAuth {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  uid: string;
  accessToken: string | null;
  name?: string | null;
  picture?: string | null;
}

export type ViewMode = 'list' | 'calendar' | 'roadmap';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface GoogleTaskItem {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string; // RFC 3339 formatted: YYYY-MM-DDTHH:mm:ss.000Z or date string
  completed?: string; // RFC 3339 timestamp when completed
  updated?: string;
  position?: string;
  selfLink?: string;
  webViewLink?: string;
  // Rollover & UI metadata
  isRolledOver?: boolean;
  rolledOverFrom?: string;
  rolledOverCount?: number;
  priority?: TaskPriority;
  category?: string;
  source?: 'google-tasks' | 'local';
  // Idempotency & Conflict Resolution (Last-Write-Wins)
  syncHash?: string;
  updated_at?: string; // ISO 8601 timestamp for LWW arbitration
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string; // YYYY-MM-DD or YYYY-MM-DDTHH:mm
  priority: TaskPriority;
  category?: string; // e.g. 'Genel', 'Python', 'Kariyer', 'COP31', 'TÜBİTAK', 'CareerGen', 'Yapay Zeka'
  createdAt: string;
  completedAt?: string;
  linkedEventId?: string;
  // Rollover metadata
  isRolledOver?: boolean;
  rolledOverFrom?: string; // Original due date string (YYYY-MM-DD)
  rolledOverCount?: number; // Times this task has been postponed
  // Google Tasks Integration metadata
  googleTaskId?: string;
  googleTasklistId?: string;
  source?: 'local' | 'google-tasks' | 'calendar';
}

export interface RolloverReport {
  timestamp: string;
  targetDate: string; // YYYY-MM-DD
  rolledOverTasks: TaskItem[] | GoogleTaskItem[];
  googleTasksSyncedCount: number;
  emailSent?: boolean;
  emailRecipient?: string;
  message: string;
}

export interface GoogleMeetSpace {
  name: string; // e.g. "spaces/abc-defg-hij"
  meetingUri: string; // e.g. "https://meet.google.com/abc-defg-hij"
  meetingCode: string; // e.g. "abc-defg-hij"
  config?: {
    accessType?: 'ACCESS_TYPE_UNSPECIFIED' | 'OPEN' | 'TRUSTED' | 'RESTRICTED';
    entryPointAccess?: 'ENTRY_POINT_ACCESS_UNSPECIFIED' | 'ALL' | 'CREATOR_APP_ONLY';
  };
  activeConference?: {
    conferenceRecord?: string;
  };
}

export interface SavedGoogleMeeting {
  id: string;
  title: string;
  description?: string;
  meetingUri: string;
  meetingCode: string;
  spaceName: string;
  createdAt: string;
  scheduledDate?: string;
  scheduledTime?: string;
  category?: string;
  attendees?: string[];
  calendarEventId?: string;
}

