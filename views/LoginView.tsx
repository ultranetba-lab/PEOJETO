
import React, { useState } from 'react';
import { User, Employee } from '../types';
import { LogIn, ShieldCheck, User as UserIcon, Globe } from 'lucide-react';

interface LoginViewProps {
  onLogin: (user: User) => void;
  employees: Employee[];
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin, employees }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.toUpperCase() === 'ADMIN' && password === 'Win9135@') {
      onLogin({ id: '1', name: 'Administrador UltraNET', email: 'admin@ultranet.com', role: 'ADMIN' });
      return;
    }
    const employee = employees.find(emp => emp.name.toLowerCase() === username.toLowerCase());
    if (employee && (employee.password === password || (!employee.password && password === '123456'))) {
      onLogin({ id: employee.id, name: employee.name, email: employee.email, role: 'EMPLOYEE' });
    } else {
      setError('Credenciais inválidas. Verifique usuário e senha.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-4 md:p-8">
      <div className="w-full max-w-2xl animate-in fade-in zoom-in duration-500">
        <div className="bg-white rounded-[3rem] shadow-2xl p-10 md:p-20 space-y-12 border border-slate-200">
          
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                <Globe size={64} />
              </div>
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tighter uppercase">
                Ultra<span className="text-blue-600">NET</span>
              </h1>
              <p className="text-slate-400 font-bold text-sm md:text-base tracking-[0.3em] uppercase mt-2">
                Ponto Eletrônico Digital
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                <input
                  type="text"
                  placeholder="Nome do Usuário"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xl font-bold text-slate-700"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={24} />
                <input
                  type="password"
                  placeholder="Sua Senha"
                  className="w-full pl-16 pr-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xl font-bold text-slate-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm font-black bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center gap-4 transition-all active:scale-[0.98] text-xl uppercase tracking-widest"
            >
              <LogIn size={28} strokeWidth={3} /> Acessar Sistema
            </button>
          </form>

          <div className="pt-10 border-t-2 border-slate-50 text-center">
            <p className="text-sm font-black text-slate-300 uppercase tracking-[0.4em]">
              Desenvolvido pela <span className="text-blue-600">UltraNET</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
