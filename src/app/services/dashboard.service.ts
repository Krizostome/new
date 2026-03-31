import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { KPI, Tendance, ChauffeurPerformance, CoutsFinanciers, ROIVehicule, HistoriquePosition, PlanningChauffeur, Anomalie } from '../models/dashboard-extended';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

export interface DashboardStats {
  totalVehicules: number;
  vehiculesDisponibles: number;
  chauffeurs: number;
  utilisateursActifs: number;
  demandesEnCours: number;
  vehiculesEnMaintenance: number;
  chauffeursActifs: number;
  demandesApprouveesJour: number;
  rendezvousProgrammes: number;
  etatVehicules: { label: string; value: number; color: string }[]; 
  typeVehicules: { type: string; count: number }[];
  tauxUtilisation: number;
  alertesCritiques: { id: string; titre: string; message: string; severite: 'critique' | 'warning' | 'info' }[];
  activitesRecentes: { date: string; action: string; utilisateur: string }[];
  tachesUrgentes: { id: string; titre: string; deadline: string; priorite: 'haute' | 'moyenne' | 'basse' }[];
  derniersTrajets: { id: string; chauffeur: string; vehicule: string; heure: string; destination: string }[];
  sante: 'ok' | 'warning' | 'critique';
  // Nouveaux champs
  kpis?: KPI[];
  tendances?: Tendance[];
  chauffeursPerformance?: ChauffeurPerformance[];
  coutsFinanciers?: CoutsFinanciers;
  roiVehicules?: ROIVehicule[];
  planningChauffeurs?: PlanningChauffeur[];
  anomalies?: Anomalie[];
  demandesParJour?: { labels: string[]; data: number[] };
  demandesAssignesParJour?: { labels: string[]; data: number[] };
  demandesTermineesParJour?: { labels: string[]; data: number[] };
  derniersDemandes?: { id: string; date: string; client: string; depart: string; destination: string; statut: string }[];
  demandesEnCoursListe?: { id: string; date: string; client: string; depart: string; destination: string; chauffeur?: string }[];
  demandesTermineesListe?: { id: string; date: string; client: string; depart: string; destination: string; chauffeur: string; note?: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

 
 getDashboardStats(): Observable<DashboardStats> {
  return this.infoReseveApiBackend().pipe(
    map((data: any) => {
      return {
        totalVehicules: data.total_vehicules || 0,
        vehiculesDisponibles: data.vehicules_disponibles || 0,
        chauffeurs: data.total_chauffeurs || 0,
        chauffeursActifs: data.chauffeurs_actifs || 0,
        utilisateursActifs: data.total_utilisateurs || 0,
        demandesEnCours: data.total_demandes || 0,
        vehiculesEnMaintenance: data.vehicules_maintenance || 0,
        demandesApprouveesJour: data.demandes_approuvees_jour || 0,
        rendezvousProgrammes: data.rendez_vous_programmes || 0,
        etatVehicules: data.etat_vehicules || [],
        typeVehicules: data.type_vehicules || [],
        tauxUtilisation: data.taux_utilisation || 0,
        alertesCritiques: data.alertes_critiques || [],
        activitesRecentes: data.activites_recentes || [],
        tachesUrgentes: data.taches_urgentes || [],
        derniersTrajets: data.derniers_trajets || [],
        sante: data.sante || 'ok',
        demandesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [12, 19, 3, 5, 2, 3, 9] }, 
        demandesAssignesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [8, 15, 2, 4, 1, 2, 6] }, 
        demandesTermineesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [6, 12, 1, 3, 1, 1, 4] },
        derniersDemandes: data.dernieres_demandes,
        demandesEnCoursListe: [ { id: 'D006', date: '17/03/2026 11:00', client: 'Client F', depart: 'Hôpital', destination: 'Pharmacie', chauffeur: 'Ahmed Mohamed' }, { id: 'D007', date: '17/03/2026 10:45', client: 'Client G', depart: 'Banque', destination: 'Supermarché', chauffeur: 'Fatima Benali' } ],
        demandesTermineesListe: [ { id: 'D008', date: '17/03/2026 09:00', client: 'Client H', depart: 'Stade', destination: 'Maison', chauffeur: 'Mohamed Saïd', note: 4.5 }, { id: 'D009', date: '17/03/2026 08:15', client: 'Client I', depart: 'Cinéma', destination: 'Café', chauffeur: 'Hassan Ali', note: 5.0 } ],
       };
     })
   );
 }

infoReseveApiBackend(): Observable<any> {
    return this.http.get(environment.BASE_URL + "dashboard/stats", {});
}

// Méthode pour rafraîchir les statistiques
refreshStats(): Observable<DashboardStats> {
  const randomVariation = () => Math.floor(Math.random() * 10) - 5;
  return this.infoReseveApiBackend().pipe(
    map((data: any) => {
      return {
        totalVehicules: data.total_vehicules || 0,
        vehiculesDisponibles: data.vehicules_disponibles || 0,
        chauffeurs: data.total_chauffeurs || 0,
        chauffeursActifs: data.chauffeurs_actifs || 0,
        utilisateursActifs: data.total_utilisateurs || 0,
        demandesEnCours: data.total_demandes || 0,
        vehiculesEnMaintenance: data.vehicules_maintenance || 0,
        demandesApprouveesJour: data.demandes_approuvees_jour || 0,
        rendezvousProgrammes: data.rendez_vous_programmes || 0,
        etatVehicules: data.etat_vehicules || [],
        typeVehicules: data.type_vehicules || [],
        tauxUtilisation: data.taux_utilisation || 0,
        alertesCritiques: data.alertes_critiques || [],
        activitesRecentes: data.activites_recentes || [],
        tachesUrgentes: data.taches_urgentes || [],
        derniersTrajets: data.derniers_trajets || [],
        sante: data.sante || 'ok',
        demandesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [12, 19, 3, 5, 2, 3, 9] }, 
        demandesAssignesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [8, 15, 2, 4, 1, 2, 6] }, 
        demandesTermineesParJour: { labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'], data: [6, 12, 1, 3, 1, 1, 4] },
        derniersDemandes: data.dernieres_demandes,
        demandesEnCoursListe: [ { id: 'D006', date: '17/03/2026 11:00', client: 'Client F', depart: 'Hôpital', destination: 'Pharmacie', chauffeur: 'Ahmed Mohamed' }, { id: 'D007', date: '17/03/2026 10:45', client: 'Client G', depart: 'Banque', destination: 'Supermarché', chauffeur: 'Fatima Benali' } ],
        demandesTermineesListe: [ { id: 'D008', date: '17/03/2026 09:00', client: 'Client H', depart: 'Stade', destination: 'Maison', chauffeur: 'Mohamed Saïd', note: 4.5 }, { id: 'D009', date: '17/03/2026 08:15', client: 'Client I', depart: 'Cinéma', destination: 'Café', chauffeur: 'Hassan Ali', note: 5.0 } ],
       };
       
    })
  );
 }


}

