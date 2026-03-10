import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

  /* ─── KPI : remplacer par appels API Laravel ─── */
  // Exemple : this.statsService.getDashboard().subscribe(data => { this.kpiTotal = data.total; })

  /* ─── VÉHICULES ─── */
  vehicles = [
    { plate: 'AB-512-CD', model: 'Toyota Hilux 2023',    driver: 'M. Diallo',  status: 'EN ROUTE',   statusClass: 'status-badge status-active' },
    { plate: 'GH-234-EF', model: 'Renault Kangoo 2022',  driver: 'S. Koné',    status: 'EN ROUTE',   statusClass: 'status-badge status-active' },
    { plate: 'IJ-890-KL', model: 'Peugeot Partner 2021', driver: '',            status: 'DISPONIBLE', statusClass: 'status-badge status-idle' },
    { plate: 'MN-101-OP', model: 'Ford Transit 2023',    driver: 'A. Traoré',  status: 'MAINT.',     statusClass: 'status-badge status-maintenance' },
    { plate: 'QR-321-ST', model: 'Mitsubishi L200 2022', driver: 'B. Oumar',   status: 'EN ROUTE',   statusClass: 'status-badge status-active' },
  ];

  /* ─── MISSIONS ─── */
  missions = [
    {
      id: 'MS-2025-089',
      from: 'Abidjan Centre', to: 'Yamoussoukro',
      vehicle: 'AB-512-CD', driver: 'M. Diallo', date: '10 juin 2025',
      status: 'ongoing', statusLabel: 'EN COURS', progress: 62
    },
    {
      id: 'MS-2025-090',
      from: 'Bouaké Dépôt', to: 'San Pedro Port',
      vehicle: 'GH-234-EF', driver: 'S. Koné', date: '10 juin 2025',
      status: 'ongoing', statusLabel: 'EN COURS', progress: 28
    },
    {
      id: 'MS-2025-091',
      from: 'Abidjan Sud', to: 'Grand-Bassam',
      vehicle: 'QR-321-ST', driver: 'B. Oumar', date: '11 juin 2025',
      status: 'pending', statusLabel: 'EN ATTENTE', progress: 0
    },
  ];

  /* ─── MAINTENANCES ─── */
  maintenances = [
    { day: '12', month: 'Juin', vehicle: 'MN-101-OP — Ford Transit',     type: 'Vidange + Filtre à huile',     urgency: 'high',   urgencyLabel: '🔴 Urgent'   },
    { day: '18', month: 'Juin', vehicle: 'IJ-890-KL — Peugeot Partner',  type: 'Contrôle technique annuel',    urgency: 'medium', urgencyLabel: '🟡 Planifié' },
    { day: '25', month: 'Juin', vehicle: 'AB-512-CD — Toyota Hilux',      type: 'Rotation pneus',               urgency: 'low',    urgencyLabel: '🟢 Normal'   },
  ];

  /* ─── ACTIONS RAPIDES ─── */
  quickActions = [
    { emoji: '➕', label: 'Ajouter Véhicule',       bg: 'rgba(73,116,165,.12)' },
    { emoji: '👤', label: 'Nouveau Conducteur',      bg: 'rgba(0,151,199,.12)' },
    { emoji: '🗺️', label: 'Créer Mission',           bg: 'rgba(0,184,135,.12)' },
    { emoji: '🔧', label: 'Planifier Maintenance',   bg: 'rgba(124,92,191,.12)' },
    { emoji: '📊', label: 'Générer Rapport',         bg: 'rgba(224,123,0,.12)' },
    { emoji: '⛽', label: 'Saisir Carburant',        bg: 'rgba(217,64,64,.12)' },
  ];

  ngOnInit(): void {
    /**
     * TODO : Brancher vos services Angular → API Laravel ici
     *
     * Exemples :
     *   this.vehicleService.getAll().subscribe(v => this.vehicles = v);
     *   this.missionService.getActive().subscribe(m => this.missions = m);
     *   this.maintenanceService.getPlanned().subscribe(m => this.maintenances = m);
     *
     * Pensez à injecter ces services dans le constructeur :
     *   constructor(
     *     private vehicleService: VehicleService,
     *     private missionService: MissionService,
     *     private maintenanceService: MaintenanceService
     *   ) {}
     */
  }
}