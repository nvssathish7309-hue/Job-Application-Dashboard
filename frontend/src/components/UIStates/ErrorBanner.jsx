import React from 'react';
import { AlertOctagon, RefreshCw, XCircle } from 'lucide-react';

export default function ErrorBanner({ onRetry, onDismiss }) {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 animate-shake">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-rose-500 text-white shrink-0">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-rose-900">
            Server Sync Error (Simulated 500 Network Exception)
          </h4>
          <p className="text-xs text-rose-700">
            Failed to fetch real-time candidate updates from recruitment server database. Please retry connection.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Sync</span>
        </button>
        <button
          onClick={onDismiss}
          className="p-1 text-rose-500 hover:text-rose-700"
          title="Dismiss Error"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
