import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Evento } from '../../models/evento.models';
import { Usuario } from './../../models/usuario.model';
import { EventoService } from './../../providers/evento.service';
import { UtilsServiceProvider } from './../../providers/utils.service';

/**
 * Generated class for the ModificarComentarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-modificar-comentario',
  templateUrl: 'modificar-comentario.html',
})
export class ModificarComentarioPage {

  usuario: Usuario = new Usuario()
  evento: Evento = new Evento()
  comentario : string 

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private eventServ : EventoService, private loader: LoadingController, private utilServ : UtilsServiceProvider) {
  }

  ionViewDidLoad() {
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()
    this.usuario = this.navParams.get('usuario')
    this.evento = this.navParams.get('evento')
    this.eventServ.obtenerComentario(this.usuario._id, this.evento._id).subscribe((resp)=>{
      this.comentario = resp.data
      console.log(this.comentario)
      loader.dismiss()
    },(err)=>{
      loader.dismiss()
      this.utilServ.dispararAlert('Error','Error al obtener información')
      console.log(err)
    })
  }
  guardar(){
    this.eventServ.guardarComentario(this.usuario._id, this.evento._id, this.comentario).subscribe((resp)=>{
      this.utilServ.dispararAlert('OK','Comentario guardado correctamente')
      this.navCtrl.pop()
    },(err)=>{
    
      this.utilServ.dispararAlert('Error','Error al guadar comentairo')
      console.log(err)
    })
  }
}
