
import React, { useState } from 'react';
import { generateSyntheticPrescriptions } from './services/geminiService';
import { Prescription, GenerationConfig } from './types';
import PrescriptionCard from './components/PrescriptionCard';

const App: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'preview' | 'json'>('preview');
  
  const [config, setConfig] = useState<GenerationConfig>({
    count: 3
  });

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateSyntheticPrescriptions(config);
      setPrescriptions(data);
      setSelectedIndex(0);
    } catch (err: any) {
      setError(err.message || "Failed to generate data. Check API key.");
    } finally {
      setLoading(false);
    }
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(prescriptions, null, 2));
    alert("JSON copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Dummy prescription</h1>
            <p className="text-xs text-slate-400 font-mono">Global Disease Synthetic Engine</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-xs bg-slate-800 px-3 py-1 rounded-full border border-slate-700 font-mono">
            MODE: ALL_DISEASES_RANDOM
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <aside className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto flex flex-col gap-6">
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Generator Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Prescription Count</label>
                <input 
                  type="number" 
                  min="1" 
                  max="20"
                  value={config.count}
                  onChange={(e) => setConfig({...config, count: parseInt(e.target.value) || 1})}
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-[10px] text-blue-700 font-bold uppercase mb-1">Context Engine</p>
                <p className="text-xs text-blue-900 leading-relaxed">
                  Prescriptions will be drawn randomly from a global database of thousands of diseases and clinical conditions.
                </p>
              </div>

              <button 
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    GENERATING...
                  </span>
                ) : 'GENERATE BATCH'}
              </button>
            </div>
          </section>

          {prescriptions.length > 0 && (
            <section className="flex-1 flex flex-col min-h-0">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Batch Results ({prescriptions.length})</h2>
              <div className="space-y-2 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                {prescriptions.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${selectedIndex === idx ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100' : 'bg-slate-50 border-slate-100 hover:bg-slate-200 text-slate-900'}`}
                  >
                    <div className={`text-[10px] font-bold mb-1 ${selectedIndex === idx ? 'text-blue-200' : 'text-blue-600'}`}>{p.patient.id}</div>
                    <div className="text-sm font-bold truncate">{p.patient.name}</div>
                    <div className={`text-[10px] font-medium mt-1 truncate ${selectedIndex === idx ? 'text-blue-100' : 'text-slate-500'}`}>{p.diagnosis}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm animate-bounce">
              <p className="font-bold flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Error
              </p>
              <p className="text-xs opacity-80 mt-1">{error}</p>
            </div>
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-slate-50 p-8 overflow-y-auto flex flex-col items-center">
          {prescriptions.length > 0 ? (
            <div className="w-full max-w-4xl flex flex-col gap-6">
              <div className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex bg-slate-100 rounded-xl p-1">
                  <button 
                    onClick={() => setViewMode('preview')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'preview' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Visual Preview
                  </button>
                  <button 
                    onClick={() => setViewMode('json')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'json' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Raw JSON
                  </button>
                </div>

                <button 
                  onClick={copyJson}
                  className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy JSON Batch
                </button>
              </div>

              {viewMode === 'preview' ? (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                  <PrescriptionCard prescription={prescriptions[selectedIndex]} />
                </div>
              ) : (
                <div className="bg-slate-900 text-blue-400 p-8 rounded-3xl font-mono text-sm overflow-x-auto shadow-2xl h-[700px] border border-slate-800 custom-scrollbar">
                  <pre className="leading-relaxed">{JSON.stringify(prescriptions, null, 2)}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-6 max-w-md text-center">
              <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-16 h-16 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 mb-2">Dummy prescription</p>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Enter the number of prescriptions needed and our AI engine will generate diverse medical data for thousands of conditions worldwide.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="font-bold text-slate-500">ENGINE_STATUS: STABLE</span>
          <span className="h-1 w-1 bg-green-500 rounded-full"></span>
          <span>SCHEMA: HL7_JSON_V2</span>
        </div>
        <div className="flex gap-6 items-center">
          <span className="italic">Supports all ICD-10 equivalents</span>
          <span className="text-blue-600 font-bold uppercase tracking-widest text-[9px] px-2 py-0.5 bg-blue-50 rounded">Gemini AI Enhanced</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
