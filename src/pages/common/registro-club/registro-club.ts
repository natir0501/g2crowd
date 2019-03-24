import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Club } from './../../../models/club.models'
import { NgForm, NgControl, FormControl } from '@angular/forms';
import { Deportes } from '../../../models/enum.models';
import { Colores } from '../../../models/enum.models';
import { ClubService } from './../../../providers/club.service';
import { HttpClient } from '@angular/common/http';
import { UtilsServiceProvider } from '../../../providers/utils.service';

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

  @ViewChild('registroClubForm') registroClubForm: NgForm
  club: Club = new Club()
  deportes = Object.keys(Deportes).map(key => ({ 'id': key, 'value': Deportes[key] }))
  colores = Object.keys(Colores).map(key => ({ 'id': key, 'value': Colores[key] }))

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private clubServ: ClubService,
    private http: HttpClient,
    private toast: ToastController,
    private util: UtilsServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroClubPage');
  }

  onSubmit(){
    this.clubServ.altaClub(this.club).subscribe((resp) => {
      this.util.dispararAlert('Éxito', "Registro realizado correctamente")
      window.location.href = window.location.origin
      
    }, (err) => {
      this.util.dispararAlert('Error', "Error al dar de alta, intente nuevamente")
      console.log(err)
    })
  }
  
}
