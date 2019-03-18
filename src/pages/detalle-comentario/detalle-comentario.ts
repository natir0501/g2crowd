import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { Evento } from '../../models/evento.models';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../providers/usuario.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { EventoService } from '../../providers/evento.service';
import { ListaEventosPage } from '../lista-eventos/lista-eventos';

/**
 * Generated class for the DetalleComentarioPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-detalle-comentario',
  templateUrl: 'detalle-comentario.html',
})
export class DetalleComentarioPage {

  evento: Evento = new Evento()
  
  usuario: Usuario = new Usuario()

  comentario: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras id fringilla elit. Sed a facilisis mi. In et orci volutpat, finibus sapien imperdiet, lobortis ex. Suspendisse elementum nulla erat, ac accumsan leo feugiat non. Pellentesque metus arcu, cursus vel libero a, tristique molestie leo. Phasellus hendrerit ligula eu eros bibendum pellentesque. Donec blandit arcu elit, ullamcorper ultricies leo porta id. Praesent varius, augue ullamcorper suscipit congue, leo dolor pharetra ligula, vitae gravida nunc nunc non metus. Vestibulum eget bibendum leo, vitae molestie magna. Fusce pellentesque quis enim a sollicitudin. In luctus ligula quis auctor dapibus. Pellentesque feugiat tortor eget nisl commodo, nec tempor metus convallis. Morbi vitae velit sit amet nunc aliquet suscipit non ut mauris. Quisque ornare ipsum suscipit augue pellentesque, vitae dictum sapien aliquam. Curabitur nulla ante, rhoncus sed rhoncus a, mattis ut turpis. In hac habitasse platea dictumst. Phasellus et eros dolor. Fusce elit lacus, pulvinar tristique molestie et, vestibulum et lectus. Nulla condimentum purus id sodales tincidunt. Mauris aliquam tellus vitae vehicula accumsan. Nulla pretium porttitor odio, in aliquam tortor feugiat a. Suspendisse non augue pretium, eleifend erat vitae, varius nulla. Mauris nec mi et ante iaculis lacinia placerat id urna. Nam congue commodo orci, nec pellentesque arcu consequat vitae."


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loader: LoadingController, private usuServ: UsuarioService,
    private utilServ: UtilsServiceProvider, private eventServ: EventoService) {
    this.evento = this.navParams.get('evento')
  }

  async ionViewWillEnter() {

    this.usuario = this.usuServ.usuario
    try {

      let resp: any = await this.eventServ.getEvento(this.evento._id).toPromise()
      if (resp) {
        this.evento = resp.data.evento
      }
    } catch (e) {
      console.log(e)
    }
  }



  
  
  

}
