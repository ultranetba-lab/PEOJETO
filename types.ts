
export type Role = 'ADMIN' | 'EMPLOYEE';

export interface Employee {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for security, but needed for this mock
  workHoursPerDay: number;
  registrationNumber: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PunchRecord {
  id: string;
  employeeId: string;
  timestamp: string; // ISO string
  type: 'IN' | 'OUT' | 'LUNCH_START' | 'LUNCH_END' | 'HOLIDAY' | 'DAY_OFF';
  photo?: string; // base64 - optional for manual entries
  location?: Location; // optional for manual entries
  isManual?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface SpecialDay {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  type: 'HOLIDAY' | 'DAY_OFF';
}

export interface ScheduleConfig {
  weekdayIn: string; // 08:00
  weekdayLunchStart: string; // 12:00
  weekdayLunchEnd: string; // 13:00
  weekdayOut: string; // 17:00
  saturdayIn: string; // 08:00
  saturdayOut: string; // 12:00
}
