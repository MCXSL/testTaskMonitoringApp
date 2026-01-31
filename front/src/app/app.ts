import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SessionService } from './services/session.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('device-monitoring-frontend');
  private sessionService = inject(SessionService);

  ngOnInit(): void {
    // Начало сессии при загрузке приложения
    this.sessionService.startSession();
    
    // Попытка повторной отправки неудачных сессий
    this.sessionService.retryFailedSessions();
  }

  ngOnDestroy(): void {
    // Завершение сессии при уничтожении компонента
    this.sessionService.endSession();
  }
}
