// Modèle pour Notifications et Alertes
export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'critical';
  timestamp: Date;
  lue: boolean;
  actionUrl?: string;
  iconClass?: string;
}

// Modèle pour KPIs
export interface KPI {
  id: string;
  nom: string;
  valeur: number;
  valeurPrecedente: number;
  unite: string;
  evolution: number; // en %
  seuil?: number;
  couleur: string;
  icone: string;
}

// Modèle pour Tendances
export interface Tendance {
  periode: string;
  valeur: number;
  valeurPrecedente: number;
  evolution: number; // en %
  statut: 'hausse' | 'baisse' | 'stable';
  demandes?: number;
  trajets?: number;
  distance?: number;
  couts?: number;
}

// Modèle pour Données Graphique
export interface DonneeGraphique {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string;
  tension?: number;
}

// Modèle pour Chauffeur Performance
export interface ChauffeurPerformance {
  id: string;
  nom: string;
  immatriculation: string;
  trajets: number;
  evaluation: number; // 0-5
  tempsTrajetMoyen: number; // minutes
  satisfactionClients: number; // %
  incidents: number;
  carburantCout: number;
  rangement: number;
}

// Modèle pour Coûts Financiers
export interface CoutsFinanciers {
  carburant: number;
  maintenance: number;
  salaires: number;
  assurance: number;
  autre: number;
  total: number;
  mois: string;
}

// Modèle pour ROI Véhicule
export interface ROIVehicule {
  id: string;
  immatriculation: string;
  typeVehicule: string;
  revenus: number;
  couts: number;
  profit: number;
  rentabilite: number; // %
  tempsUtilisation: number; // heures
  kilometrage?: number; // km
  status: 'excellent' | 'bon' | 'moyen' | 'faible';
}

// Modèle pour Historique Position
export interface HistoriquePosition {
  vehiculeId: string;
  immatriculation: string;
  positions: Array<{
    lat: number;
    lng: number;
    timestamp: Date;
    vitesse: number;
    adresse: string;
  }>;
  dateDebut: Date;
  dateFin: Date;
  distanceTotale: number;
}

// Modèle pour Planning Chauffeur
export interface PlanningChauffeur {
  id: string;
  nom: string;
  date: Date;
  debut: string;
  fin: string;
  statut: 'disponible' | 'en-cours' | 'conge' | 'maladie' | 'absent';
  trajetsAssignes: number;
  notes?: string;
}

// Modèle pour Rapport
export interface Rapport {
  id: string;
  titre: string;
  type: 'quotidien' | 'hebdomadaire' | 'mensuel';
  dateGeneration: Date;
  donnees: any;
}

// Modèle pour Preferences Utilisateur
export interface PreferencesUtilisateur {
  themeSombre: boolean;
  widgetsFavoris: string[];
  notificationsActivees: boolean;
  emailRapports: boolean;
  auto_refresh: boolean;
  refreshInterval: number; // secondes
}

// Modèle pour Anomalie Détectée
export interface Anomalie {
  id: string;
  type: 'vitesse' | 'carburant' | 'hors-zone' | 'temps-absent' | 'autre';
  titre: string;
  description: string;
  severite: 'basse' | 'moyenne' | 'haute' | 'critique';
  timestamp: Date;
  vehicule?: string;
  chauffeur?: string;
  regle?: string;
}
