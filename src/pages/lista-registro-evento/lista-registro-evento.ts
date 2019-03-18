import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { Evento } from '../../models/evento.models';
import { Usuario } from '../../models/usuario.model';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { EventoService } from './../../providers/evento.service';
import { ModificarComentarioPage } from './../modificar-comentario/modificar-comentario';

/**
 * Generated class for the ListaRegistroEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lista-registro-evento',
  templateUrl: 'lista-registro-evento.html',
})
export class ListaRegistroEventoPage {

  

  categoria: Categoria =  new Categoria();
  usuarios: Usuario[] = []
  evento : Evento = new Evento()


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public eventoService: EventoService, public utilServ: UtilsServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()
    this.evento = this.navParams.get('evento')
    this.eventoService.getEvento(this.evento._id).subscribe((resp)=>{
      this.evento = resp.data.evento

      this.usuarios = [
        ...this.evento.confirmados,
        ...this.evento.invitados,
        ...this.evento.noAsisten
      ]
      loading.dismiss()

    },(err)=>{
      console.log("Error al obtener datos de evento", err)
      this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los usuarios")
      loading.dismiss();
      
    })
    
  }

  comentar(usuario: Usuario){
    this.navCtrl.push(ModificarComentarioPage,{evento: this.evento,usuario})
    
  }

  

  mostrarUsuario(usuario: Usuario){
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta +' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' +usuario.apellido : etiqueta 
    etiqueta = etiqueta ==='' ? ` (${usuario.email})` : etiqueta
    return etiqueta
  }


}
