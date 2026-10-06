import React from 'react';
import { Search, Plus, Menu, User as UserIcon, LogIn, Sparkles, X, Video, FileText } from 'lucide-react';
import { UserAuth } from '../types';

interface HeaderProps {
  user: UserAuth | null;
  onLogin: () => void;
  onOpenAddModal: () => void;
  onOpenGoogleMeet?: () => void;
  onOpenPdfReport?: () => void;
  onOpenQueueMonitor?: () => void;
  isSSEConnected?: boolean;
  onToggleMobileSidebar?: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogin,
  onOpenAddModal,
  onOpenGoogleMeet,
  onOpenPdfReport,
  onOpenQueueMonitor,
  isSSEConnected = false,
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
  title = "Ajanda & Takvim",
  subtitle
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#263047] text-[#F1F5F9] px-4 sm:px-6 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Left: Mobile Toggle & Elegant Page Title */}
        <div className="flex items-center gap-3 shrink-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-[#151B2B] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#263047] transition cursor-pointer"
              title="Menüyü Aç"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#F1F5F9] tracking-tight">
                {title}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30">
                Cosmic Royal
              </span>
            </div>
            {subtitle && (
              <p className="text-xs text-[#94A3B8] font-normal hidden md:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Clean Search Bar */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Etkinlik, staj veya görev ara..."
              className="w-full pl-9 pr-8 py-2 bg-[#151B2B] border border-[#263047] rounded-xl text-xs sm:text-sm text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20 transition"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F1F5F9] transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Kuyruk & SSE + PDF Raporu + Google Meet + Voice Assistant + "+ Yeni Ekle" Button and Google Account Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {onOpenQueueMonitor && (
            <button
              onClick={onOpenQueueMonitor}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl flex items-center gap-1.5 transition cursor-pointer border shadow-lg ${
                isSSEConnected
                  ? 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white border-emerald-500/35 shadow-emerald-950/20'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-white border-amber-500/35 shadow-amber-950/20'
              }`}
              title="⚡ Asenkron Olay Yöneticisi & İş Kuyruğu (FastAPI BackgroundTasks & SSE Akışı)"
            >
              <span className={`w-2 h-2 rounded-full ${isSSEConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="hidden sm:inline text-xs font-bold">Kuyruk & SSE</span>
            </button>
          )}

          {onOpenPdfReport && (
            <button
              onClick={onOpenPdfReport}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-white border border-rose-500/35 flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-rose-950/20 group"
              title="📄 Detaylı Proje Dokümantasyonu & PDF Raporu"
            >
              <FileText className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold">PDF Raporu</span>
            </button>
          )}

          {onOpenGoogleMeet && (
            <button
              onClick={onOpenGoogleMeet}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-white border border-emerald-500/35 flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-emerald-950/20 group"
              title="🎥 Google Meet Toplantı Merkezi (Yeni Oda & Planlama)"
            >
              <Video className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold">Meet</span>
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#6366F1]/25 flex items-center gap-1.5 transition transform hover:scale-[1.02] cursor-pointer"
            title="Yeni Etkinlik veya Görev Ekle"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Yeni Ekle</span>
          </button>

          {user ? (
            (() => {
              const userName = user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Kullanıcı');
              const userAvatar = user.photoURL || user.picture;
              const initial = (userName && userName.length > 0 ? userName.charAt(0) : 'U').toUpperCase();

              return (
                <div className="flex items-center gap-2">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-8 h-8 rounded-xl border border-[#6366F1] object-cover shadow-sm"
                      title={userName}
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-xl bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs shadow-sm"
                      title={userName}
                    >
                      {initial}
                    </div>
                  )}
                </div>
              );
            })()
          ) : (
            <button
              onClick={onLogin}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#151B2B] hover:bg-[#1E273D] text-[#F1F5F9] text-xs font-semibold border border-[#263047] flex items-center gap-1.5 transition cursor-pointer"
              title="Google ile Giriş Yap"
            >
              <LogIn className="w-4 h-4 text-[#6366F1]" />
              <span className="hidden sm:inline">Giriş</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
