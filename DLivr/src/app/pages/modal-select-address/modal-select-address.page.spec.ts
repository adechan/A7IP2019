import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleAutocomplete } from 
import { ModalSelectAddressPage } from './modal-select-address.page';
import { from } from 'rxjs';

describe('ModalSelectAddressPage', () => {
  let component: ModalSelectAddressPage;
  let fixture: ComponentFixture<ModalSelectAddressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSelectAddressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSelectAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
