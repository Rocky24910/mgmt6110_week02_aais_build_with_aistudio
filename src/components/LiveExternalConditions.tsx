import React, { useState, useEffect, useCallback } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  MapPin,
  RefreshCw,
  AlertCircle,
  WifiOff,
  Clock,
  Info
} from 'lucide-react';

export interface ExternalConditionsData {
  stationId: string;
  station?: string;
  stationName?: string;
  temperature: number | null;
  temperatureUnit?: string;
  temperatureObservationTimestamp?: string | null;
  temperatureObservedAt?: string | null;
  relativeHumidity?: number | null;
  humidity?: number | null;
  humidityUnit?: string;
  humidityObservationTimestamp?: string | null;
  humidityObservedAt?: string | null;
  source: string;
  empty?: boolean;
  message?: string;
}

type UIState = 'loading' | 'success' | 'empty' | 'upstream_error' | 'unreachable';

function formatObservedTime(isoString: string | null): string {
  if (!isoString) return 'Not recorded';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return (
      date.toLocaleTimeString('en-SG', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }) + ' SGT'
    );
  } catch {
    return isoString;
  }
}

export const LiveExternalConditions: React.FC = () => {
  const [uiState, setUiState] = useState<UIState>('loading');
  const [data, setData] = useState<ExternalConditionsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchConditions = useCallback(async (manual = false) => {
    if (manual) {
      setIsRefreshing(true);
    } else {
      setUiState('loading');
    }

    try {
      const response = await fetch('/api/environment', {
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        // Upstream service or server-side returned non-2xx
        setUiState('upstream_error');
        setData(null);
        return;
      }

      const json: ExternalConditionsData = await response.json();

      // Check for empty data condition (e.g., station absent or both values null)
      const currentHum = json.relativeHumidity ?? json.humidity ?? null;
      if (
        json.empty ||
        (json.temperature === null && currentHum === null)
      ) {
        setUiState('empty');
        setData(json);
      } else {
        setUiState('success');
        setData(json);
      }
    } catch {
      // Browser network error / unreachable endpoint
      setUiState('unreachable');
      setData(null);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchConditions();
  }, [fetchConditions]);

  return (
    <section
      id="live-external-conditions-section"
      aria-label="Live External Conditions"
      className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
            <CloudSun className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Live External Conditions
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                Ambient Singapore Weather
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              External city environmental data • Not indoor farm or hydro-bay telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            Station: Scotts Road (S111)
          </span>
          <button
            id="refresh-external-conditions-btn"
            onClick={() => fetchConditions(true)}
            disabled={isRefreshing}
            title="Refresh external conditions"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Body States */}
      <div className="pt-3.5">
        {/* STATE 1: LOADING */}
        {uiState === 'loading' && (
          <div
            id="external-conditions-loading"
            className="py-4 px-3 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            <RefreshCw className="w-4 h-4 text-sky-500 animate-spin flex-shrink-0" />
            <span>Loading latest Singapore external conditions…</span>
          </div>
        )}

        {/* STATE 2: EMPTY DATA */}
        {uiState === 'empty' && (
          <div
            id="external-conditions-empty"
            className="py-4 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300"
          >
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>No recent external readings are available from this station.</span>
          </div>
        )}

        {/* STATE 3: UPSTREAM ERROR */}
        {uiState === 'upstream_error' && (
          <div
            id="external-conditions-upstream-error"
            className="py-4 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-800 dark:text-amber-300"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <span>External conditions are temporarily unavailable from data.gov.sg.</span>
            </div>
            <button
              onClick={() => fetchConditions(true)}
              className="text-[11px] font-bold underline hover:no-underline text-amber-900 dark:text-amber-200 flex-shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* STATE 4: UNREACHABLE */}
        {uiState === 'unreachable' && (
          <div
            id="external-conditions-unreachable"
            className="py-4 px-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300"
          >
            <div className="flex items-center gap-2.5">
              <WifiOff className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span>
                The environmental data service cannot be reached right now. Facility
                sensor monitoring is unaffected.
              </span>
            </div>
            <button
              onClick={() => fetchConditions(true)}
              className="text-[11px] font-bold underline hover:no-underline text-slate-900 dark:text-slate-100 flex-shrink-0 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* SUCCESS STATE */}
        {uiState === 'success' && data && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Outdoor Temperature */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Outdoor Temperature
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                      {data.temperature !== null ? `${data.temperature.toFixed(1)}°C` : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 justify-end font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Observed:
                  </span>
                  <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 block">
                    {formatObservedTime(data.temperatureObservationTimestamp || data.temperatureObservedAt)}
                  </span>
                </div>
              </div>

              {/* Relative Humidity */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                      Relative Humidity
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 font-mono">
                      {(data.relativeHumidity ?? data.humidity) !== null && (data.relativeHumidity ?? data.humidity) !== undefined
                        ? `${(data.relativeHumidity ?? data.humidity)!.toFixed(1)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 justify-end font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Observed:
                  </span>
                  <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 block">
                    {formatObservedTime(data.humidityObservationTimestamp || data.humidityObservedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Attribution & Contextual Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <span>Source: NEA / data.gov.sg</span>
                <span className="text-slate-400">•</span>
                <span>Station: <strong className="text-slate-700 dark:text-slate-300">Scotts Road ({data.stationId})</strong></span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic">
                * Timestamps reflect individual station sensor transmission cycles.
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
