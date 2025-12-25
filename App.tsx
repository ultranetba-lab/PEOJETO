
import React, { useState, useEffect } from 'react';
import { LoginView } from './views/LoginView';
import { EmployeeDashboard } from './views/EmployeeDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { User, Employee, PunchRecord, ScheduleConfig, SpecialDay } from './types';
import { mockEmployees, mockPunches } from './constants';

const DEFAULT_SCHEDULE: ScheduleConfig = {
  weekdayIn: '08:00',
  weekdayLunchStart: '12:00',
  weekdayLunchEnd: '13:00',
  weekdayOut: '17:00',
  saturdayIn: '08:00',
  saturdayOut: '12:00'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [punches, setPunches] = useState<PunchRecord[]>([]);
  const [schedule, setSchedule] = useState<ScheduleConfig>(DEFAULT_SCHEDULE);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('ultra_employees');
    const storedPunches = localStorage.getItem('ultra_punches');
    const storedUser = localStorage.getItem('ultra_user');
    const storedSchedule = localStorage.getItem('ultra_schedule');
    const storedSpecialDays = localStorage.getItem('ultra_special_days');

    if (storedEmployees) setEmployees(JSON.parse(storedEmployees));
    else {
      setEmployees(mockEmployees);
      localStorage.setItem('ultra_employees', JSON.stringify(mockEmployees));
    }

    if (storedPunches) setPunches(JSON.parse(storedPunches));
    else {
      setPunches(mockPunches);
      localStorage.setItem('ultra_punches', JSON.stringify(mockPunches));
    }

    if (storedSchedule) setSchedule(JSON.parse(storedSchedule));
    if (storedSpecialDays) setSpecialDays(JSON.parse(storedSpecialDays));
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ultra_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ultra_user');
  };

  const addPunch = (punch: PunchRecord) => {
    const updated = [punch, ...punches];
    setPunches(updated);
    localStorage.setItem('ultra_punches', JSON.stringify(updated));
  };

  const updateEmployees = (newEmployees: Employee[]) => {
    setEmployees(newEmployees);
    localStorage.setItem('ultra_employees', JSON.stringify(newEmployees));
  };

  const updateSchedule = (newSchedule: ScheduleConfig) => {
    setSchedule(newSchedule);
    localStorage.setItem('ultra_schedule', JSON.stringify(newSchedule));
  };

  const updateSpecialDays = (newDays: SpecialDay[]) => {
    setSpecialDays(newDays);
    localStorage.setItem('ultra_special_days', JSON.stringify(newDays));
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} employees={employees} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {user.role === 'ADMIN' ? (
        <AdminDashboard 
          user={user} 
          employees={employees} 
          punches={punches} 
          schedule={schedule}
          specialDays={specialDays}
          onLogout={handleLogout} 
          onUpdateEmployees={updateEmployees}
          onUpdateSchedule={updateSchedule}
          onUpdateSpecialDays={updateSpecialDays}
        />
      ) : (
        <EmployeeDashboard 
          user={user} 
          punches={punches.filter(p => p.employeeId === user.id)} 
          onLogout={handleLogout}
          onAddPunch={addPunch}
        />
      )}
    </div>
  );
};

export default App;
