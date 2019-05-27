import { Component, OnInit} from '@angular/core';
import { MenuController, ModalController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients.service';
import { ModalSelectAddressPage } from '../modal-select-address/modal-select-address.page';
import { OverlayEventDetail } from '@ionic/core';


@Component({
  selector: 'app-mypackages',
  templateUrl: './mypackages.page.html',
  styleUrls: ['./mypackages.page.scss'],
})
export class MypackagesPage implements OnInit {
  
  submitted = false; 

  addPackageForm: FormGroup;
  packages = [];

  ratingD: String = '';
  nameD: String = '';
  phoneNumberD: String = '';


  emailDriver: string = "";
  namePackage: string = "";
  senderAdress: string = "";
  receiverAdress: string = "";
  receiverName: string = "";
  senderName: string = "";
  phoneNumberReceiver: string = "";
  phoneNumberSender: string = "";
  length: string = "";
  kilograms: string ="";
  height: string = "";
  width: string = "";
  pin: string = "";

  selectedPackage = [];

  id: string = "";

  rating;

  get f() { return this.addPackageForm.controls; }

  public pickReceiverAddress() {
    this.presentReceiverAddressModal();
  }

  async presentReceiverAddressModal() {
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        this.receiverAdress = detail.data;
      }
   });

   await modal.present();
  }

  public pickSenderAddress() {
    this.presentSenderAddressModal();
  }

  async presentSenderAddressModal() {
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        this.senderAdress = detail.data;
      }
   });

   await modal.present();
  }

  submitForm() {
    this.submitted = true;

    if (this.addPackageForm.invalid) {
      console.log('Add package form invalid');
        return;
    }
  }

  toArray(object): Array<any> {
    return Object.keys(object).map(function(key) {
      return [Number(key), object[key]];
    });
  }

  getAllPackages()
  {
    this.packages = [];
    this.userService.getPackages()
    .subscribe(data => {
      console.log(data);

      const packages = Object.values(data);
      console.log(packages);

      packages.forEach(p => {
        this.pushCard(
          p['id'],
          p['emailDriver'],
          p['namePackage'],
          p['senderAdress'],
          p['receiverAdress'],
          p['receiverName'],
          p['senderName'],
          p['phoneNumberReceiver'],
          p['phoneNumberSender'],
          p['length'],
          p['kilograms'],
          p['height'],
          p['width'],
          //'Delivered'
          p['status'],
          p['pin']
        )
      });

      if (packages.length > 0)
      {
        var divNoPackage = document.getElementById("noPackageText");
        divNoPackage.style.display = "none";
      }

    }, error => {
      console.log("Unable to retrieve packages from server");
      console.log(error);
    });
  }

  onRatingIconClick(i: number)
  {
    const show = this.packages[i - 1]['ratingShow'];

    if (show)
    {
      console.log("Sending rating: " + this.packages[i - 1]['id'] +", " + this.packages[i - 1]['rating']);
      this.userService.sendPackageRating(this.packages[i - 1]['id'], this.packages[i - 1]['rating'])
      .subscribe(data => {
        console.log("rating: sent!");
      }, error => {
        this.userService.presentWarning("Atentie", "A aparut o problema cu informatia trimisa de dvs!");
        console.log("Can't send the rating!");
        console.log(error);
      });
    }

    this.packages[i - 1]['ratingShow'] = !show;
  }

  
  async changeStatusAcceptedInReady(i : number)
  {
    console.log('id ' + this.packages[i - 1]['id']);

    const alert = await this.alertController.create({
      header: "Do you want to find another driver?",
      buttons: 
      [
        {
          text: 'No',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Pressed the button yes');

            this.userService.modifyStatusReady(this.packages[i - 1]['id'])
            .subscribe(data => {
              console.log("refuse driver!");
              this.userService.presentWarning("Atentie", "Ai anulat prealuarea pachetului de catre sofer! Pachetul tau asteapta sa fie acceptat de altcineva!");
        
              this.packages = [];
              this.userService.getPackages()
              .subscribe(data => {
                console.log(data);
        
                const packages = Object.values(data);
                console.log(packages);
        
                packages.forEach(p => {
                  this.pushCard(
                    p['id'],
                    p['emailDriver'],
                    p['namePackage'],
                    p['senderAdress'],
                    p['receiverAdress'],
                    p['receiverName'],
                    p['senderName'],
                    p['phoneNumberReceiver'],
                    p['phoneNumberSender'],
                    p['length'],
                    p['kilograms'],
                    p['height'],
                    p['width'],
                    //'Delivered'
                    p['status'],
                    p['pin']
                  )
                });
        
                if (packages.length > 0)
                {
                  var divNoPackage = document.getElementById("noPackageText");
                  divNoPackage.style.display = "none";
                }
        
              }, error => {
                console.log("Unable to retrieve packages from server");
                console.log(error);
              });
        
            }, error => {
              this.userService.presentWarning("Atentie", "Nu puteti refuza preluarea pachetului!");
              console.log("Can't refuse driver!");
              console.log(error);
            });
          }
        },
      ]
    });
    await alert.present();

   
  }

  async showDriverDetail(i : number)
  {

    const pack = this.packages[i - 1];
    const email = pack['emailDriver'];

    console.log('email ' + email);

    this.userService.getProfileInformationDriver(email)
    .subscribe(data => 
      {
        console.log('Getting data from server'+  JSON.stringify(data));
        this.emailDriver = data['emailDriver'];
        this.nameD = data['name'];
        this.phoneNumberD = data['phone_number'];
  
        this.userService.getRating(email)
        .subscribe(async data => {
          console.log('Getting rating from server' + JSON.stringify(data));

          this.ratingD = data['rating'];

          const alert = await this.alertController.create({
            header: "Drivers's contact info",
            inputs:
            [
              {
                name: 'name',
                value: 'Name: ' + this.nameD,
              },
              {
                name: 'phone_number',
                value: 'Phone number: ' +  this.phoneNumberD,
              },
              {
                name: 'rating',
                value: 'Rating: ' + this.ratingD,
              }
            ],
            buttons: 
            [
              {
                text: 'Ok',
                handler: () => {
                  console.log('Pressed the button cancel');
                }
              },
            ]
          });
          await alert.present();
    
        }, error => {
          console.log('Unable to get rating');
          console.log(error);
        });
  
      }, error => {
        console.log('Unable to get info');
        console.log(error);
      });

    
    }


  getRatingIcon(state: boolean)
  {
    if (state)
      return 'checkmark';

    return 'star';
  }

  onRateChange(packageNumber, rating)
  {
    console.log(packageNumber);
    console.log('Rating: ' + rating);
    this.packages[packageNumber - 1]['rating'] = rating;
  }

constructor(
    private menuCtrl: MenuController, 
    private userService: ClientsService,
    public formBuilder: FormBuilder,
    public alertController: AlertController,
    public modalController: ModalController
  ) {
    if (!userService.loggedIn)
      this.userService.gotoLoginPage();

    console.log('email received in mypackages: ' + this.userService.email);

    this.getAllPackages();

    this.addPackageForm = this.formBuilder.group(
      {
        namePackage: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]
      )),
      senderAdress: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]
      )),
      receiverAdress: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]
      )),
      receiverName: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]
      )),
      senderName: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ]
      )),
      phoneNumberSender: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(7),
          Validators.maxLength(30),
        ]
      )),
      phoneNumberReceiver: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(7),
          Validators.maxLength(30),
        ]
      )),
      kilograms: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(1),
          Validators.maxLength(30),
        ]
      )),
      width: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(1),
          Validators.maxLength(30),
        ]
      )),
      length: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(1),
          Validators.maxLength(30),
        ]
      )),
      height: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.pattern("[0-9]+"),
          Validators.minLength(1),
          Validators.maxLength(30),
        ]
      )),
    });
  }

  ngOnInit() {
  }

  // close addPackage page/ editPackage page
  closeExistingPackage() {
    // editPackage
    var divAdd = document.getElementById("addPackage");
    var divEdit = document.getElementById("editPackage");

    divAdd.style.display = "none";
    divEdit.style.display = "none";
    // divEdit.style.display = "none";

    //buttonAdd.textContent = "Add Package";
  }

  clearAddPackageInputs()
  {
    this.namePackage = "";
    this.receiverAdress = "";
    this.receiverName = "";
    this.phoneNumberReceiver = "";

    this.senderName = "";
    this.senderAdress = "";
    this.phoneNumberSender = "";

    this.length = "";
    this.kilograms = "";
    this.height = "";
    this.width = "";
  }

  setAddPackageInputs(pack)
  {
    this.namePackage = pack.namePackage;

    this.senderName = pack.senderName;
    this.senderAdress = pack.senderAdress;
    this.phoneNumberSender = pack.phoneNumberSender;

    this.receiverAdress = pack.receiverAdress;
    this.receiverName = pack.receiverName;
    this.phoneNumberReceiver = pack.phoneNumberReceiver;

    this.length = pack.length;
    this.kilograms = pack.kilograms;
    this.height = pack.height;
    this.width = pack.width;
  }

  onEditPackageSave()
  {
    var divNoPackage = document.getElementById("noPackageText");
    var divDriverText = document.getElementById("textDriver")
    var divAdd = document.getElementById("addPackage");
    var buttonAdd = document.getElementById("addpackage");
    var divtextDriver2 = document.getElementById("textDriver2");
    
    console.log(buttonAdd.textContent);
   
    if (!this.addPackageForm.invalid)
      this.closeExistingPackage();

    divtextDriver2.style.display = "none";

    if (!this.addPackageForm.invalid)
    {
      buttonAdd.textContent = "Add Package";
      divDriverText.style.display = "none";
      this.addPackageForm.clearValidators();
      this.addPackageForm.updateValueAndValidity();
    }

    var newPackage = this.makePackage(
      this.userService.email,
      '',
      this.selectedPackage['id'],
      this.namePackage, 
      this.senderAdress,
      this.receiverAdress,
      this.receiverName,
      this.senderName,
      this.phoneNumberReceiver,
      this.phoneNumberSender,
      this.length,
      this.kilograms,
      this.height,
      this.width,
      "Ready",
      this.pin
    );

    console.log(newPackage);

    this.submitted = true;
    this.userService.editPackage(newPackage)
    .subscribe(data => {
      console.log("editPackage success: data");
      this.getAllPackages();
    }, error => {
      console.log('Unable to register package');
      console.log(error);
      this.userService.presentWarning("Formular Invalid", "A aparut o problema cu informatiile pe care le-ati trimis!");
    });
  }

  // addPackage form
  addPackageButton()
  {
    // editPackage
    var divEditPackage = document.getElementById("editPackage");

    if (divEditPackage.style.display != "none")
    {
      this.onEditPackageSave();
      return;
    }

    var divNoPackage = document.getElementById("noPackageText");
    var divDriverText = document.getElementById("textDriver")
    var divAdd = document.getElementById("addPackage");
    var buttonAdd = document.getElementById("addpackage");
    var divtextDriver2 = document.getElementById("textDriver2");
    
    console.log(buttonAdd.textContent);
   
    if (!this.addPackageForm.invalid)
      this.closeExistingPackage();

    divtextDriver2.style.display = "none";

    if (buttonAdd.textContent == "Add Package")
    {
      this.submitted = false;
      divNoPackage.style.display = "none";
      divAdd.style.display = "block";
      buttonAdd.textContent = "Confirm";
      divDriverText.style.display = "block";
    }
    else // Confirm
    {
      if (!this.addPackageForm.invalid)
      {
        buttonAdd.textContent = "Add Package";
        divDriverText.style.display = "none";
        this.addPackageForm.clearValidators();
        this.addPackageForm.updateValueAndValidity();
      }

      var newPackage = this.makePackage(
        this.userService.email,
        "",
        -1,
        this.namePackage, 
        this.senderAdress,
        this.receiverAdress,
        this.receiverName,
        this.senderName,
        this.phoneNumberReceiver,
        this.phoneNumberSender,
        this.length,
        this.kilograms,
        this.height,
        this.width,
        'Ready',
        this.pin
      );

      console.log(newPackage);

      this.submitted = true;
      this.userService.addPackage(newPackage)
      .subscribe(data => {
        console.log("addPackage success: data");
        this.getAllPackages();
      }, error => {
        console.log('Unable to register package');
        console.log(error);
        this.userService.presentWarning("Formular Invalid", "A aparut o problema cu informatiile pe care le-ati trimis!");
      });
    }
  }

  // editPackage form
  editPackageForm(i){
    var divEdit = document.getElementById("editPackage");
    var buttonEdit = document.getElementById("addpackage");
    var divtextDriver2 = document.getElementById("textDriver2");

    this.closeExistingPackage();

    divEdit.style.display = "block";
    buttonEdit.textContent = "Save";
    divtextDriver2.style.display = "block";

    this.selectedPackage = this.packages[i - 1];
    console.log("editPackageForm: ");
    console.log("i = " + i);
    console.log("Name = " + this.selectedPackage["namePackage"]);
    console.log("Number = " + this.selectedPackage["number"]);

    this.clearAddPackageInputs();
    this.setAddPackageInputs(this.selectedPackage);
  }


  // delete a package in addPackage page
  deletePackage(i)
  {
    this.userService.deletePackage(this.packages[i - 1]['id'])
    .subscribe(data => {
      this.getAllPackages();
    }, error => {
      console.log('You can not delete this package');
    })
  }
 
  cancelEdit(){

    var divEdit = document.getElementById("editPackage");
    var buttonEdit = document.getElementById("addpackage");
    var divtextDriver2 = document.getElementById("textDriver2");

    this.closeExistingPackage();
    this.addPackageForm.clearValidators();

    buttonEdit.textContent = "Add Package";
    divtextDriver2.style.display = "none";
    divEdit.style.display = "none";

  }

    // cancel edit in editPackage
   dontSaveEditPackage(){
    var buttonEdit = document.getElementById("addpackage");
    var divtextDriver2 = document.getElementById("textDriver2");

    this.closeExistingPackage();

    buttonEdit.textContent = "Add Package";
    divtextDriver2.style.display = "none";

    this.clearAddPackageInputs();
  }

  // cancel addPackage
  dontAddPackage(){
    var buttonAddPackage = document.getElementById("addpackage");
    var divDriverText = document.getElementById("textDriver");
    this.closeExistingPackage();

    buttonAddPackage.textContent = "Add Package";
    divDriverText.style.display = "none";

    this.clearAddPackageInputs();
  }


  makePackage(emailSender, emailDriver, id, namePackage, senderAdress, receiverAdress, receiverName, senderName, phoneNumberReceiver, 
    phoneNumberSender, length, kilograms, height, width, status, pin){
    return {
      "emailSender": emailSender,
      "emailDriver": emailDriver,
      "id": id, 
      "number": (this.packages.length + 1).toString(),
      "namePackage": namePackage,
      "status": status,
      //   "senderAdress": encodeURI(senderAdress),
      "senderAdress": senderAdress,
      "receiverAdress": receiverAdress,
      "receiverName": receiverName,
      "senderName": senderName,
      "phoneNumberReceiver": phoneNumberReceiver,
      "phoneNumberSender": phoneNumberSender,
      "length": length,
      "kilograms": kilograms,
      "height": height,
      "width": width,
      "ratingShow": false,
      "rating": -1,
      "pin": pin
    };
  }

  pushCard(id, emailDriver, namePackage, senderAdress, receiverAdress, receiverName, senderName, phoneNumberReceiver,
    phoneNumberSender, length, kilograms, height, width, status, pin)
  {

    this.packages.push(this.makePackage(
      this.userService.email,
      emailDriver,
      id,
      namePackage, 
      senderAdress, 
      receiverAdress, 
      receiverName, 
      senderName,
      phoneNumberReceiver, 
      phoneNumberSender,
      length,
      kilograms,
      height,
      width,
      status,
      pin
    ));

    this.clearAddPackageInputs();
  }


}
