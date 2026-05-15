import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { DashboardSidebar } from '../dashboard-sidebar/dashboard-sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [DashboardSidebar, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {}
