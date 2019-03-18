import { Component } from '@angular/core';
import {  LoadingController, NavController, NavParams } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { CategoriaService } from '../../providers/categoria.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { UsuarioService } from '../../providers/usuario.service';
import { Usuario } from '../../models/usuario.model';


/**
 * Generated class for the PlantelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-plantel',
  templateUrl: 'plantel.html',
})
export class PlantelPage {

  categoria: Categoria =  new Categoria();
  usuarios: Usuario[] = []


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public catService: CategoriaService, public utilServ: UtilsServiceProvider, private usuServ: UsuarioService,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()
    this.categoria._id = this.usuServ.usuario.perfiles[0].categoria

    this.catService.obtenerCategoria(this.categoria._id)
      .subscribe((resp) => {

        this.usuarios = resp.data.categoria.jugadores.filter(u => u.activo)
        this.categoria = resp.data.categoria



      },
        (err) => {
          console.log("Error al obtener usuarios", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los usuarios")
          loading.dismiss();
        }, () => {
          loading.dismiss();
        })
  }




  mostrarUsuario(usuario: Usuario){
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta +' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' +usuario.apellido : etiqueta 
    etiqueta = etiqueta ==='' ? ` (${usuario.email})` : etiqueta
    
    return etiqueta
  }
  habilitado(usuario: Usuario){
    return ! (this.debeEscolaridad(usuario) || this.debeFmedica(usuario) )
  }
  debeEscolaridad(usuario: Usuario){
    if(!this.categoria.requiereEscolaridad){
      return false;
    }
    if(!usuario.requiereExamen){
      return false
    }
    let anioUltExamen = usuario.fechaUltimoExamen? new Date(usuario.fechaUltimoExamen).getFullYear() : 0
    
    if(anioUltExamen + 1 >= new Date().getFullYear()){
      return false
    }
    return true
  }
  debeFmedica(usuario: Usuario){
   
    if(usuario.fechaVtoCarneSalud  >= Date.now() + (86400000 * 7)){
      return false
    }
    return true
  }


}
