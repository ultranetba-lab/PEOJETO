
import { Employee, PunchRecord } from './types';

export const mockEmployees: Employee[] = [
  { id: '1', name: 'Administrador UltraNET', email: 'admin@ultranet.com', workHoursPerDay: 8, registrationNumber: 'ADM001', password: 'admin' },
  { id: '2', name: 'Carlos Silva', email: 'carlos@ultranet.com', workHoursPerDay: 8, registrationNumber: 'EMP002', password: '123' },
  { id: '3', name: 'Mariana Oliveira', email: 'mariana@ultranet.com', workHoursPerDay: 8, registrationNumber: 'EMP003', password: '123' },
];

export const mockPunches: PunchRecord[] = [];

export const COLORS = {
  primary: '#2563eb', // Blue 600
  secondary: '#64748b', // Slate 500
  accent: '#f97316', // Orange 500
  success: '#10b981', // Emerald 500
  danger: '#ef4444', // Red 500
};
