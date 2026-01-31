import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserResponse, UserRequest, Device, DeviceSession } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/User'; // Прокси в dev ведёт на API (см. proxy.conf.json)

  getAll(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(this.apiUrl);
  }

  create(user: UserRequest): Observable<string> {
    return this.http.post<string>(this.apiUrl, user);
  }

  update(id: string, user: UserRequest): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, user);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`);
  }

  getDevices(): Observable<Device[]> {
    return this.getAll().pipe(
      map(users => {
        const deviceMap = new Map<string, Device>();
        
        users.forEach(user => {
          if (!deviceMap.has(user.name)) {
            deviceMap.set(user.name, {
              id: user.id,
              name: user.name,
              sessions: []
            });
          }
          
          const device = deviceMap.get(user.name)!;
          const startTime = new Date(user.startTime);
          const endTime = new Date(user.endTime);
          const duration = endTime.getTime() - startTime.getTime();
          
          device.sessions.push({
            id: user.id,
            startTime: user.startTime,
            endTime: user.endTime,
            version: user.version,
            duration: duration
          });
        });
        
        return Array.from(deviceMap.values());
      })
    );
  }

  getDeviceSessions(deviceName: string): Observable<DeviceSession[]> {
    return this.getAll().pipe(
      map(users => {
        return users
          .filter(user => user.name === deviceName)
          .map(user => {
            const startTime = new Date(user.startTime);
            const endTime = new Date(user.endTime);
            const duration = endTime.getTime() - startTime.getTime();
            
            return {
              id: user.id,
              startTime: user.startTime,
              endTime: user.endTime,
              version: user.version,
              duration: duration
            };
          });
      })
    );
  }
}
