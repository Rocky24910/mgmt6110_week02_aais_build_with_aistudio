import React, { useState } from 'react';
import { ShiftInfo, HydroBay } from '../types';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Send, 
  Bell, 
  X, 
  AlertTriangle, 
  Printer, 
  Sparkles 
} from 'lucide-react';

interface HandoverConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftInfo: ShiftInfo;
  flaggedBays: HydroBay[];
  onConfirmLock: () => void;
}

export const HandoverConfirmModal: React.FC<HandoverConfirmModalProps> = ({
  isOpen,
  onClose,
  shiftInfo,
  flaggedBays,
  onConfirmLock,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' SGT';

  // Construct the automated alert notification payload
  const broadcastText = `[HYDROCROP OPS SHIFT HANDOVER BROADCAST]
Shift: ${shiftInfo.shiftId} (${shiftInfo.shiftName})
Outgoing Lead: ${shiftInfo.outgoingLead}
Incoming Team: ${shiftInfo.incomingTeam}
Timestamp: ${timestamp}
Facility: ${shiftInfo.facilityName} - ${shiftInfo.facilityZone}

FLAGGED BAYS & ACTION REQUIRED (${flaggedBays.length} active):
${
  flaggedBays.length === 0
    ? 'All 12 automated bays nominal. Zero abnormal flags.'
    : flaggedBays
        .map(
          (b, idx) =>
            `${idx + 1}. [${b.id}] ${b.cropType} - ${b.activeFlag?.priority.toUpperCase()} PRIORITY: ${b.activeFlag?.category} (Current pH: ${b.pH.toFixed(2)}, EC: ${b.ec.toFixed(2)} mS)\n   Action: ${b.activeFlag?.actionRequired}\n   Assigned: ${b.activeFlag?.assignedTeam}`
        )
        .join('\n\n')
}

Checklist Status: Facility automated systems verified.
Handover Status: LOCKED & CONFIRMED BY OUTGOING TECHNICIAN.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(broadcastText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleConfirm = () => {
    onConfirmLock();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl text-slate-100 p-4 sm:p-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                Automated Shift Handover Broadcast
              </h3>
              <p className="text-xs text-slate-400 truncate">
                Dispatches alert notification to incoming team: {shiftInfo.incomingTeam}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dispatch Overview Box */}
        <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              Automated Dispatch Ready
            </span>
            <span>{timestamp}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-500">Shift ID:</span>{' '}
              <span className="text-slate-200 font-bold">{shiftInfo.shiftId}</span>
            </div>
            <div>
              <span className="text-slate-500">Outgoing:</span>{' '}
              <span className="text-slate-200">{shiftInfo.outgoingLead}</span>
            </div>
            <div>
              <span className="text-slate-500">Receiver:</span>{' '}
              <span className="text-slate-200">{shiftInfo.incomingTeam}</span>
            </div>
            <div>
              <span className="text-slate-500">Active Flags:</span>{' '}
              <span className="text-indigo-400 font-bold">{flaggedBays.length} Bays</span>
            </div>
          </div>

          {/* Broadcast Payload Box */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-700/60 font-mono text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
            {broadcastText}
          </div>
        </div>

        {/* Flagged Summary Badges */}
        <div className="mt-4">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Dispatched Alert Queue ({flaggedBays.length}):
          </div>
          <div className="space-y-2">
            {flaggedBays.map((bay) => (
              <div
                key={bay.id}
                className="p-2.5 rounded-lg bg-slate-800/80 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-indigo-300">{bay.id}</span>
                    <span className="font-semibold text-white">{bay.cropType}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-900 text-indigo-200 font-bold uppercase">
                      {bay.activeFlag?.priority} Priority
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-1">
                    {bay.activeFlag?.category} • Action: {bay.activeFlag?.actionRequired}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                  {bay.activeFlag?.assignedTeam}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[44px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Broadcast Text</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
            >
              Close
            </button>

            {!shiftInfo.isLocked && (
              <button
                id="confirm-lock-shift-btn"
                onClick={handleConfirm}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm & Lock Shift Log</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
