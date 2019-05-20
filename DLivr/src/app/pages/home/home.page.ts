import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  notifications = [];

  constructor(private menuCtrl: MenuController, private userService : ClientsService) { }

  ngOnInit() {

    this.userService.getPackages()
    .subscribe((packages : Array<Package>) => 
    {
      console.log("We have " + packages.length + " packages");
      this.notifications = packages;
    }, error => {
      console.log("Can't get data about packages");
      console.log(error);
      this.userService.presentWarning("Atentie", "Nu aveti nicio notificare");
    });
  }

  openMenu() {
    this.menuCtrl.toggle();
  }

}
