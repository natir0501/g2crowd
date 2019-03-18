import { UsuarioService } from './../../../providers/usuario.service';
import { MantenimientoCampeonatosPage } from './../mantenimiento-campeonatos/mantenimiento-campeonatos';
import { Campeonato } from './../../../models/campeonato.model';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CampeonatoService } from '../../../providers/campeonato.service';
import { UtilsServiceProvider } from '../../../providers/utils.service';


@Component({
  selector: 'page-lista-campeonatos',
  templateUrl: 'lista-campeonatos.html',
})
export class ListaCampeonatosPage {

  campeonatos: Campeonato[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public campServ: CampeonatoService, public utilServ: UtilsServiceProvider, private usuServ : UsuarioService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner : 'circles'
    });
    loading.present()
  
    this.campServ.obtenerCampeonatos()
      .subscribe((resp) => {
        this.campeonatos = resp.data.campeonatos;
      },
        (err) => {
          console.log("Error obteniendo los campeonatos del club", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los campeonatos")
        },()=>{
          loading.dismiss();
        })
  }

  editarCampeonato(campeonato: Campeonato) {
    this.navCtrl.push((MantenimientoCampeonatosPage), {campeonato})
  }

  irAltaCamp(){
    this.navCtrl.push(MantenimientoCampeonatosPage, {campeonato: new Campeonato()})
  }

  puedoAgregar(){
    
    for (let camp of this.campeonatos){
      if(camp.anio === new Date().getFullYear() && camp.categoria._id === this.usuServ.usuario.perfiles[0].categoria){
        return false
      }
    }
    return true
  }
}
