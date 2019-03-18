import { CategoriaService } from './../../providers/categoria.service';
import { Categoria } from './../../models/categoria.models';
import { PagosPendientesPage } from './../pagos-pendientes/pagos-pendientes';
import { UsuarioService } from './../../providers/usuario.service';
import { UtilsServiceProvider } from './../../providers/utils.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Movimiento, Cuenta } from '../../models/cuenta.models';
import { CuentaService } from '../../providers/cuenta.service';

/**
 * Generated class for the DetallePagoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalle-pago',
  templateUrl: 'detalle-pago.html',
})
export class DetallePagoPage {

  movimiento: Movimiento = new Movimiento()
  cuenta: Cuenta = new Cuenta();
  categoria: Categoria = new Categoria();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilServ: UtilsServiceProvider, public usuServ: UsuarioService,
    private loader: LoadingController, public cuentaServ: CuentaService,
    public catService: CategoriaService) {
  }

  async ionViewDidLoad() {
    try {

      let mov: Movimiento = this.navParams.get('mov')
      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catService.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
      }
      this.cuenta = this.categoria.cuenta

      if (mov) {
        this.movimiento = mov

      } else {
        this.utilServ.dispararAlert("Upss!", "Ocurrió un error al cargar el movimiento")
      }
    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  confirmar() {
    
    if (this.movimiento.comentario_tes === undefined || this.movimiento.comentario_tes === '') {
      return this.utilServ.dispararAlert('Error', "Ingrese comentario")
    }
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()

    this.cuentaServ.confirmarPago(this.movimiento, this.categoria._id)
      .subscribe((resp) => {
        loader.dismiss()
        if (resp.data.confirmado) {
          this.utilServ.dispararAlert('Ok', "El pagó se confirmó correctamente.")
          this.navCtrl.setRoot(PagosPendientesPage)
        }
      }, (err) => {
        console.log(err)
        loader.dismiss()
        this.utilServ.dispararAlert('Upss', "Ocurrió un error al confirmar la transacción. Intentá de nuevo en unos minutos")
      })
  }

  rechazar() {
    if (this.movimiento.comentario_tes === undefined || this.movimiento.comentario_tes === '') {
      return this.utilServ.dispararAlert('Error', "Ingrese comentario")
    }
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()

    this.cuentaServ.rechazarPago(this.movimiento, this.cuenta._id)
      .subscribe((resp) => {
        loader.dismiss()
        if (resp.data.movimiento) {
          this.utilServ.dispararAlert('Ok', "El pagó se rechazó correctamente.")
          this.navCtrl.setRoot(PagosPendientesPage)
        }
      }, (err) => {
        console.log(err)
        loader.dismiss()
        this.utilServ.dispararAlert('Upss', "Ocurrió un error al rechazar el pago. Intentá de nuevo en unos minutos")
      })
  }

}
