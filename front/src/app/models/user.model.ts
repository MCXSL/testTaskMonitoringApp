export interface UserResponse {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  version: string;
}

export interface UserRequest {
  name: string;
  startTime: string;
  endTime: string;
  version: string;
}

export interface Device {
  id: string;
  name: string;
  sessions: DeviceSession[];
}

export interface DeviceSession {
  id: string;
  startTime: string;
  endTime: string;
  version: string;
  duration: number; // в миллисекундах
}
