import { TipoEventoService } from './../../../providers/tipoevento.service';
import { TipoEvento } from './../../../models/tipo.evento.models';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { UtilsServiceProvider } from '../../../providers/utils.service';
import { TipoEventosPage } from '../tipo-eventos/tipo-eventos';

/**
 * Generated class for the MantenimientoTipoEventosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-mantenimiento-tipo-eventos',
  templateUrl: 'mantenimiento-tipo-eventos.html',
})
export class MantenimientoTipoEventosPage {

  tipoEvento: TipoEvento = new TipoEvento;
  habilitado: boolean = true

  @ViewChild("form") formulario: NgForm

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilServ: UtilsServiceProvider, public tipEventServ: TipoEventoService) {
  }

  ionViewDidLoad() {
        
    let te: TipoEvento = this.navParams.get('te')

    if (te) {
      this.tipoEvento = te
      let noPermitidos = ['Partido Oficial']
      this.habilitado = noPermitidos.indexOf(this.tipoEvento.nombre) < 0
      
    }
    
  }

  onSubmit() {
    
    if (this.tipoEvento._id === '') {
      this.tipEventServ.agregarTipoEvento(this.tipoEvento)
        .subscribe(
          (resp) => {
            this.utilServ.dispararAlert("Ok", "Tipo de evento agregado correctamente.")
            this.navCtrl.setRoot(TipoEventosPage)
          },
          (err) => {
            console.log("Error dando de alta el tipo de evento", err)
            this.utilServ.dispararAlert("Error", "Ocurrió un error al agregar el tipo de evento")
          }
        )

    } else {
      this.tipEventServ.actualizarTipoEvento(this.tipoEvento)
        .subscribe(
          (resp) => {
            this.utilServ.dispararAlert("Ok", "Concepto modificado correctamente.")
            this.navCtrl.setRoot(TipoEventosPage)
          },
          (err) => {
            console.log("Error al modificar el tipo de evento", err)
            this.utilServ.dispararAlert("Error", "Ocurrió un error al modificar el tipo de evento")
          }
        )

    }

  }
  

}
