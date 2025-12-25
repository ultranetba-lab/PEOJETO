
import React, { useState, useEffect } from 'react';
import { User, PunchRecord, Location } from '../types';
import { Camera } from '../components/Camera';
import { Clock, MapPin, CheckCircle2, LogOut, History, Globe } from 'lucide-react';

interface EmployeeDashboardProps {
  user: User;
  punches: PunchRecord[];
  onLogout: () => void;
  onAddPunch: (punch: PunchRecord) => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ user, punches, onLogout, onAddPunch }) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => clearInterval(timer);
  }, []);

  const handlePunch = (type: PunchRecord['type']) => {
    if (!photo || !location) {
      alert("Atenção: É obrigatório tirar a foto e aguardar o sinal de GPS.");
      return;
    }
    const newPunch: PunchRecord = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: user.id,
      timestamp: new Date().toISOString(),
      type,
      photo,
      location
    };
    onAddPunch(newPunch);
    setStatus('SUCCESS');
    setPhoto(null);
    setTimeout(() => setStatus('IDLE'), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8 space-y-8">
      <header className="max-w-[1400px] w-full mx-auto bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg">
            <Globe size={40} />
          </div>
          <div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">UltraNET Industrial</p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800">Olá, {user.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-4xl md:text-5xl font-black text-slate-800 tabular-nums leading-none">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-2">
              {time.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            </p>
          </div>
          <button onClick={onLogout} className="p-5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-slate-100">
            <LogOut size={28} />
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        <main className="lg:col-span-8 bg-white p-8 md:p-16 rounded-[4rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center space-y-12">
          <div className="text-center space-y-8 w-full">
            <h3 className="text-xl font-black text-slate-800 flex items-center justify-center gap-3 uppercase tracking-widest">
              <Clock size={24} className="text-blue-600" /> Confirmar Batida de Ponto
            </h3>
            <div className="scale-110 md:scale-125">
              <Camera onCapture={setPhoto} />
            </div>
          </div>

          <div className="w-full flex flex-col items-center gap-8">
            <div className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest border-2 ${location ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'}`}>
              <MapPin size={18} className="inline mr-2" /> {location ? 'Sinal GPS Confirmado' : 'Buscando Localização...'}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
              <button onClick={() => handlePunch('IN')} disabled={!photo || !location} className="h-24 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-2xl shadow-lg disabled:opacity-30 transition-all active:scale-95">ENTRADA</button>
              <button onClick={() => handlePunch('OUT')} disabled={!photo || !location} className="h-24 bg-slate-800 hover:bg-slate-900 text-white rounded-3xl font-black text-2xl shadow-lg disabled:opacity-30 transition-all active:scale-95">SAÍDA</button>
              <button onClick={() => handlePunch('LUNCH_START')} disabled={!photo || !location} className="h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-lg disabled:opacity-30 transition-all active:scale-95">ALMOÇO (IDA)</button>
              <button onClick={() => handlePunch('LUNCH_END')} disabled={!photo || !location} className="h-20 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black text-lg shadow-lg disabled:opacity-30 transition-all active:scale-95">ALMOÇO (VOLTA)</button>
            </div>
          </div>
        </main>

        <aside className="lg:col-span-4 bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
              <History size={20} className="text-blue-600" /> Registros de Hoje
            </h3>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {punches.length > 0 ? punches.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <img src={p.photo} className="w-16 h-16 rounded-xl object-cover shadow-sm ring-2 ring-white" />
                <div className="flex-1">
                  <p className="font-black text-slate-800 text-base">{p.type === 'IN' ? 'Entrada' : p.type === 'OUT' ? 'Saída' : 'Almoço'}</p>
                  <p className="text-xl font-black text-blue-600">{new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <Clock size={48} />
                <p className="text-xs font-black uppercase mt-2">Sem registros</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {status === 'SUCCESS' && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-10 py-6 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-20 z-50 border-2 border-emerald-500">
          <CheckCircle2 size={32} />
          <span className="font-black text-xl">PONTO REGISTRADO!</span>
        </div>
      )}

      <footer className="text-center py-6">
        <p className="text-xs font-black text-slate-300 uppercase tracking-[0.5em]">UltraNET v1.0 - Produção</p>
      </footer>
    </div>
  );
};
