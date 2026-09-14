import React from 'react';
import { Sprout, AlertTriangle, ShieldCheck, Clock, Layers, FileCheck } from 'lucide-react';
import { ShiftInfo } from '../types';

interface HeaderProps {
  currentTab: 'overview' | 'inspect' | 'handover';
  onTabChange: (tab: 'overview' | 'inspect' | 'handover') => void;
  shiftInfo: ShiftInfo;
  flaggedCount: number;
  abnormalCount: number;
  currentTime: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  shiftInfo,
  flaggedCount,
  abnormalCount,
  currentTime,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-md">
      {/* Top Status Ticker */}
      <div className="bg-slate-950 px-3 py-1.5 border-b border-slate-800/80 text-[11px] sm:text-xs flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-medium text-[10px] sm:text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            12 Bays Online & Telemetry Active
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="text-slate-300 font-medium text-[10px] sm:text-[11px] leading-tight">
            {shiftInfo.facilityZone}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-[10px] sm:text-[11px]">
          <span className="flex items-center gap-1 font-mono text-slate-200">
            <Clock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
            {currentTime}
          </span>
          {shiftInfo.isLocked ? (
            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-semibold border border-indigo-800 text-[10px] sm:text-xs">
              Shift Locked
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-medium border border-amber-800/60 text-[10px] sm:text-xs">
              Handover Window Open
            </span>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4">
        {/* Branding & Role */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-inner flex-shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 truncate">
                HydroCrop Monitor
              </h1>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 sm:px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                Ops v2.4
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 leading-snug sm:leading-normal">
              Shift Handover & Facility Diagnostics • {shiftInfo.outgoingLead}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700/60 shadow-inner">
          <button
            id="nav-tab-overview"
            onClick={() => onTabChange('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              currentTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <Layers className="w-4 h-4 flex-shrink-0" />
            <span>Shift Overview</span>
            {abnormalCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                {abnormalCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-inspect"
            onClick={() => onTabChange('inspect')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              currentTab === 'inspect'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>Bay Inspection & Action</span>
            {flaggedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white font-mono">
                {flaggedCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-handover"
            onClick={() => onTabChange('handover')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
              currentTab === 'handover'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
            }`}
          >
            <FileCheck className="w-4 h-4 flex-shrink-0" />
            <span>Handover Summary & Logs</span>
            {shiftInfo.isLocked && (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            )}
          </button>
        </nav>

        {/* Quick Handover Readiness Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <div className="text-[11px] text-slate-400 font-medium">Flagged for Incoming:</div>
            <div className="text-xs font-bold text-indigo-400">
              {flaggedCount === 0 ? '0 bays flagged' : `${flaggedCount} bays active in handover`}
            </div>
          </div>
          <button
            id="header-quick-handover-btn"
            onClick={() => onTabChange('handover')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer min-h-[40px] whitespace-nowrap"
          >
            <FileCheck className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Review Handover</span>
            <span className="sm:hidden">Logs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
