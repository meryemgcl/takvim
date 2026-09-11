import React, { useState } from 'react';
import { 
  Calendar, Target, CheckSquare, Layers, Settings, ChevronLeft, 
  ChevronRight, ChevronDown, Sparkles, FolderKanban, ShieldAlert, 
  RefreshCw, LogIn, LogOut, User as UserIcon, Bell, Mail, FileText, CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { UserAuth } from '../types';

export type MainNavSection = 'calendar' | 'roadmap' | 'tasks';

interface SidebarProps {
  currentSection: MainNavSection;
  onSelectSection: (section: MainNavSection) => void;
  selectedProgram: string;
  onSelectProgram: (program: string) => void;
  programCounts: { [key: string]: number };
  pendingTasksCount: number;
  totalEventsCount: number;
  user: UserAuth | null;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenVoiceAssistant?: () => void;
  onTestMorningBriefing?: () => void;
  isTestingBriefing?: boolean;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  selectedProgram,
  onSelectProgram,
  programCounts,
  pendingTasksCount,
  totalEventsCount,
  user,
  onLogin,
  onLogout,
  onOpenSettings,
  onOpenVoiceAssistant,
  onTestMorningBriefing,
  isTestingBriefing,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  const categories = [
    { key: 'all', label: 'Tüm Takvim', icon: '🌟', count: totalEventsCount },
    { key: 'akbank-python', label: "Akbank Python'a Giriş", icon: '🔴', count: programCounts['akbank-python'] || 0 },
    { key: 'nocode-lowcode', label: 'No-Code & Low-Code', icon: '🛠️', count: programCounts['nocode-lowcode'] || 0 },
    { key: 'tech-istanbul-bootcamp', label: 'Tech Istanbul AI Bootcamp', icon: '⚡', count: programCounts['tech-istanbul-bootcamp'] || 0 },
    { key: 'python-100-gun', label: 'Python 100 Gün (Sprint)', icon: '🐍', count: programCounts['python-100-gun'] || 0 },
    { key: 'kariyer-yetenek', label: 'Kariyer & Staj Havuzu', icon: '💼', count: programCounts['kariyer-yetenek'] || 0 },
    { key: 'cop31-gonullu', label: 'COP31 Türkiye Akademi', icon: '🌍', count: programCounts['cop31-gonullu'] || 0 },
    { key: 'akbank-genai', label: 'Akbank Yapay Zeka', icon: '🤖', count: programCounts['akbank-genai'] || 0 },
    { key: 'cezeri-staj', label: 'CEZERİ & FERGANİ 2027', icon: '🚀', count: (programCounts['cezeri-staj'] || 0) + (programCounts['fergani-staj'] || 0) },
    { key: 'tubitak-yarisma', label: 'TÜBİTAK 2209-A / Bilim', icon: '🏆', count: programCounts['tubitak-yarisma'] || 0 },
    { key: 'arge-inovasyon', label: 'Ar-Ge Proje Pazarı', icon: '🔬', count: programCounts['arge-inovasyon'] || 0 },
    { key: 'burs-basvuru', label: 'MÜKAD & TEV Burslar', icon: '🎓', count: programCounts['burs-basvuru'] || 0 },
    { key: 'teknofest-gonullu', label: 'TEKNOFEST 2027', icon: '🇹🇷', count: programCounts['teknofest-gonullu'] || 0 },
  ];

  const handleNavClick = (section: MainNavSection) => {
    onSelectSection(section);
    if (isMobileOpen) onCloseMobile();
  };

  const handleCategoryClick = (catKey: string) => {
    onSelectProgram(catKey);
    // If not already in calendar or roadmap, ensure we are in calendar view
    if (currentSection === 'tasks') {
      onSelectSection('calendar');
    }
    if (isMobileOpen) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 flex flex-col justify-between
        bg-[#151B2B] border-r border-[#263047] text-[#F1F5F9]
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Top Brand Header */}
        <div className="p-4 border-b border-[#263047] flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#4F46E5] flex items-center justify-center text-white shadow-lg shadow-[#6366F1]/20 shrink-0">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wider text-[#F59E0B] uppercase">Cosmic Royal</span>
                </div>
                <h2 className="text-base font-bold text-[#F1F5F9] tracking-tight truncate">
                  İnovasyon Ajandası
                </h2>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] transition cursor-pointer"
            title={isCollapsed ? "Menüyü Genişlet" : "Menüyü Daralt"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
          
          {/* Main Navigation Sections */}
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                İçindekiler
              </p>
            )}

            {/* 1. Ajanda & Takvim */}
            <button
              onClick={() => handleNavClick('calendar')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentSection === 'calendar'
                  ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D]'
              }`}
              title="📅 Ajanda & Takvim"
            >
              <Calendar className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="flex-1 text-left">Ajanda & Takvim</span>}
            </button>

            {/* 2. Kritik Teslimatlar & TRL */}
            <button
              onClick={() => handleNavClick('roadmap')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentSection === 'roadmap'
                  ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D]'
              }`}
              title="🎯 Kritik Teslimatlar & TRL"
            >
              <Target className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-left">Kritik Teslimatlar</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
                    TRL
                  </span>
                </div>
              )}
            </button>

            {/* 3. Google Görevler (To-Do) */}
            <button
              onClick={() => handleNavClick('tasks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                currentSection === 'tasks'
                  ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/25'
                  : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D]'
              }`}
              title="✅ Google Görevler (To-Do)"
            >
              <CheckSquare className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-left">Google Görevler</span>
                  {pendingTasksCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F59E0B] text-[#0B0F19]">
                      {pendingTasksCount}
                    </span>
                  )}
                </div>
              )}
            </button>
          </div>

          {/* 4. Proje Kategorileri Section */}
          <div className="space-y-1">
            {!isCollapsed ? (
              <div 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center justify-between px-3 py-1.5 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider cursor-pointer hover:text-[#F1F5F9]"
              >
                <span>Proje Kategorileri</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoriesOpen ? 'rotate-0' : '-rotate-90'}`} />
              </div>
            ) : (
              <div className="border-t border-[#263047] my-2" />
            )}

            {(isCategoriesOpen || isCollapsed) && (
              <div className="space-y-1">
                {categories.map(cat => {
                  const isSelected = selectedProgram === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => handleCategoryClick(cat.key)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#1E273D] text-[#F1F5F9] border border-[#6366F1]'
                          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D]/60'
                      }`}
                      title={cat.label}
                    >
                      <span className="text-sm shrink-0">{cat.icon}</span>
                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between truncate">
                          <span className="truncate text-left">{cat.label}</span>
                          {cat.count > 0 && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                              isSelected ? 'bg-[#6366F1] text-white' : 'bg-[#0B0F19] text-[#94A3B8]'
                            }`}>
                              {cat.count}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Section: Settings & Account */}
        <div className="p-3 border-t border-[#263047] space-y-2 bg-[#101522]">
          
          {/* Sabah 06:00 Raporu Test Butonu */}
          {onTestMorningBriefing && (
            <button
              onClick={onTestMorningBriefing}
              disabled={isTestingBriefing}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#6366F1]/15 hover:bg-[#6366F1]/25 text-[#A5B4FC] border border-[#6366F1]/30 transition cursor-pointer disabled:opacity-50"
              title="📨 Sabah 06:00 Raporunu Test Et"
            >
              {isTestingBriefing ? (
                <RefreshCw className="w-4 h-4 text-[#F59E0B] animate-spin shrink-0" />
              ) : (
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
              )}
              {!isCollapsed && (
                <span className="flex-1 text-left truncate">
                  {isTestingBriefing ? 'Gönderiliyor...' : '📨 06:00 Raporunu Test Et'}
                </span>
              )}
            </button>
          )}

          {/* Voice Command Assistant Quick Launch */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 hover:from-[#6366F1]/30 hover:to-[#8B5CF6]/30 text-[#A5B4FC] hover:text-white border border-[#6366F1]/40 transition cursor-pointer shadow-md shadow-[#6366F1]/10 group"
              title="🎙️ Sesli Komut Asistanı (Gemini AI)"
            >
              <span className="text-lg">🎙️</span>
              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between text-left">
                  <span>Sesli Asistan</span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#6366F1]/30 text-[#C7D2FE]">
                    AI
                  </span>
                </div>
              )}
            </button>
          )}

          {/* 5. Ayarlar / Senkronizasyon */}
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] transition cursor-pointer border border-transparent hover:border-[#263047]"
            title="⚙️ Ayarlar / Senkronizasyon"
          >
            <Settings className="w-5 h-5 text-[#6366F1] shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">Ayarlar & Senkronizasyon</span>}
          </button>

          {/* User Account Info */}
          {user ? (
            (() => {
              const userName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Kullanıcı');
              const userAvatar = user.photoURL || user.picture;
              const initial = (userName && userName.length > 0 ? userName.charAt(0) : 'U').toUpperCase();

              return (
                <div className="p-2 rounded-xl bg-[#151B2B] border border-[#263047] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-7 h-7 rounded-full shrink-0 border border-[#6366F1] object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {initial}
                      </div>
                    )}
                    {!isCollapsed && (
                      <div className="truncate text-left">
                        <p className="text-xs font-bold text-[#F1F5F9] truncate">{userName}</p>
                        <p className="text-[10px] text-[#94A3B8] truncate">{user.email || ''}</p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#EC4899] hover:bg-[#1E273D] transition cursor-pointer shrink-0"
                    title="Çıkış Yap"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              );
            })()
          ) : (
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] border border-[#263047] transition cursor-pointer"
              title="Google ile Bağlan"
            >
              <LogIn className="w-4 h-4 text-[#6366F1]" />
              {!isCollapsed && <span>Google ile Bağlan</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
