import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ModalController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-modal-select-address',
  templateUrl: './modal-select-address.page.html',
  styleUrls: ['./modal-select-address.page.scss'],
})
export class ModalSelectAddressPage {

  autocomplete: any;
  searchTerm = '';
  autocompleteItems: string[];
  googleAutocomplete: any;

  chosenAddress = '';

  constructor(public httpClient: HttpClient, public geolocation: Geolocation, private modalController: ModalController) { 
    this.googleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
  }

  updateSearchResults(){
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.googleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
    (predictions, status) => {
      this.autocompleteItems = [];
        predictions.forEach((prediction) => {
          this.autocompleteItems.push(prediction);
      });
    });
  }

  async selectSearchResult(item){
    this.chosenAddress = item['description'];
    console.log('Chosen: ' + this.chosenAddress);
    await this.modalController.dismiss(this.chosenAddress);
  }

}
