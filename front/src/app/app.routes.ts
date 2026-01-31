import { Routes } from '@angular/router';
import { DeviceListComponent } from './components/device-list/device-list.component';
import { DeviceStatisticsComponent } from './components/device-statistics/device-statistics.component';

export const routes: Routes = [
  {
    path: '',
    component: DeviceListComponent
  },
  {
    path: 'device/:name',
    component: DeviceStatisticsComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
