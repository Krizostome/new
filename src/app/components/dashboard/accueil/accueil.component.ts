import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService, DashboardStats } from '../../../services/dashboard.service';
import { KPI, Tendance, ChauffeurPerformance, CoutsFinanciers, ROIVehicule, Anomalie, Notification, PreferencesUtilisateur } from '../../../models/dashboard-extended';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, OnDestroy {

  // Stats de base
  dashboardStats: DashboardStats = {
    totalVehicules: 0,
    vehiculesDisponibles: 0,
    chauffeurs: 0,
    utilisateursActifs: 0,
    demandesEnCours: 0,
    vehiculesEnMaintenance: 0,
    chauffeursActifs: 0,
    demandesApprouveesJour: 0,
    rendezvousProgrammes: 0,
    etatVehicules: [],
    typeVehicules: [],
    tauxUtilisation: 0,
    alertesCritiques: [],
    activitesRecentes: [],
    tachesUrgentes: [],
    derniersTrajets: [],
    sante: 'ok',
    planningChauffeurs: []
  };

  isLoading = false;
  selectedDateFrom: string = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0];
  selectedDateTo: string = new Date().toISOString().split('T')[0];
  searchQuery: string = '';
  

  // Éléments prioritaires
  kpis: KPI[] = [];
  tendances: Tendance[] = [];
  chauffeursPerformance: ChauffeurPerformance[] = [];
  coutsFinanciers: CoutsFinanciers | null = null;
  roiVehicules: ROIVehicule[] = [];
  anomalies: Anomalie[] = [];
  notifications: Notification[] = [];
  notificationsNonLues = 0;
  preferences: PreferencesUtilisateur | null = null;
  afficherNotifications = false;
  afficherPreferences = false;

  // Current user
  currentUser: any = { nom: 'Administrateur' };

  // Vehicles dashboard
  vehiculesDashboard: any[] = [];

  // Chart data
  demandesParJour: { labels: string[]; data: number[] } = { labels: [], data: [] };
  demandesAssignesParJour: { labels: string[]; data: number[] } = { labels: [], data: [] };
  demandesTermineesParJour: { labels: string[]; data: number[] } = { labels: [], data: [] };

  // Tables data
  derniersDemandes: any[] = [];
  demandesEnCoursListe: any[] = [];
  demandesTermineesListe: any[] = [];

  // Auto-refresh
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ===== DASHBOARD STATS =====
  loadDashboardStats(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.kpis = stats.kpis || [];
        this.derniersDemandes = stats.derniersDemandes || [];
        this.demandesEnCoursListe = stats.demandesEnCoursListe || [];
        this.demandesTermineesListe = stats.demandesTermineesListe || [];
        this.demandesParJour = stats.demandesParJour || { labels: [], data: [] };
        this.demandesAssignesParJour = stats.demandesAssignesParJour || { labels: [], data: [] };
        this.demandesTermineesParJour = stats.demandesTermineesParJour || { labels: [], data: [] };
        this.isLoading = false;
        setTimeout(() => this.initChart(), 0);
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques:', error);
        this.isLoading = false;
      }
    });
  }

  refreshStats(): void {
    this.dashboardService.refreshStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.kpis = stats.kpis || [];
        this.tendances = stats.tendances || [];
      },
      error: (error) => {
        console.error('Erreur lors du rafraîchissement:', error);
      }
    });
  }

  setupAutoRefresh(): void {
    if (this.preferences?.auto_refresh) {
      interval(this.preferences.refreshInterval * 1000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.refreshStats());
    }
  }

  

 
  appliquerTheme(): void {
    if (this.preferences?.themeSombre) {
      document.body.classList.add('theme-sombre');
    } else {
      document.body.classList.remove('theme-sombre');
    }
  }

 /*
  // ===== EXPORTS =====
  exporterEnPDF(): void {
    const donnees = {
      stats: this.dashboardStats,
      kpis: this.kpis,
      tendances: this.tendances
    };
    this.exportService.exportEnPDF(donnees, 'Dashboard');
  }

  exporterEnExcel(): void {
    const donnees = this.chauffeursPerformance.map(c => ({
      nom: c.nom,
      trajets: c.trajets,
      evaluation: c.evaluation,
      tempsTrajetMoyen: c.tempsTrajetMoyen,
      satisfaction: c.satisfactionClients,
      incidents: c.incidents
    }));
    this.exportService.exportEnExcel(donnees, 'Performance_Chauffeurs');
  }
*/


  // ===== CALCULS & AFFICHAGE =====
  getHealthStatusClass(): string {
    return `health-${this.dashboardStats.sante}`;
  }

  getHealthStatusText(): string {
    const texts: { [key: string]: string } = {
      'ok': 'Système opérationnel',
      'warning': 'Attention requise',
      'critique': 'Problème critique'
    };
    return texts[this.dashboardStats.sante] || 'Inconnu';
  }

  getHealthStatusColor(): string {
    const colors: { [key: string]: string } = {
      'ok': '#1cc88a',
      'warning': '#f6c23e',
      'critique': '#e74a3b'
    };
    return colors[this.dashboardStats.sante] || '#858796';
  }

  getSeverityClass(severite: string): string {
    return `severity-${severite}`;
  }

  getPriorityClass(priorite: string): string {
    return `priority-${priorite}`;
  }

  obtenirCouleurEvolution(evolution: number): string {
    return evolution >= 0 ? '#1cc88a' : '#e74a3b';
  }

  obtenirIconeEvolution(evolution: number): string {
    return evolution >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  obtenirRangClassChauffeur(index: number): string {
    return `rang-${index + 1}`;
  }

  obtenirCouleurROI(rentabilite: number): string {
    if (rentabilite >= 55) return '#1cc88a';
    if (rentabilite >= 45) return '#f6c23e';
    return '#e74a3b';
  }

  applyDateFilter(): void {
    console.log('Filtre appliqué du', this.selectedDateFrom, 'au', this.selectedDateTo);
    this.loadDashboardStats();
  }

  search(): void {
    console.log('Recherche:', this.searchQuery);
  }

 

  initChart() {
    const canvas = document.getElementById('demandesChart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.demandesParJour.labels,
        datasets: [
          {
            label: 'Total demandes',
            data: this.demandesParJour.data,
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            tension: 0.1
          },
          {
            label: 'Demandes affectées',
            data: this.demandesAssignesParJour.data,
            borderColor: '#f6c23e',
            backgroundColor: 'rgba(246, 194, 62, 0.1)',
            tension: 0.1
          },
          {
            label: 'Demandes terminées',
            data: this.demandesTermineesParJour.data,
            borderColor: '#1cc88a',
            backgroundColor: 'rgba(28, 200, 138, 0.1)',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Demandes par jour' }
        }
      }
    });
  }


}
