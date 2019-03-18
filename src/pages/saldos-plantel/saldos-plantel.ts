import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Usuario } from '../../models/usuario.model';
import { Categoria } from '../../models/categoria.models';
import { CategoriaService } from '../../providers/categoria.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { UsuarioService } from '../../providers/usuario.service';

/**
 * Generated class for the SaldosPlantelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-saldos-plantel',
  templateUrl: 'saldos-plantel.html',
})
export class SaldosPlantelPage {
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

    this.catService.obtenerSaldosCategoria(this.categoria._id)
      .subscribe((resp) => {

        this.usuarios = resp.data.jugadores
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

  exportarPDF(){
    let columnas = ['Jugador', 'Importe']
    let contenidoFilas = []
    for (let u of this.usuarios) {
      let fila = [this.mostrarUsuario(u), '$ '+ u.cuenta.saldo]
      contenidoFilas.push(fila)
    }
    this.utilServ.generarPDF(columnas, contenidoFilas, `Saldo Plantel`, 'v')
  }


  mostrarUsuario(usuario: Usuario){
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta +' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' +usuario.apellido : etiqueta 
    etiqueta = etiqueta ==='' ? ` (${usuario.email})` : etiqueta
    
    return etiqueta
  }
  

}
