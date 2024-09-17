import {User} from "./user";

export class JournalSms {
  id: number = 0;
  contact: string='';
  contenu: string='';
  status_envoi: string='';
  date_envoi: string='';
  user_id: string='';
  user: User = new User();
}
