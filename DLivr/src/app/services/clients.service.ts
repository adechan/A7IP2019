import { Injectable, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Card } from '../card';

import { Observable } from 'rxjs';
import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';

declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class ClientsService implements AfterViewInit {

;
  loggedIn = false;
  accessToken: String = '';
  email: String = '';
  apiKey: String = 'AIzaSyCzbVg-JhZ5enrOtt6KwzDFqG9_7C-vSYo'; /*Your API Key*/
  geocoder: any;

  userType: String = 'client';

  // host: String = 'localhost';
  // host: String = '192.168.0.102';

  ngAfterViewInit()
  {
  }

  constructor(private http: HttpClient, public alertController: AlertController, private router: Router) 
  {
  }

  // REGISTER : post
  register(credentials) {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
       // 'Access-Control-Allow-Origin':'*'
      })
    };

    this.http.post('http://localhost:8298/account-management/register', credentials, httpOptions)

    .subscribe(data => {
      console.log(data['message']);
      this.presentWarning('Account registered successfully!',
       'Welcome to DLivr! Please follow the confirmation link you received at your email address to finish validating your account!');
      this.login(credentials);
     }, error => {
      console.log(error);
      this.presentWarning('Atentie!', error.error['message']);
    });
  }

  // LOGIN : post
  login(credentials) {

    console.log(credentials);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    this.http.post('http://localhost:8298/account-management/login', credentials, httpOptions)
    .subscribe(data => {
      this.accessToken = data['token'];
      this.email = JSON.parse(credentials)['email'];
      this.loggedIn = true;
      
      console.log('Access token received:' + this.accessToken);
      console.log('Email received:' + this.email);
      
      this.router.navigateByUrl('app/menu/home');
     }, error => {
      this.presentWarning('Atentie!', error.error['message']);
    });
  }

  // RATING : post
  sendPackageRating(id, rating)
  {
    const body = {
      'idPackage': id, 
      'rating': rating
    };

    console.log("sendPackageRating: " + JSON.stringify(body));

    return this.http.post(
      'http://localhost:8298/rating-management/rating/setRating', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }

  // async presentRating()
  // {
  //   const alert = await this.alertController.create({
  //     message: '<rating [rate]="rate"' +
  //       'readonly="false"' +
  //       'size="default" ' +
  //       '(rateChange)="onRateChange($event)">' +
  //     '</rating>',
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

  changeToDriver()
  {
    this.userType = 'driver';
  }

  changeToClient()
  {
    this.userType = 'client';
  }

  // coroutines
  async presentWarning(hd: String, msg: String) {
   console.log('ms ul asta e ' + msg);
    const alert = await this.alertController.create({
      header: hd.toString(),
      subHeader: '',
      message:
   //   "" + msg,
  msg.toString(),
      buttons: ['OK']
    });

    await alert.present();
  }

  // HEADER : CORS 
  makeAuthorizedHeader() 
  {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.accessToken
      })
    };
  }

  // MYPACKAGES_ client : get
  getPackages()
  {
    return this.http.get('http://localhost:8298/package-management/packages/getPackagesSender', this.makeAuthorizedHeader());
  }

  // a try of validate address
  validateAddress()
  {
    var address1 = document.getElementById('pickupAddressInput');
    //var address2 = document.getElementById('deliveryAddressInput');

    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({'address': address1}, function(results, status) {
      if (status === 'OK') 
      {
        console.log("Address is good.");
      }
      else 
      {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  truncateEmailHost(email) : String{
    var index = email.lastIndexOf('@');
    return email.substring(0, index);
  }

  // MYPACKAGES_ client : post
  addPackage(newPackage)
  {
    const body = {
      "emailSender" : this.email,
      "namePackage" : newPackage['namePackage'],
      "senderAdress": newPackage['senderAdress'],
      "receiverAdress": newPackage['receiverAdress'],
      "kilograms": newPackage['kilograms'],
      "phoneNumberSender": newPackage['phoneNumberSender'],
      "phoneNumberReceiver": newPackage['phoneNumberReceiver'],
      "receiverName": newPackage['receiverName'],
      "senderName": newPackage['senderName'],
      "length": newPackage['length'],
      "width": newPackage['width'],
      "height": newPackage['height']
    };
    console.log(body);
    return this.http.post('http://localhost:8298/package-management/packages/registerPackage', 
      JSON.stringify(body), 
      this.makeAuthorizedHeader()
    );
  }

  // MYPACKAGES_ client: delete
  deletePackage(id)
  {
    return this.http.delete('http://localhost:8298/package-management/packages/deletePackage/' + id, this.makeAuthorizedHeader());
  }

  // MYPACKAGES_ client: put
  editPackage(packageToUpdate)
  {
    return this.http.put('http://localhost:8298/package-management/packages/modifyPackageInformations', 
      packageToUpdate, 
      this.makeAuthorizedHeader()
    );
  }

  // MYPACKAGES_ driver: get
  mypackagesdriverget()
  {
   console.log('Access email MY PACK DRIVER ' + this.email);
   //console.log('Acces token MY PACK DRIVER ' + data['email']);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':'Bearer ' + this.accessToken
      })  
    };
      
    return this.http.get('http://localhost:8298/package-management/packages/getPackagesDriver',httpOptions)

  }

  getCards()
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':'Bearer ' + this.accessToken
      })  
      };
      
    return this.http.get('http://localhost:8298/account-management/accountManagement/getCards',httpOptions)

  }

  addCard(card: Card){

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':'Bearer ' + this.accessToken
      })  
      };

    return this.http.post<any>('http://localhost:8298/account-management/accountManagement/addCard', card, httpOptions )
  }


  deleteCard(card: number) {
    console.log('Delete this card number: ' + card);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':'Bearer ' + this.accessToken,
        'Access-Control-Allow-Origin': '*'

      })  
      };

    return this.http.delete('http://localhost:8298/account-management/accountManagement/deleteCard/'+ card, httpOptions )
    
  }

  // HOMEPAGE_ driver: get
  getPackagesInAreaOf(location: String) {
    return this.http.get('http://localhost:8298/package-management/packages/getPackagesNear/'
    + location.toString(), this.makeAuthorizedHeader());
  }
  
  modifyStatusDelivered(id: number, pin: number){
    console.log(' Body ul ptr "Delivered" ');
    console.log(' id ' + id);//Delivered
    console.log(' pin ' + pin);//Delivered

    const body = {
      "id" : id,
      "status" : "Delivered",
      "pin": pin
    };
    return this.http.put('http://localhost:8298/package-management/packages/modifyStatus',body, this.makeAuthorizedHeader());
  }

  modifyStatusAccepted(id: number){
    console.log(' Body ul ptr "Accepted" ');
    console.log(' id ' + id);//Accepted
    const body = {
      "id" : id,
      "status" : "Accepted"
    };
    return this.http.put('http://localhost:8298/package-management/packages/modifyStatus',body, this.makeAuthorizedHeader());
  }

  modifyStatusInDelivery(id: number){
    console.log(' Body ul ptr "In Delivery" ');
    console.log(' id ' + id);//In Delivery
    const body = {
      "id" : id,
      "status" : "In Delivery"
    };
    return this.http.put('http://localhost:8298/package-management/packages/modifyStatus',body, this.makeAuthorizedHeader());
  
  // FORGOT_PASSWORD: get
  generatePassword(email : String)
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    return this.http.get('http://localhost:8298/account-management/passwordRecovery/' + email, httpOptions);
  }

  // GET_PROFILE_INFO_ driver: get
  getProfileInfoDriver()
  {
    return this.http.get("http://localhost:8298/account-management/accountManagement/getProfileInformation/driver", this.makeAuthorizedHeader());
  }

  // GET_PROFILE_INFO_ sender: get
  getProfileInfoSender()
  {
    return this.http.get("http://localhost:8298/account-management/accountManagement/getProfileInformation/sender", this.makeAuthorizedHeader());
  }

  // GET_RATING_ driver: get
  // GET localhost:8298/rating-management/rating/getRating/{driverEmail}   se returneaza un json cu o cheie "rating" care retine un float. 
  getRating(email : String)
  {
    return this.http.get("http://localhost:8298/rating-management/rating/getRating/" + email, this.makeAuthorizedHeader());
  }

  // POST_PROFILE_INFO_ sender : post NAME
  sendProfileInfoName(name)
  {
    const body = {
      "name" : name,
      "country" : null,
      "phone_number" : null,
      "address1" : null, 
      "address2" : null, 
      "address3" : null, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post COUNTRY
  sendProfileInfoCountry(country)
  {
    const body = {
      "name" : null,
      "country" : country,
      "phone_number" : null,
      "address1" : null, 
      "address2" : null, 
      "address3" : null, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post PHONE
  sendProfileInfoPhoneNumber(phone_number)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : phone_number,
      "address1" : null, 
      "address2" : null, 
      "address3" : null, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post ADDRESS1
  sendProfileInfoAddress1(address1)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : null,
      "address1" : address1, 
      "address2" : null, 
      "address3" : null, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post ADDRESS2
  sendProfileInfoAddress2(address2)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : null,
      "address1" : null, 
      "address2" : address2, 
      "address3" : null, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post ADDRESS3
  sendProfileInfoAddress3(address3)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : null,
      "address1" : null, 
      "address2" : null, 
      "address3" : address3, 
      "address4" : null, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post ADDRESS4
  sendProfileInfoAddress4(address4)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : null,
      "address1" : null, 
      "address2" : null, 
      "address3" : null, 
      "address4" : address4, 
      "address5" : null, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }
 // POST_PROFILE_INFO_ sender : post ADDRESS5
  sendProfileInfoAddress5(address5)
  {
    const body = {
      "name" : null,
      "country" : null,
      "phone_number" : null,
      "address1" : null, 
      "address2" : null, 
      "address3" : null, 
      "address4" : null, 
      "address5" : address5, 
    };

    return this.http.put('http://localhost:8298/account-management/accountManagement/modifyProfileInformation/sender', 
      JSON.stringify(body),
      this.makeAuthorizedHeader()
    );
  }

  // PUT_CHANGE_PASS : put PASSWORD
  changePassword(oldPassword, newPassword)
  {
    const body = {
      "oldPassword" : oldPassword,
      "newPassword" : newPassword
    }
    return this.http.put('http://localhost:8298/account-management/accountManagement/resetPassword',
      body,
      this.makeAuthorizedHeader());
  }
}
