import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { DeviceSession } from '../../models/user.model';

@Component({
  selector: 'app-device-statistics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './device-statistics.component.html',
  styleUrl: './device-statistics.component.less'
})
export class DeviceStatisticsComponent implements OnInit {
  deviceName = signal<string>('');
  sessions = signal<DeviceSession[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    if (name) {
      this.deviceName.set(name);
      this.loadSessions(name);
    } else {
      this.error.set('Имя устройства не указано');
      this.loading.set(false);
    }
  }

  loadSessions(deviceName: string): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.userService.getDeviceSessions(deviceName).subscribe({
      next: (sessions) => {
        // Сортируем по времени начала (от новых к старым)
        sessions.sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        this.sessions.set(sessions);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Ошибка при загрузке статистики: ' + err.message);
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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

  getTotalDuration(): number {
    return this.sessions().reduce((total, session) => total + session.duration, 0);
  }

  getAverageDuration(): number {
    const sessions = this.sessions();
    if (sessions.length === 0) return 0;
    return this.getTotalDuration() / sessions.length;
  }
}
