import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: 'eventos.page.html',
  styleUrls: ['eventos.page.scss']
})
export class EventosPage {
    user = null;
  constructor(private auth: AuthService) {}

  ionViewWillEnter() {
    this.user = this.auth.getUser();
  }

}
