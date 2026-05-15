import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Alert } from '../../../../domain/model/alert.entity';

@Component({
  selector: 'app-recent-alerts-widget',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './recent-alerts-widget.component.html',
  styleUrls: ['./recent-alerts-widget.component.css'],
})
export class RecentAlertsWidgetComponent implements OnInit {
  // En la implementación real esto se obtiene desde un servicio
  alerts: Alert[] = [];
  displayedColumns: string[] = ['type', 'plot', 'severity', 'date', 'status'];

  constructor() {}

  ngOnInit(): void {
    // Data de ejemplo básica para mostrar en la tabla.
    this.alerts = [
      new Alert(1, 'Phenological risk', 'Riesgo detectado', 'High', '2026-05-04', 'Active', {
        name: 'Lote Norte',
        location: 'Sector 1',
        hectares: 20,
      }),
      new Alert(
        2,
        'Low NDVI zone',
        'Zona bajo el promedio',
        'Medium',
        '2026-05-02',
        'Under Review',
        { name: 'Lote Sur', location: 'Sector 2', hectares: 15 },
      ),
    ];
  }

  getAlertIcon(type: string): string {
    if (type === 'Phenological risk') return 'cloud';
    if (type === 'Pest symptom report') return 'warning';
    if (type === 'Low NDVI zone') return 'map';
    return 'notifications'; // Icono por defecto de Material
  }

  getSeverityStyle(severity: string) {
    if (severity === 'Critical')
      return {
        backgroundColor: '#E53535',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
      };
    if (severity === 'High')
      return {
        backgroundColor: '#FF5C5C',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
      };
    if (severity === 'Medium')
      return {
        backgroundColor: '#C15A2E',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
      };
    return { backgroundColor: '#9CA3AF', color: 'white', padding: '4px 8px', borderRadius: '4px' };
  }

  getStatusStyle(status: string) {
    const s = status?.toLowerCase();
    if (s === 'active')
      return {
        backgroundColor: 'rgba(87, 235, 161, 0.2)',
        color: '#2E4A3A',
        padding: '4px 8px',
        borderRadius: '12px',
      };
    if (s === 'suggest')
      return {
        backgroundColor: 'rgba(91, 141, 239, 0.2)',
        color: '#5B8DEF',
        padding: '4px 8px',
        borderRadius: '12px',
      };
    if (s === 'under review')
      return {
        backgroundColor: 'rgba(193, 90, 46, 0.2)',
        color: '#C15A2E',
        padding: '4px 8px',
        borderRadius: '12px',
      };
    return {
      backgroundColor: '#F3F4F6',
      color: '#6B7280',
      padding: '4px 8px',
      borderRadius: '12px',
    };
  }
}
