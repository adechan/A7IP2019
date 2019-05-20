import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalSelectAddressPage } from '../modal-select-address/modal-select-address.page';

 interface myData
{
  obj: Object;
}

@Component({
  selector: 'app-mypackagesdriver',
  templateUrl: './mypackagesdriver.page.html',
  styleUrls: ['./mypackagesdriver.page.scss'],
})
export class MypackagesdriverPage implements OnInit {

  packages = [];

  constructor(private myFirstService: ClientsService,
              public alertController: AlertController,
              private alertCtrl: AlertController,
              public modalController: ModalController) {
    /*this.packages = JSON.parse(localStorage.getItem("mypackages.packages"));
    console.log("packages: " + JSON.stringify(this.packages[0].pickupAddress));*/

  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { value: 123 }
    });
    return await modal.present();
  }

  ngOnInit() {
    this.myFirstService.mypackagesdriverget()
      .subscribe(data  => {
        console.log("We got my packages driver data : ", data);
         this.packages = data as [];
        // console.log(this.packages[0]);
        // console.log(this.packages[1]);
        // console.log(this.packages[2]);
     //   this.packages = data;
      }, error => {
        console.log(error);
        this.presentWarning('Atentie!', error.error['message']);
      });
  }

  markPackageAsDelivered(){
    this.presentPrompt();
  }

  async presentPrompt() {
    let alert = await this.alertCtrl.create({
     // title: 'PIN',
      inputs: [
        {
          name: 'PIN',
          placeholder: 'PIN'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',

        },
        {
          text: 'Ok',
          role: 'ok',
        }
      ]
    });
  await  alert.present();
  }
  async presentWarning(hd: String, msg: String) {
    console.log('ms ul asta e ' + msg);
     const alert = await this.alertController.create({
       header: hd.toString(),
       subHeader: '',
       message:
       // "" + msg,
   msg.toString(),
       buttons: ['OK']
     });

     await alert.present();
   }
}
