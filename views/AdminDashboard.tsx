
import React, { useState, useMemo } from 'react';
import { User, Employee, PunchRecord, ScheduleConfig, SpecialDay } from '../types';
import { Users, Plus, Search, Edit3, Trash2, LogOut, Clock, Globe, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';

interface AdminDashboardProps {
  user: User;
  employees: Employee[];
  punches: PunchRecord[];
  schedule: ScheduleConfig;
  specialDays: SpecialDay[];
  onLogout: () => void;
  onUpdateEmployees: (emps: Employee[]) => void;
  onUpdateSchedule: (sch: ScheduleConfig) => void;
  onUpdateSpecialDays: (days: SpecialDay[]) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  employees, punches, onLogout, onUpdateEmployees 
}) => {
  const [selectedEmpId, setSelectedEmpId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [empForm, setEmpForm] = useState<Partial<Employee>>({ name: '', email: '', password: '123', workHoursPerDay: 8 });

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEmployee = employees.find(e => e.id === selectedEmpId);

  const calculateHours = useMemo(() => {
    if (!selectedEmpId) return { extra: "0.0", missing: "0.0", history: [] };
    const empPunches = punches.filter(p => p.employeeId === selectedEmpId);
    
    // Lógica simplificada para demonstração: cada registro completo (IN/OUT) conta horas.
    // Em um sistema real, aqui você usaria o loop por dias comparando com o ScheduleConfig.
    const totalPunches = empPunches.length;
    const mockBalance = (totalPunches * 4) - 20; // Simulação de saldo

    return {
      extra: mockBalance > 0 ? mockBalance.toFixed(1) : "0.0",
      missing: mockBalance < 0 ? Math.abs(mockBalance).toFixed(1) : "0.0",
      history: empPunches.sort((a,b) => b.timestamp.localeCompare(a.timestamp))
    };
  }, [selectedEmpId, punches]);

  const handleSave = () => {
    if (empForm.name && empForm.email) {
      const added: Employee = {
        id: Math.random().toString(36).substr(2, 9),
        name: empForm.name!,
        email: empForm.email!,
        password: empForm.password || '123',
        workHoursPerDay: empForm.workHoursPerDay || 8,
        registrationNumber: `UN-${Math.floor(Math.random() * 9999)}`
      };
      onUpdateEmployees([...employees, added]);
      setIsAdding(false);
      setEmpForm({ name: '', email: '', password: '123', workHoursPerDay: 8 });
    }
  };

  const removeEmployee = (id: string) => {
    if (confirm("Remover este colaborador permanentemente?")) {
      onUpdateEmployees(employees.filter(e => e.id !== id));
      if (selectedEmpId === id) setSelectedEmpId(null);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar / Lista à Esquerda */}
      <aside className="w-[450px] bg-white border-r border-slate-200 flex flex-col shadow-lg z-10">
        <header className="p-8 border-b space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Globe size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Ultra<span className="text-blue-600">NET</span></h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Administração</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button onClick={() => setIsAdding(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
              <Plus size={20} /> CADASTRAR FUNCIONÁRIO
            </button>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredEmployees.map(emp => (
            <div 
              key={emp.id} 
              onClick={() => setSelectedEmpId(emp.id)}
              className={`p-6 border-b cursor-pointer transition-all flex items-center justify-between group ${selectedEmpId === emp.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${selectedEmpId === emp.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-base">{emp.name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase">{emp.registrationNumber}</p>
                </div>
              </div>
              <ChevronRight size={20} className={`${selectedEmpId === emp.id ? 'text-blue-600' : 'text-slate-200'} group-hover:translate-x-1 transition-all`} />
            </div>
          ))}
        </div>

        <footer className="p-6 border-t">
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-4 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
            <LogOut size={18} /> Encerrar Painel
          </button>
        </footer>
      </aside>

      {/* Detalhes à Direita */}
      <main className="flex-1 bg-slate-50 overflow-y-auto p-12">
        {selectedEmployee ? (
          <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            <header className="flex items-center justify-between bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-600 font-black text-4xl">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tighter">{selectedEmployee.name}</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest mt-1">{selectedEmployee.email}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-4 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl border border-slate-100"><Edit3 size={24} /></button>
                <button onClick={() => removeEmployee(selectedEmployee.id)} className="p-4 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl border border-slate-100"><Trash2 size={24} /></button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
                <TrendingUp size={100} className="absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform" />
                <p className="text-6xl font-black tabular-nums">{calculateHours.extra}h</p>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Horas Extras Acumuladas</p>
              </div>
              <div className="bg-white border-2 border-slate-100 p-10 rounded-[3rem] shadow-xl relative overflow-hidden group">
                <AlertTriangle size={100} className="absolute -bottom-6 -right-6 opacity-[0.03] group-hover:scale-110 transition-transform" />
                <p className="text-6xl font-black tabular-nums text-slate-800">{calculateHours.missing}h</p>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-red-500 mt-2">Horas em Falta</p>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                <Clock size={24} className="text-blue-600" /> Histórico de Pontos
              </h3>
              <div className="space-y-4">
                {calculateHours.history.map(p => (
                  <div key={p.id} className="flex items-center gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                    {p.photo && <img src={p.photo} className="w-16 h-16 rounded-2xl object-cover shadow-sm ring-4 ring-white" />}
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-lg uppercase tracking-tight">{p.type === 'IN' ? 'Entrada' : p.type === 'OUT' ? 'Saída' : 'Almoço'}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase">{new Date(p.timestamp).toLocaleDateString('pt-BR')} — {new Date(p.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg uppercase">Validado</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-200 space-y-4">
             <Users size={120} strokeWidth={0.5} />
             <p className="text-2xl font-black uppercase tracking-[0.2em]">Selecione um Funcionário</p>
          </div>
        )}
      </main>

      {/* Modal de Cadastro */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl p-12 space-y-8 animate-in zoom-in-95">
            <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Novo <span className="text-blue-600">Funcionário</span></h3>
            <div className="space-y-4">
              <input placeholder="Nome do Colaborador" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} />
              <input placeholder="E-mail" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} />
              <input placeholder="Senha de Acesso" className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold" value={empForm.password} onChange={e => setEmpForm({...empForm, password: e.target.value})} />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setIsAdding(false)} className="flex-1 py-5 text-slate-400 font-black uppercase tracking-widest text-xs">Cancelar</button>
              <button onClick={handleSave} className="flex-1 py-5 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20">Salvar Cadastro</button>
            </div>
          </div>
        </div>
      )}

      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }`}</style>
    </div>
  );
};
