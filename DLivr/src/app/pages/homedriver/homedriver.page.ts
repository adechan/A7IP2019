import { Component, OnInit } from '@angular/core';
import { ElementRef, NgZone, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ClientsService } from 'src/app/services/clients.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
declare const google: any;

class Package {
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
    public width: number,
    public distance: string,
    public price: string
    ) {}
}

@Component({
  selector: 'app-homedriver',
  templateUrl: './homedriver.page.html',
  styleUrls: ['./homedriver.page.scss'],
})


export class HomedriverPage implements OnInit {

  packageArray: Package[] = [];
  index = 0;
  packages: Array<Package> = [];
  selectedPackage: Package = null;
  loading: any;
  tileListener: any;
  image = {
    url: './assets/icon/package.png',
    size: {
      width: 30,
      height: 30
    }
  };
  // Map
  @ViewChild('Map') mapElement: ElementRef;
  map: any;
  mapCenter: any;
  mapOptions: any;
  loc = {lat: null, lng: null};
  markerOptions: any = {position: null, map: null, title: null};
  marker: any;
  destinationMarker: any;
  myLocation: string;
  apiKey: any = 'AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo';


  ngOnInit() { }

  constructor(
    public loadingController: LoadingController,
    public zone: NgZone,
    public geolocation: Geolocation,
    public userService: ClientsService,
    public http: HttpClient) {

      /*Load google map script dynamically */
     /* const script = document.createElement('script');
      script.id = 'googleMap';
      if (this.apiKey) {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo' + this.apiKey;
      } else {
          script.src = 'https://maps.googleapis.com/maps/api/js?key=';
      }
      document.head.appendChild(script);
*/

      /*Get Current location*/
      this.geolocation.getCurrentPosition().then((position) =>  {
          this.loc.lat = position.coords.latitude;
          this.loc.lng = position.coords.longitude;
          
      });

      /*Map options*/
      this.mapOptions = {
        center: this.loc,
        zoom: 14,
        mapTypeControl: false
      };


      setTimeout(() => {
        this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
        this.tileListener = google.maps.event.addListenerOnce(this.map, 'tilesloaded', this.onMapInit);

       this.map.addListener('idle', () => {
          console.log ('Map center changed: ' + this.map.getCenter());
          this.mapCenter = this.map.getCenter();

          this.reverseGeocode(this.map.getCenter().lat(), this.map.getCenter().lng()).subscribe(data => {
            const res = data['results'];
            const zero = res[0];
            const address = zero['formatted_address'];
            this.myLocation = address;

            userService.getPackagesInAreaOf(address)
            .subscribe ((nearbyPackages: Array<Package>) => {

              nearbyPackages.forEach((pack: Package) => {
                  if (!this.packageExists(pack.id.toString())) {
                    this.packages.push(pack);
                    this.geocodeAddPin(pack['senderAdress'], pack);
                  }
                });

          //   this.dismissLoading();

              const marker = new google.maps.Marker({
                position: this.loc,
                map: this.map,
                icon: {
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
              });
            });
          });

        //  this.presentLoading();

          // check if it only moved a bit
/*
          userService.getPackagesInAreaOf('iasi')
          .subscribe ((nearbyPackages: Array<Package>) => {

            nearbyPackages.forEach((pack: Package) => {
              this.packages.push(pack);
            });

            nearbyPackages.forEach((pack: Package) => {
                // pack['emailSender'] = 'hey';
                this.geocodeAddPin(pack['senderAdress'], pack);
            });

         //   this.dismissLoading();

            const marker = new google.maps.Marker({
              position: this.loc,
              map: this.map,
              icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
              }
            });
          });*/
        });

      }, 1000);

    /*  
*/

    }

  onMapInit() {
    google.maps.event.removeListener(this.tileListener);
  }

  reverseGeocode(lat: string, lng: string) {
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + encodeURI(',') + lng + '&key=' + this.apiKey)
  }
/*
  updateMapBasedOnCenter(lat: any, lng: any){
    this.userService.getPackagesInAreaOf('Iasi')
    .subscribe ((nearbyPackages: Array<Package>) => {
      nearbyPackages.forEach((pack: Package) => {
        this.packages.push(pack);
      });
      nearbyPackages.forEach((pack: Package) => {
        this.geocodeAddPin(pack['senderAdress'], pack);
      });

    });
  }
*/

  public geocodeAddPin(address: string, packageToGeolocate: Package) {
    /* Get coords for address */
    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(address) + '&key=' + this.apiKey)
    .subscribe(data => {
      /* get coords */
      console.log(JSON.stringify(data));

      const res = data['results'];
      const zero = res[0];
      const geometry = zero['geometry'];
      const location = geometry['location'];

      /* add marker */
      const marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: this.image,
        label: packageToGeolocate.id.toString(),
      });

      /* when clicking marker */
      marker.addListener('click', () => {
        this.selectedPackage = packageToGeolocate;
        console.log('selected: ' + packageToGeolocate.id);
        console.log(JSON.stringify(packageToGeolocate));

        /* Add destination marker */
        this.http.get(
          // tslint:disable-next-line:max-line-length
          'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodeURI(this.selectedPackage.receiverAdress) + '&key=' + this.userService.apiKey)
          .subscribe(data2 => {
            console.log(JSON.stringify(data));
            const res2 = data2['results'];
            const zero2 = res2[0];
            const geometry2 = zero2['geometry'];
            const location2 = geometry2['location'];
            const dMarker = new google.maps.Marker({
              position: location2,
              map: this.map,
              icon: {
                url: 'http://maps.google.com/mapfiles/kml/pal4/icon21.png'
              }
            });
            
            this.destinationMarker = dMarker;
          });
          /* End add destination marker */

        });
      });
  }

  public packageExists(id: string): boolean {
    for (let i = 0; i < this.packages.length; i++) {
      if (this.packages[i].id.toString() === id) {
        console.log('ALREADY EXISTING');
        return true;
      }
    }
    console.log('NOT EXISTING');
    return false;
  }

  public selectPackage(id: string) {
    for (let i = 0; i < this.packageArray.length; i++) {
      console.log(this.packageArray[i]);
      if (this.packageArray[i].id.toString() === id) {
        this.selectedPackage = this.packageArray[i];
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Retrieving Packages',
    });
    await this.loading.present();
  }

  async dismissLoading() {
    this.loading.dismiss();
  }

  public didSelectPackage(): boolean {
    if (this.selectedPackage == null) {
      return false;
    } else { return true; }
  }

  public acceptPackageRequest(){
    this.userService.acceptPackage(this.selectedPackage.id.toString())
    .subscribe(data => {
      if(data['message'] === 'Success') {
        // tslint:disable-next-line:max-line-length
        this.userService.presentWarning(data['message'], 'The Package was saved in your list. You can now see it in My Packages section. Contact the sender as soon as possible to avoid losing the package.');
      } else {
        this.userService.presentWarning('Error!', 'Something bad happened :(');
      }
    })
  }
}
