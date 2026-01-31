import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Device } from '../../models/user.model';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-list.component.html',
  styleUrl: './device-list.component.less'
})
export class DeviceListComponent implements OnInit {
  devices = signal<Device[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevices();
  }

  loadDevices(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.userService.getDevices().subscribe({
      next: (devices) => {
        this.devices.set(devices);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Ошибка при загрузке устройств: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  selectDevice(deviceName: string): void {
    this.router.navigate(['/device', deviceName]);
  }

  formatDuration(duration: number): string {
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м ${seconds}с`;
    } else if (minutes > 0) {
      return `${minutes}м ${seconds}с`;
    } else {
      return `${seconds}с`;
    }
  }

  getTotalDuration(device: Device): number {
    return device.sessions.reduce((total, session) => total + session.duration, 0);
  }
}
