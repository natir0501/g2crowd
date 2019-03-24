import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Club } from './../../../models/club.models'
import { NgForm, NgControl, FormControl } from '@angular/forms';
import { Deportes } from '../../../models/enum.models';

/**
 * Generated class for the RegistroClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-club',
  templateUrl: 'registro-club.html',
})
export class RegistroClubPage {

  @ViewChild('form') form: NgForm

  club: Club = new Club()
  deportes = Object.keys(Deportes).map(key => ({ 'id': key, 'value': Deportes[key] }))

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroClubPage');
  }

}
