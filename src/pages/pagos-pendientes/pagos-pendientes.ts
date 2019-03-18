import { CategoriaService } from './../../providers/categoria.service';
import { UsuarioService } from './../../providers/usuario.service';
import { CuentaService } from './../../providers/cuenta.service';
import { Cuenta, Movimiento } from './../../models/cuenta.models';
import { Categoria } from './../../models/categoria.models';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { DetallePagoPage } from '../detalle-pago/detalle-pago';

/**
 * Generated class for the PagosPendientesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pagos-pendientes',
  templateUrl: 'pagos-pendientes.html',
})
export class PagosPendientesPage {

  movimientos: Movimiento[] = [];
  cuenta: Cuenta = new Cuenta();
  categoria: Categoria = new Categoria();

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController, public utilServ: UtilsServiceProvider,
    public cuentaServ: CuentaService, public usuServ: UsuarioService,
    public catService: CategoriaService) {
  }

  async ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()
    try {
      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catService.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
      }

      this.cuenta = this.categoria.cuenta

      this.cuentaServ.obtenerMovimientosPendientes(this.cuenta._id)
        .subscribe((resp) => {
          this.movimientos = resp.data.movimientos;
       

          if (this.movimientos.length == 0) {
            this.utilServ.dispararAlert("Estás al día", "Parece que no hay movimientos para aprobar :)")
          }
        },
          (err) => {
            console.log("Error al cargar los movimientos", err)
            this.utilServ.dispararAlert("Upss!", "No pudimos cargar los movimientos. Volve a intentarlo en unos minutos.")
          }, () => {
            loading.dismiss();
          })
    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  consultar(mov: Movimiento) {

    this.navCtrl.push((DetallePagoPage), { mov })
  }

}
