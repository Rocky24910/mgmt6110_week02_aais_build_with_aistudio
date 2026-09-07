import React from 'react';
import { Layers, AlertTriangle, FileCheck } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'overview' | 'inspect' | 'handover';
  onTabChange: (tab: 'overview' | 'inspect' | 'handover') => void;
  flaggedCount: number;
  abnormalCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  flaggedCount,
  abnormalCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1 shadow-2xl safe-area-pb">
      <div className="grid grid-cols-3 gap-1">
        {/* Tab 1: Overview */}
        <button
          id="bottom-tab-overview"
          onClick={() => onTabChange('overview')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[50px] ${
            currentTab === 'overview'
              ? 'bg-emerald-600/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Layers className="w-5 h-5" />
            {abnormalCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-amber-500 text-slate-950">
                {abnormalCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Overview</span>
        </button>

        {/* Tab 2: Inspect & Action */}
        <button
          id="bottom-tab-inspect"
          onClick={() => onTabChange('inspect')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[50px] ${
            currentTab === 'inspect'
              ? 'bg-emerald-600/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5" />
            {flaggedCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-indigo-500 text-white">
                {flaggedCount}
              </span>
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Inspect & Flag</span>
        </button>

        {/* Tab 3: Handover Summary */}
        <button
          id="bottom-tab-handover"
          onClick={() => onTabChange('handover')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[50px] ${
            currentTab === 'handover'
              ? 'bg-emerald-600/20 text-emerald-400 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <FileCheck className="w-5 h-5" />
            {flaggedCount > 0 && (
              <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-indigo-400" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Handover Logs</span>
        </button>
      </div>
    </div>
  );
};
