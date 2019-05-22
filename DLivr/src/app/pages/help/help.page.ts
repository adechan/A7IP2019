import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(
    private userService: ClientsService
  ) 
  { 
    if (!userService.loggedIn)
      this.userService.gotoLoginPage();
  }

  ngOnInit() {
  }

}
