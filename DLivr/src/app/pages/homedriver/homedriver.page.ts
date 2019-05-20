import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ClientsService } from 'src/app/services/clients.service';
import { HttpClient } from '@angular/common/http';
import { debug } from 'util';
declare var google: any;

@Component({
  selector: 'app-homedriver',
  templateUrl: './homedriver.page.html',
  styleUrls: ['./homedriver.page.scss'],
})

export class HomedriverPage implements OnInit {

  packageArray: PackageFormal[] = [];

  index = 0;
  selectedPackage: PackageFormal;

  packageArr: any[];
  packages: any;
  @ViewChild('Map') mapElement: ElementRef;
  map: any;
    mapOptions: any;
    loc = {lat: null, lng: null};
    markerOptions: any = {position: null, map: null, title: null};
    marker: any;
    apiKey: any = 'AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo'; /*Your API Key*/

constructor(
  public zone: NgZone, 
  public geolocation: Geolocation,
  public userService: ClientsService,
  public http: HttpClient) {
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
         this.markerOptions.label = '1';
         this.marker = new google.maps.Marker(this.markerOptions);
    }, 0);

    userService.getPackagesInAreaOf('Iasi').subscribe (data => {
      this.packages = Object.values(data);

      /*my location*/

      const marker = new google.maps.Marker({
        position: this.loc,
        map: this.map,
        icon: {
          url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
      });

      this.packages.forEach(p => {
        const pack = new PackageFormal(
            p['height'],
            p['id'],
            p['kilograms'],
            p['length'],
            p['phoneNumberReceiver'],
            p['phoneNumberSender'],
            p['receiverAdress'],
            p['receiverName'],
            p['senderName'],
            p['senderAdress'],
            p['width']);
            this.geocodeAddPin(pack.senderAdress, pack);
            this.packageArray.push(pack);
            this.selectedPackage = pack;
            console.log(this.packageArr);

      });
      console.log(this.packageArray);
    });
  }

  public test(address: string){
   this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) +
   '&key=AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo').subscribe(data => {
    const res = data['results'];
    const zero = res[0];
    const geometry = zero['geometry'];
    const location = geometry['location'];

    console.log(location);
    });
  }

  public geocodeAddPin(address: string, packageForMe: PackageFormal){
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) +
    '&key=AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo').subscribe(data => {
     const res = data['results'];
     const zero = res[0];
     const geometry = zero['geometry'];
     const location = geometry['location'];

     console.log(location);
     this.loc = {lat: location['lat'], lng: location['lng']};
     const marker = new google.maps.Marker({
      position: this.loc,
      map: this.map,
      label: packageForMe.id.toString(),
    });

    marker.addListener('click', function() {
      this.map.setCenter(marker.getPosition());
      this.packageArray.forEach (  p => {
        if(p['id'] === Number.parseInt(marker.label, 2) ){
          this.selectedPackage = p;
          console.log('selected: ' + p);
        }
      });
    });
   });
  }

  public selectPackage(id: string){

    this.packages.forEach(p => {
      const pack = new PackageFormal(
          p['height'],
          p['id'],
          p['kilograms'],
          p['length'],
          p['phoneNumberReceiver'],
          p['phoneNumberSender'],
          p['receiverAdress'],
          p['receiverName'],
          p['senderName'],
          p['senderAdress'],
          p['width']);

          if( p['id'] === id ){
            this.selectedPackage = pack;
            console.log('selected: ' + p);
          }
    });
  }

  ngOnInit() {

  }
}

class PackageFormal {
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
    public width: number ) {}
}
