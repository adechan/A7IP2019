import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from 'src/app/services/clients.service';
import { AlertController } from '@ionic/angular';
import { Card } from 'src/app/card';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],

})


export class PaymentPage implements OnInit {

  //addCardForm: FormGroup;

  //get f() { return this.addCardForm.controls; }

  // cardNumber: string = "";
  // mm: string = "";
  // yy: string = "";
  // cvv: string = "";
  // country: string = "";
  // zipcode: string = "";

  cards = [];
  holdLength : number;
  cardModel = new Card(null,null,null,null,'default',null);
  countries =  ['Afghanistan','Albania','Algeria','Andorra','Angola','Anguilla','Antigua ', 'Barbuda','Argentina','Armenia','Aruba','Australia','Austria','Azerbaijan','Bahamas'
	,'Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bermuda','Bhutan','Bolivia','Bosnia ',' Herzegovina','Botswana','Brazil','British Virgin Islands'
	,'Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Cayman Islands','Chad','Chile','China','Colombia','Congo','Cook Islands','Costa Rica'
	,'Cote D Ivoire','Croatia','Cruise Ship','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador','Equatorial Guinea'
	,'Estonia','Ethiopia','Falkland Islands','Faroe Islands','Fiji','Finland','France','French Polynesia','French West Indies','Gabon','Gambia','Georgia','Germany','Ghana'
	,'Gibraltar','Greece','Greenland','Grenada','Guam','Guatemala','Guernsey','Guinea','Guinea Bissau','Guyana','Haiti','Honduras','Hong Kong','Hungary','Iceland','India'
	,'Indonesia','Iran','Iraq','Ireland','Isle of Man','Israel','Italy','Jamaica','Japan','Jersey','Jordan','Kazakhstan','Kenya','Kuwait','Kyrgyz Republic','Laos','Latvia'
	,'Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Macau','Macedonia','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Mauritania'
	,'Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Montserrat','Morocco','Mozambique','Namibia','Nepal','Netherlands','Netherlands Antilles','New Caledonia'
	,'New Zealand','Nicaragua','Niger','Nigeria','Norway','Oman','Pakistan','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal'
	,'Puerto Rico','Qatar','Reunion','Romania','Russia','Rwanda','Saint Pierre ','Miquelon','Samoa','San Marino','Satellite','Saudi Arabia','Senegal','Serbia','Seychelles'
	,'Sierra Leone','Singapore','Slovakia','Slovenia','South Africa','South Korea','Spain','Sri Lanka','St Kitts ',' Nevis','St Lucia','St Vincent','St. Lucia','Sudan'
	,'Suriname','Swaziland','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor LEste','Togo','Tonga','Trinidad','Tobago','Tunisia'
	,'Turkey','Turkmenistan','Turks',' Caicos','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','United States Minor Outlying Islands','Uruguay'
	,'Uzbekistan','Venezuela','Vietnam','Virgin Islands (US)','Yemen','Zambia','Zimbabwe'];



  constructor(private myFirstService : ClientsService,public alertController: AlertController,private fb: FormBuilder) 
  {
    if (!myFirstService.loggedIn)
      myFirstService.gotoLoginPage();
  }

  ngOnInit() {

    //  this.addCardForm = new FormGroup({
    //   cardNr: new FormControl('', [ Validators.required, Validators.minLength(16),
    //     Validators.maxLength(16)]),
    //   mm: new FormControl('', [Validators.required,    Validators.minLength(1),
    //     Validators.maxLength(2),
    //   Validators.min(1),
    // Validators.max(12)]),
    //   cvv: new FormControl('', [Validators.required]),
    //   country: new FormControl('', [Validators.required]),
    //   zipcode: new FormControl('',[Validators.required])
    // });


    // this.addCardForm = this.fb.group(
    //   {
    //     cardNumber:['',[Validators.required,
    //     Validators.minLength(16),
    //     Validators.maxLength(16)]],
    //     mm:['',[Validators.required,
    //       Validators.minLength(1),
    //       Validators.maxLength(2),
    //     Validators.min(1),
    //   Validators.max(12)]],
    //     yy:'',
    //     cvv:'',
    //     country:'',
    //     zipcode:''
    //   });
   // this.cardModel = new Card(4535345435444,null,null,null,'default',null);
    this.myFirstService.getCards()
    .subscribe(data  => {
      console.log(" My cards : ", data);
      this.cards = data as [];
      console.log(" length - 1  : ", this.cards['length']-1);
    }, error => {
      console.log(error);
      this.presentWarning('Atentie!', error.error['message']);
    });
    
   
  }

  // get cardNumber(){
  //   return  this.addCardForm.get('cardNumber');
  // }

  // get mm(){
  //   return  this.addCardForm.get('mm');
  // }

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

  go(){
    var x = document.getElementById("formular");
    var y = document.getElementById("addCard");
    var z = document.getElementById("cards");
    
      x.style.display = "block";
      y.style.display = "none";
      z.style.display = "none";
    
  }

  saveCard(cardForm: NgForm): void {
    console.log("Current card details ",cardForm.value);
    console.log(cardForm);

    this.myFirstService.addCard(this.cardModel)
    .subscribe(
      data =>{
        console.log("I sent this card ! ", data);
        this.myFirstService.getCards()
      .subscribe(data  => {
        console.log(" My cards : ", data);
         this.cards = data as [];
  
      }, error => {
        console.log(error);
        this.presentWarning('Atentie!', error.error['message']);
      });
      }, error => {
        console.log(error);
        this.presentWarning('Atentie!', error.error['message']);
      });

      

    var x = document.getElementById("formular");
    var y = document.getElementById("addCard");
    var z = document.getElementById("cards");
    //var w = document.getElementById("pCardNumber");
    //var del = document.getElementById("delete");

    x.style.display = "none";
    y.style.display = "block";
    z.style.display = "block";

    (<HTMLInputElement>document.getElementById('cardNumber')).value= "";
    (<HTMLInputElement>document.getElementById('mm')).value= "";
    (<HTMLInputElement>document.getElementById('yy')).value= "";
    (<HTMLInputElement>document.getElementById('cvv')).value= "";
    (<HTMLInputElement>document.getElementById('country')).value= "";
    (<HTMLInputElement>document.getElementById('zipcode')).value= "";
  }

  cancel(){

    var x = document.getElementById("formular");
    var y = document.getElementById("addCard");
    var z = document.getElementById("cards");
    var w = document.getElementById("pCardNumber");

    
     x.style.display = "none";
     y.style.display = "block";
     z.style.display = "block";
     w.style.display = "none";

     (<HTMLInputElement>document.getElementById('cardNumber')).value= "";
     (<HTMLInputElement>document.getElementById('mm')).value= "";
     (<HTMLInputElement>document.getElementById('yy')).value= "";
     (<HTMLInputElement>document.getElementById('cvv')).value= "";
     (<HTMLInputElement>document.getElementById('country')).value= "";
     (<HTMLInputElement>document.getElementById('zipcode')).value= "";

  }

  deleteCardd(cardnumber: number): void{
    this.holdLength = this.cards['length']-1;// ultimul card din lista
   // console.log(" My last card number is : ", this.cards[this.holdLength]['cardNumber']); 
   
    console.log("delete this card ", cardnumber );
    this.presentPrompt('Do you want to delete this card ?',cardnumber);
  }
  async presentPrompt(message: String,cardnumber: number) {
    let alert = await this.alertController.create({
      header: message.toString(),
      buttons: [
        {
          text: 'No',
         //role: 'deleteCard',
         handler: () => {},
        },
        {
          text: 'Yes',
        //  role: 'doNotDeleteCard',
          handler: () => {
      
          console.log("delete this card (alert function)  ", cardnumber );
            this.myFirstService.deleteCard(cardnumber)
            .subscribe(
              data =>{
                console.log("oh well, I deleted this card ! ", data);
                this.myFirstService.getCards()
                .subscribe(data  => {
                  console.log(" My cards : ", data);
                   this.cards = data as [];
            
                }, error => {
                  console.log(error);
                  this.presentWarning('Atentie!', error.error['message']);
                });
              }, error => {
                console.log(error);
                this.presentWarning('Atentie!', error.error['message']);
              });

        }
        }
      ]
    });
  await  alert.present();
  }
  
}
