// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APP_NAME: '',
  APP_DESCRIPTION: '',
  TEXT_NAME_LOADING: 'PARC ...',
  BASE_URL: 'http://localhost:8000/api/',
  paginationNbItemsPerPage: 10,
  MESSAGE_ERREUR_INTERNE: 'Une erreur interne est survenue',
  TIME_OUT_ERREUR_MESSAGE: 30000,
  STATUT_DEMANDE_COURSE_CREEE: 'CREEE',
  STATUT_DEMANDE_COURSE_AFFECTEE: 'AFFECTEE',
  STATUT_DEMANDE_COURSE_DEMARREE: 'DEMARREE',
  STATUT_DEMANDE_COURSE_TERMINEE: 'TERMINEE',
  DISPONIBILITE_VEHICULE:[{'id':'DISPONIBLE', 'libelle':'DISPONIBLE'}, {'id':'PANNE', 'libelle':'PANNE'}, {'id':'COURSE', 'libelle':'COURSE'}],
  DISPONIBILITE_CHAUFFEUR:[{'id':'DISPONIBLE', 'libelle':'DISPONIBLE'}, {'id':'CONGE', 'libelle':'CONGE'}, {'id':'COURSE', 'libelle':'COURSE'}, {'id':'REPOS', 'libelle':'REPOS'}, {'id':'ABSENT', 'libelle': 'ABSENT'}],
  STATUT_CRITERE_ACTIF: "ACTIF",
  STATUT_CRITERE_INACTIF: "INACTIF",
  ROLE_ADMIN: "ADMIN",
  ROLE_AGENT: "AGENT",
  SECOND_TIME_LOGOUT: 60 * 10 // 10 minutes
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
