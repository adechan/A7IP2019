import { Component, OnInit } from '@angular/core';
import { ClientsService } from 'src/app/services/clients.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalSelectAddressPage } from '../modal-select-address/modal-select-address.page';
import { OverlayEventDetail } from '@ionic/core';
declare var google: any;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  rating: String = '';
  email: String = '';
  name: String = '';
  phoneNumber: String = '';
  country: String = '';

  address1: String = '';
  address2: String = '';
  address3: String = '';
  address4: String = '';
  address5: String = '';

  predefinedAddresses = [];

  public showDeleteF1(){
    if (this.address1 != "")
    {
      return true;
    }

    return false;
  }

  public showDeleteF2(){
    if (this.address2 != "")
    {
      return true;
    }

    return false;
  }

  public showDeleteF3(){
    if (this.address3 != "")
    {
      return true;
    }

    return false;
  }

  public showDeleteF4(){
    if (this.address4 != "")
    {
      return true;
    }

    return false;
  }

  public showDeleteF5(){
    if (this.address5 != "")
    {
      return true;
    }

    return false;
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
        this.predefinedAddresses.push(detail.data);
        this.address1 = detail.data;
      }
   });

   await modal.present();
  }

  constructor(
    private userService: ClientsService, 
    public alertController: AlertController,
    public modalController: ModalController) 
  {
    console.log("HELLO?");
    //GET localhost:8298/account-management/accountManagement/getProfileInformation/driver returneaza 
    //informatiile de profil pentru un driver ( email,name,phone_number,country,address1,address2,address3,address4,address5 ). 
    //Adresele pot fi nule.

    this.userService.getProfileInfoSender()
    .subscribe(data => 
    {
      console.log('Getting data from server'+  JSON.stringify(data));
      this.email = data['email'];
      this.name = data['name'];
      this.phoneNumber = data['phone_number'];
      this.country = data['country'];
      this.address1 = data['address1'];
      this.address2 = data['address2'];
      this.address3 = data['address3'];
      this.address4 = data['address4'];
      this.address5 = data['address5'];

      this.userService.getRating(this.email)
      .subscribe(data => {
        console.log(this.userService.email);
        this.rating = data['rating'];
  
      }, error => {
        console.log('Unable to get rating');
        console.log(error);
  
        //this.userService.presentWarning("Formular Invalid", "A aparut o problema cu informatiile pe care le-ati trimis");
      });

    }, error => {
      console.log('Unable to get info');
      console.log(error);
    });
  }

  ngOnInit() {
  }

  changeUserType() {
    if (this.userService.userType === 'client') {
      this.userService.changeToDriver();

    } else {
      this.userService.changeToClient();

    }
  }


  async changeName()
  {
    const alert = await this.alertController.create({
      header: 'New name',
      inputs:
      [
        {
          name: 'name',
          placeholder: 'Enter your full name',
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['name'];
            console.log('Pressed the button Save ' + data['name']);
            this.userService.sendProfileInfoName(data['name'])
            .subscribe(data => {
            console.log("The name was updated");
            this.userService.presentWarning("Atentie", "Numele a fost modificat cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the name");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
    

  }

  async changePhoneNumber(){
    const alert = await this.alertController.create({
      header: 'New phone number',
      inputs:
      [
        {
          name: 'phone_number',
          placeholder: 'Enter your phone number',
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['phone_number'];
            console.log('Pressed the button Save ' + data['phone_number']);
            this.userService.sendProfileInfoPhoneNumber(data['phone_number'])
            .subscribe(data => {
            console.log("The phone_number was updated");
            this.userService.presentWarning("Atentie", "Numarul de telefon a fost modificat cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });

          }, error => {
            console.log("Can't update the phone_number");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async changeCountry(){
    const alert = await this.alertController.create({
      header: 'New country',
      inputs:
      [
        {
          name: 'country',
          placeholder: 'Enter your country',
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['country'];
            console.log('Pressed the button Save ' + data['country']);
            this.userService.sendProfileInfoCountry(data['country'])
            .subscribe(data => {
            console.log("The country was updated");
            this.userService.presentWarning("Atentie", "Tara a fost modificata cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });

          }, error => {
            console.log("Can't update the country");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async changeAddress1(){
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
       // this.predefinedAddresses.push(detail.data);
        this.address1 = detail.data;
      }
   });

   await modal.present();
  }


  async changeAddress2(){
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        //this.predefinedAddresses.push(detail.data);
        this.address2 = detail.data;
      }
   });

   await modal.present();
  }

  async changeAddress3(){
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
       // this.predefinedAddresses.push(detail.data);
        this.address3 = detail.data;
      }
   });

   await modal.present();
  }

  async changeAddress4(){
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
       // this.predefinedAddresses.push(detail.data);
        this.address4 = detail.data;
      }
   });

   await modal.present();
  }

  async changeAddress5(){
    const modal = await this.modalController.create({
      component: ModalSelectAddressPage,
      componentProps: { addressParameter: '' }
    });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
       // this.predefinedAddresses.push(detail.data);
        this.address5 = detail.data;
      }
   });

   await modal.present();
  }


 async saveAddress1(){
  const alert = await this.alertController.create({
    header: 'Do you want to save the address?',
    subHeader: 'Your predefined address is: ',
    inputs:
    [
      {
        name: 'address1',
        value: this.address1,
      },
    ],
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
        handler: (data) => {
          data['address1'];
          console.log('Pressed the button Save ' + data['address1']);
          this.userService.sendProfileInfoAddress1(data['address1'])
          .subscribe(data => {
          console.log("The address1 was updated");
          this.userService.presentWarning("Atentie", "Adresa predefinita a fost modificata cu success!");
                      
          this.userService.getProfileInfoSender()
          .subscribe(data => {
            console.log('Getting data from server'+  JSON.stringify(data));
            this.email = data['email'];
            this.name = data['name'];
            this.phoneNumber = data['phone_number'];
            this.country = data['country'];
            this.address1 = data['address1'];
            this.address2 = data['address2'];
            this.address3 = data['address3'];
            this.address4 = data['address4'];
            this.address5 = data['address5'];
        
          }, error => {
            console.log('Unable to get info');
            console.log(error);
        
        
          });

        }, error => {
          console.log("Can't update the address2");
          this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
          console.log(error);

        });
        }
      }
    ]
  });
  await alert.present();
  }

  async deleteAddress1()
  {
    const alert = await this.alertController.create({
      header: 'Do you want to delete this address?',
      inputs:
      [
        {
          name: 'address1',
          value: this.address1,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Delete',
          handler: (data) => {
            data['address1'] = '';
            console.log('Pressed the button Save ' + data['address1']);
            this.userService.sendProfileInfoAddress1(data['address1'])
            .subscribe(data => {
            console.log("The address1 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost stearsa cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }


  async deleteAddress2()
  {
    const alert = await this.alertController.create({
      header: 'Do you want to delete this address?',
      inputs:
      [
        {
          name: 'address2',
          value: this.address2,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Delete',
          handler: (data) => {
            data['address2'] = '';
            console.log('Pressed the button Save ' + data['address2']);
            this.userService.sendProfileInfoAddress2(data['address2'])
            .subscribe(data => {
            console.log("The address2 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost stearsa cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteAddress3()
  {
    const alert = await this.alertController.create({
      header: 'Do you want to delete this address?',
      inputs:
      [
        {
          name: 'address3',
          value: this.address3,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Delete',
          handler: (data) => {
            data['address3'] = '';
            console.log('Pressed the button Save ' + data['address3']);
            this.userService.sendProfileInfoAddress3(data['address3'])
            .subscribe(data => {
            console.log("The address3 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost stearsa cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }


  async deleteAddress4()
  {
    const alert = await this.alertController.create({
      header: 'Do you want to delete this address?',
      inputs:
      [
        {
          name: 'address4',
          value: this.address4,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Delete',
          handler: (data) => {
            data['address4'] = '';
            console.log('Pressed the button Save ' + data['address4']);
            this.userService.sendProfileInfoAddress4(data['address4'])
            .subscribe(data => {
            console.log("The address1 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost stearsa cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }


  async deleteAddress5()
  {
    const alert = await this.alertController.create({
      header: 'Do you want to delete this address?',
      inputs:
      [
        {
          name: 'address5',
          value: this.address5,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Delete',
          handler: (data) => {
            data['address5'] = '';
            console.log('Pressed the button Save ' + data['address5']);
            this.userService.sendProfileInfoAddress5(data['address5'])
            .subscribe(data => {
            console.log("The address5 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost modificata cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }


  async saveAddress2(){
    const alert = await this.alertController.create({
      header: 'Do you want to save the address?',
      subHeader: 'Your predefined address is:',
      inputs:
      [
        {
          name: 'address2',
          value: this.address2
        },
      ],
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
          handler: (data) => {
            data['address2'];
            console.log('Pressed the button Save ' + data['address2']);
            this.userService.sendProfileInfoAddress2(data['address2'])
            .subscribe(data => {
            console.log("The address2 was updated");
            this.userService.presentWarning("Atentie", "Adresa predefinita a fost modificata cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });

          }, error => {
            console.log("Can't update the address2");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async editAddress2()
  {
    const alert = await this.alertController.create({
      header: 'New address:',
      inputs:
      [
        {
          name: 'address2',
          value: this.address2,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['address2'];
            console.log('Pressed the button Save ' + data['address2']);
            this.userService.sendProfileInfoAddress2(data['address2'])
            .subscribe(data => {
            console.log("The address2 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost modificata cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async saveAddress3(){
    const alert = await this.alertController.create({
      header: 'Do you want to save the address?',
      subHeader: 'Your predefined address is: ',
      inputs:
      [
        {
          name: 'address3',
          value: this.address3,
        },
      ],
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
          handler: (data) => {
            data['address3'];
            console.log('Pressed the button Save ' + data['address3']);
            this.userService.sendProfileInfoAddress3(data['address3'])
            .subscribe(data => {
            console.log("The address3 was updated");
            this.userService.presentWarning("Atentie", "Adresa predefinita a fost modificata cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
  
          }, error => {
            console.log("Can't update the address3");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);
  
          });
          }
        }
      ]
    });
    await alert.present();
  }

  async editAddress3()
  {
    const alert = await this.alertController.create({
      header: 'New address:',
      inputs:
      [
        {
          name: 'address3',
          value: this.address3,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['address3'];
            console.log('Pressed the button Save ' + data['address3']);
            this.userService.sendProfileInfoAddress3(data['address3'])
            .subscribe(data => {
            console.log("The address3 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost modificata cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async saveAddress4(){
    const alert = await this.alertController.create({
      header: 'Do you want to save the address?',
      subHeader: 'Your predefined address is: ',
      inputs:
      [
        {
          name: 'address4',
          value: this.address4,
        },
      ],
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
          handler: (data) => {
            data['address4'];
            console.log('Pressed the button Save ' + data['address4']);
            this.userService.sendProfileInfoAddress4(data['address4'])
            .subscribe(data => {
            console.log("The address4 was updated");
            this.userService.presentWarning("Atentie", "Adresa predefinita a fost modificata cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
  
          }, error => {
            console.log("Can't update the address4");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);
  
          });
          }
        }
      ]
    });
    await alert.present();
  }


  async editAddress4()
  {
    const alert = await this.alertController.create({
      header: 'New address:',
      inputs:
      [
        {
          name: 'address4',
          value: this.address4,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['address4'];
            console.log('Pressed the button Save ' + data['address4']);
            this.userService.sendProfileInfoAddress4(data['address4'])
            .subscribe(data => {
            console.log("The address4 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost modificata cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async saveAddress5(){
    const alert = await this.alertController.create({
      header: 'Do you want to save the address?',
      subHeader: 'Your predefined address is: ',
      inputs:
      [
        {
          name: 'address5',
          value: this.address5,
        },
      ],
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
          handler: (data) => {
            data['address5'];
            console.log('Pressed the button Save ' + data['address5']);
            this.userService.sendProfileInfoAddress5(data['address5'])
            .subscribe(data => {
            console.log("The address5 was updated");
            this.userService.presentWarning("Atentie", "Adresa predefinita a fost modificata cu success!");
                        
            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
  
          }, error => {
            console.log("Can't update the address5");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);
  
          });
          }
        }
      ]
    });
    await alert.present();

  }


  async editAddress5()
  {
    const alert = await this.alertController.create({
      header: 'New address:',
      inputs:
      [
        {
          name: 'address4',
          value: this.address5,
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['address5'];
            console.log('Pressed the button Save ' + data['address5']);
            this.userService.sendProfileInfoAddress5(data['address5'])
            .subscribe(data => {
            console.log("The address5 was updated");
            this.userService.presentWarning("Atentie", "Adresa a fost modificata cu success!");

            this.userService.getProfileInfoSender()
            .subscribe(data => {
              console.log('Getting data from server'+  JSON.stringify(data));
              this.email = data['email'];
              this.name = data['name'];
              this.phoneNumber = data['phone_number'];
              this.country = data['country'];
              this.address1 = data['address1'];
              this.address2 = data['address2'];
              this.address3 = data['address3'];
              this.address4 = data['address4'];
              this.address5 = data['address5'];
          
            }, error => {
              console.log('Unable to get info');
              console.log(error);
          
          
            });
        
          }, error => {
            console.log("Can't update the address");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

          });
          }
        }
      ]
    });
    await alert.present();
  }

  async changePassword(){
    const alert = await this.alertController.create({
      header: 'Change your password',
      inputs:
      [  
        {
          name: 'passwordOld',
          placeholder: 'Enter your old password',
        },
        {
          name: 'passwordNew',
          placeholder: 'Enter a new password',
        },
      ],
      buttons: 
      [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Pressed the button cancel');
          }
        },
        {
          text: 'Save',
          handler: (data) => {
            data['passwordOld'];
            data['passwordNew'];

            console.log("Old password: " +   data['passwordOld']);
            console.log("New password: " +   data['passwordNew']);

            this.userService.changePassword(data['passwordOld'], data['passwordNew'])
            .subscribe(data => {
            console.log("The password was updated");
            this.userService.presentWarning("Atentie", "Parola dvs a fost modifica cu success!");

            }, error => {
            console.log("Can't update the password");
            this.userService.presentWarning("Atentie", "A aparut o problema cu informatia pe care ati trimis-o!");
            console.log(error);

           });
          }
        }
      ]
    });
    await alert.present();
  }
}
