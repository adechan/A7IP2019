import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ClientsService } from 'src/app/services/clients.service';
import { HttpClient } from '@angular/common/http';
declare var google: any;

class Package 
{
  constructor(
    public height: number,
    public id: number,
    public kilograms: number,
    public length: number,
    public phoneNumberReceiver: string,
    public phoneNumberSender: string,
    public receiverAdress: string,
    public receiverName: string,
    public senderName: string,
    public senderAdress:  string,
    public width: number) {}
}

@Component({
  selector: 'app-homedriver',
  templateUrl: './homedriver.page.html',
  styleUrls: ['./homedriver.page.scss'],
})

export class HomedriverPage implements OnInit {

  index = 0;

  packages: Array<Package> = [];
  selectedPackage: Package = null;

  // Map
  @ViewChild('Map') mapElement: ElementRef;
  map: any;
  mapOptions: any;
  loc = {lat: null, lng: null};
  markerOptions: any = {position: null, map: null, title: null};
  marker: any;

  constructor(
    public zone: NgZone, 
    public geolocation: Geolocation,
    public userService: ClientsService,
    public http: HttpClient)
  {
    if (!userService.loggedIn)
      this.userService.gotoLoginPage();

    this.selectedPackage = new Package(0, 0, 0, 0, '', '', '', '', '', '', 0);

    /*Get Current location*/
    this.geolocation.getCurrentPosition().then((position) =>  {
        this.loc.lat = position.coords.latitude;
        this.loc.lng = position.coords.longitude;
    });

    /*Map options*/
    this.mapOptions = {
      center: this.loc,
      zoom: 15,
      mapTypeControl: false
    };

    setTimeout(() => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);

      /*Marker Options*/
      this.markerOptions.position = this.loc;
      this.markerOptions.map = this.map;
      this.markerOptions.title = 'My Location';
      this.markerOptions.label = 'Me';
      // this.marker = new google.maps.Marker(this.markerOptions);
    }, 3000);

    userService.getPackagesInAreaOf('Iasi')
    .subscribe ((nearbyPackages : Array<Package>) => 
    {
      nearbyPackages.forEach((pack : Package) => 
      {
        this.packages.push(pack);
      });

      nearbyPackages.forEach((pack : Package) => 
      {
          // pack['emailSender'] = 'hey';
          this.geocodeAddPin(pack['senderAdress'], pack);
      });

      /*my location*/
      const marker = new google.maps.Marker({
        position: this.loc,
        map: this.map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });
    });
  }

  public geocodeAddPin(address: string, packageToGeolocate: Package)
  {
    this.http.get(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) +
      '&key=' + this.userService.apiKey
    )
    .subscribe(data => 
    {
      console.log(JSON.stringify(data));
      
      const res = data['results'];
      const zero = res[0];
      const geometry = zero['geometry'];
      const location = geometry['location'];

      console.log(location);

      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        label: packageToGeolocate.id.toString(),
      });

      marker.addListener('click', () =>
      {
        this.map.setCenter(marker.getPosition());
        this.selectedPackage = packageToGeolocate;
        console.log('selected: ' + packageToGeolocate.id);
        console.log(JSON.stringify(packageToGeolocate));
      });
    });
  }

  ngOnInit() {

  }
}