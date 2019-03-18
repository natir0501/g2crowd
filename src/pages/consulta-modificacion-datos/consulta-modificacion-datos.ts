import { ModificacionDatosPage } from './../modificacion-datos/modificacion-datos';
import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { Usuario } from '../../models/usuario.model';
import { CategoriaService } from '../../providers/categoria.service';
import { MenuService } from '../../providers/menu.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { UsuarioService } from '../../providers/usuario.service';
import * as _ from 'lodash';

/**
 * Generated class for the ConsultaModificacionDatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-consulta-modificacion-datos',
  templateUrl: 'consulta-modificacion-datos.html',
})
export class ConsultaModificacionDatosPage {

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

        this.usuarios = _.uniqBy( [...resp.data.categoria.delegados,
          ...resp.data.categoria.tesoreros,
          ...resp.data.categoria.dts,
          ...resp.data.categoria.jugadores,
        ], '_id')
        this.usuarios = this.usuarios.filter((u)=> u._id !== this.usuServ.usuario._id && u.activo)
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



  modificar(usuario: Usuario) {
    
    this.navCtrl.push(ModificacionDatosPage, { usuario, delegado: true })
  }

  

  mostrarUsuario(usuario: Usuario){
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta +' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' +usuario.apellido : etiqueta 
    etiqueta = etiqueta ==='' ? ` (${usuario.email})` : etiqueta
    return etiqueta
  }


}
