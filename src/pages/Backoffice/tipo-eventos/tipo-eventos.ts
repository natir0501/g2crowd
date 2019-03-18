import { TipoEventoService } from './../../../providers/tipoevento.service';
import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { UtilsServiceProvider } from '../../../providers/utils.service';
import { TipoEvento } from '../../../models/tipo.evento.models';
import { NgForm } from '@angular/forms';
import { MantenimientoTipoEventosPage } from '../mantenimiento-tipo-eventos/mantenimiento-tipo-eventos';



@Component({
  selector: 'page-tipo-eventos',
  templateUrl: 'tipo-eventos.html',
})
export class TipoEventosPage {

  tEventos: TipoEvento[] = [];

  @ViewChild("form") formulario: NgForm

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public tipEventServ: TipoEventoService, public utilServ: UtilsServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present();

    this.tipEventServ.obtenerEventos()
      .subscribe((resp) => {
        this.tEventos = resp.data.tipoEventos;
      },
        (err) => {
          console.log("Error obteniendo tipos de Eventos", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los tipos de eventos")
        }, () => {
          loading.dismiss();
        })
  }

  altaTipoEvento() {
    //Con Push para que no pierda la navegavilidad
    this.navCtrl.push(MantenimientoTipoEventosPage)
  }

  modificarTipoEvento(te: TipoEvento) {
    //Con Push para que no pierda la navegavilidad
    this.navCtrl.push(MantenimientoTipoEventosPage, { te })
  }
  
}
