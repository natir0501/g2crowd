import { UsuarioService } from './../../providers/usuario.service';
import { Cuenta } from './../../models/cuenta.models';
import { SaldoMovimientosCategoriaPage } from './../Contabilidad/saldo-movimientos-categoria/saldo-movimientos-categoria';
import { MantenimientoCategoriaPage } from '../Backoffice/mantenimiento-categoria/mantenimiento-categoria';
import { CategoriaService } from './../../providers/categoria.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { UtilsServiceProvider } from '../../providers/utils.service';

/**
 * Generated class for the ListaCategoriasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-lista-categorias',
  templateUrl: 'lista-categorias.html',
})
export class ListaCategoriasPage {

  categorias: Categoria[] = [new Categoria()];


  constructor(public navCtrl: NavController, public navParams: NavParams, private usuServ: UsuarioService,
     public catService: CategoriaService, public utilServ: UtilsServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()

    this.catService.obtenerCategorias()
      .subscribe((resp) => {

        this.categorias = resp.data.categorias;



      },
        (err) => {
          console.log("Error obteniendo conceptos de caja", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los conceptos de caja")
        }, () => {
          loading.dismiss();
        })
  }

  delegadoInst(){
    return this.usuServ.usuario && this.usuServ.usuario.delegadoInstitucional
  }

  irAlta() {
    
    this.navCtrl.push(MantenimientoCategoriaPage)
  }

  modificar(categoria: Categoria) {
    
    this.navCtrl.push(MantenimientoCategoriaPage, { categoria })
  }

  


}
