import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { debug } from 'util';
import { ClientsService } from 'src/app/services/clients.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  name: String = '';
  
  clientPages = [
    {
      title: 'Home',
      url: '../menu/home',
      icon: 'home'
    },
    {
      title: 'My Packages',
      url: '../menu/mypackages',
      icon: 'cube'
    },
    {
      title: 'Settings',
      url: '../menu/settings',
      icon: 'settings'
    },
    {
      title: 'Payment',
      url: '../menu/payment',
      icon: 'card'
    },
    {
      title: 'Help',
      url: '../menu/help',
      icon: 'help-circle'
    },
  ];

  driverPages = [
    {
    title: 'Home',
    url: '../menu/homedriver',
    icon: 'home'
    },
    {
      title: 'My Packages',
      url: '../menu/mypackagesdriver',
      icon: 'cube'
    },
    {
      title: 'Settings',
      url: '../menu/settings',
      icon: 'settings'
    },
    {
      title: 'Payment',
      url: '../menu/payment',
      icon: 'card'
    },
    {
      title: 'Help',
      url: '../menu/help',
      icon: 'help-circle'
    },
  ];

  selectedPath = '';
  constructor(private router: Router, private userService: ClientsService) 
  {
    if (!userService.loggedIn)
      this.userService.gotoLoginPage();

    console.log(this.userService.editPackage);

    this.userService.router.events.subscribe((event: RouterEvent) => 
    {
      if (event.url)
      {
        console.log("click: " + event.url);
        this.selectedPath = event.url;
      }
    });

    this.userService.getProfileInfoSender()
    .subscribe(data => {
      console.log("Profile info:");
      this.name = data['name'];
      console.log(JSON.stringify(data));

    }, error => {
      console.log("Can't get the name.");
      console.log(error);
    });
   }

  changeUserType() 
  {
    if (this.userService.userType === 'client') 
    {
      this.userService.changeToDriver();
      this.userService.router.navigate(['app/menu/homedriver']);
    }
    else 
    {
      this.userService.changeToClient();
      this.userService.router.navigate(['app/menu/home']);
    }
  }

  logout()
  {
    this.userService.logout();
  }
}
