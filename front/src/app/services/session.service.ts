import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { UserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private userService = inject(UserService);
  private readonly STORAGE_KEY_DEVICE_ID = 'device_monitoring_device_id';
  private readonly STORAGE_KEY_USER_NAME = 'device_monitoring_user_name';
  private sessionStartTime: Date | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.initializeDevice();
    this.setupBeforeUnload();
  }


  private initializeDevice(): void {
    if (!this.getDeviceId()) {
      const deviceId = this.generateDeviceId();
      localStorage.setItem(this.STORAGE_KEY_DEVICE_ID, deviceId);
    }

    if (!this.getUserName()) {
      const userName = this.getBrowserUserAgent();
      localStorage.setItem(this.STORAGE_KEY_USER_NAME, userName);
    }
  }


  private generateDeviceId(): string {
    return 'device-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }


  getDeviceId(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_DEVICE_ID);
  }


  getUserName(): string | null {
    return localStorage.getItem(this.STORAGE_KEY_USER_NAME);
  }


  setUserName(userName: string): void {
    if (userName && userName.trim().length > 0) {
      localStorage.setItem(this.STORAGE_KEY_USER_NAME, userName.trim());
    }
  }


  private getBrowserUserAgent(): string {
    const userAgent = navigator.userAgent;
    
    let browserName = 'Unknown Browser';
    if (userAgent.includes('Chrome')) browserName = 'Chrome';
    else if (userAgent.includes('Firefox')) browserName = 'Firefox';
    else if (userAgent.includes('Safari')) browserName = 'Safari';
    else if (userAgent.includes('Edge')) browserName = 'Edge';
    
    let osName = 'Unknown OS';
    if (userAgent.includes('Windows')) osName = 'Windows';
    else if (userAgent.includes('Mac')) osName = 'MacOS';
    else if (userAgent.includes('Linux')) osName = 'Linux';
    else if (userAgent.includes('Android')) osName = 'Android';
    else if (userAgent.includes('iOS')) osName = 'iOS';
    
    return `${browserName} on ${osName}`;
  }

  getBrowserVersion(): string {
    const userAgent = navigator.userAgent;
    
    // Chrome/Edge версия
    const chromeMatch = userAgent.match(/(?:Chrome|Edg)\/(\d+\.\d+\.\d+\.\d+|\d+\.\d+)/);
    if (chromeMatch) {
      return chromeMatch[1];
    }
    
    // Firefox версия
    const firefoxMatch = userAgent.match(/Firefox\/(\d+\.\d+)/);
    if (firefoxMatch) {
      return firefoxMatch[1];
    }
    
    // Safari версия
    const safariMatch = userAgent.match(/Version\/(\d+\.\d+)/);
    if (safariMatch && userAgent.includes('Safari')) {
      return safariMatch[1];
    }
    
    // Opera версия
    const operaMatch = userAgent.match(/OPR\/(\d+\.\d+)/);
    if (operaMatch) {
      return operaMatch[1];
    }
    
    // Если версию не удалось определить, возвращаем "Unknown"
    return 'Unknown';
  }


  startSession(): void {
    this.sessionStartTime = new Date();
    this.sessionId = this.generateDeviceId();
    
    console.log('Сессия начата:', {
      deviceId: this.getDeviceId(),
      userName: this.getUserName(),
      startTime: this.sessionStartTime,
      version: this.getBrowserVersion()
    });
  }


  endSession(): void {
    if (!this.sessionStartTime) {
      return;
    }

    const endTime = new Date();
    const userName = this.getUserName();

    if (!userName) {
      console.error('Не удалось получить данные устройства');
      this.sessionStartTime = null;
      this.sessionId = null;
      return;
    }

    const sessionData: UserRequest = {
      name: userName,
      startTime: this.sessionStartTime.toISOString(),
      endTime: endTime.toISOString(),
      version: this.getBrowserVersion()
    };


    this.saveSessionToLocalStorage(sessionData);


    try {
      this.userService.create(sessionData).subscribe({
        next: (id) => {
          console.log('Сессия сохранена на сервере:', id);

          this.removeSessionFromLocalStorage(sessionData);
        },
        error: (error) => {
          console.error('Ошибка при сохранении сессии:', error);

        }
      });
    } catch (error) {
      console.error('Ошибка при попытке отправки сессии:', error);
    }

    this.sessionStartTime = null;
    this.sessionId = null;
  }


  private saveSessionToLocalStorage(sessionData: UserRequest): void {
    const failedSessions = this.getFailedSessions();
    
    // Проверяем, нет ли уже такой сессии (по времени начала)
    const exists = failedSessions.some(s => s.startTime === sessionData.startTime);
    if (!exists) {
      failedSessions.push(sessionData);
      localStorage.setItem('device_monitoring_failed_sessions', JSON.stringify(failedSessions));
    }
  }


  private removeSessionFromLocalStorage(sessionData: UserRequest): void {
    const failedSessions = this.getFailedSessions();
    const filtered = failedSessions.filter(
      s => s.startTime !== sessionData.startTime || s.endTime !== sessionData.endTime
    );
    
    if (filtered.length !== failedSessions.length) {
      if (filtered.length > 0) {
        localStorage.setItem('device_monitoring_failed_sessions', JSON.stringify(filtered));
      } else {
        localStorage.removeItem('device_monitoring_failed_sessions');
      }
    }
  }


  private getFailedSessions(): UserRequest[] {
    const data = localStorage.getItem('device_monitoring_failed_sessions');
    return data ? JSON.parse(data) : [];
  }


  retryFailedSessions(): void {
    const failedSessions = this.getFailedSessions();
    if (failedSessions.length === 0) {
      return;
    }

    const remainingSessions: UserRequest[] = [];

    failedSessions.forEach((session) => {
      this.userService.create(session).subscribe({
        next: () => {
          console.log('Неудачная сессия успешно отправлена');
        },
        error: () => {
          remainingSessions.push(session);
        }
      });
    });

    if (remainingSessions.length > 0) {
      localStorage.setItem('device_monitoring_failed_sessions', JSON.stringify(remainingSessions));
    } else {
      localStorage.removeItem('device_monitoring_failed_sessions');
    }
  }


  private setupBeforeUnload(): void {

    window.addEventListener('beforeunload', () => {
      this.endSession();
    });


    window.addEventListener('pagehide', () => {
      this.endSession();
    });


    let hiddenTimeout: ReturnType<typeof setTimeout> | null = null;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {

        hiddenTimeout = setTimeout(() => {
          if (this.sessionStartTime) {
            this.endSession();
          }
        }, 5 * 60 * 1000); // 5 минут
      } else {

        if (hiddenTimeout) {
          clearTimeout(hiddenTimeout);
          hiddenTimeout = null;
        }
        if (!this.sessionStartTime) {
          this.startSession();
        }
      }
    });
  }


}
