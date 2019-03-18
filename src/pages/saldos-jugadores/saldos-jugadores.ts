import { Cuenta } from './../../models/cuenta.models';
import { CuentaService } from './../../providers/cuenta.service';
import { CategoriaService } from './../../providers/categoria.service';
import { UsuarioService } from './../../providers/usuario.service';
import { UtilsServiceProvider } from './../../providers/utils.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Categoria, Movimiento } from '../../models/categoria.models';
import { Usuario } from '../../models/usuario.model';
import { HomePage } from '../home/home';
import { DetalleMovimientoPage } from '../detalle-movimiento/detalle-movimiento';


@Component({
  selector: 'page-saldos-jugadores',
  templateUrl: 'saldos-jugadores.html',
})
export class SaldosJugadoresPage {

  categoria: Categoria = new Categoria()
  jugador: Usuario = new Usuario()
  cuentaJugador: Cuenta
  usuarios: Usuario[] = [];
  movimiento: Movimiento = new Movimiento()
  movimientos: Movimiento[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public utilServ: UtilsServiceProvider, private loadingCtrl: LoadingController,
    public usuServ: UsuarioService, public catServ: CategoriaService,
    public cuentaServ: CuentaService) {
  }

  async ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()
    try {
      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catServ.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
        this.usuarios = this.categoria.jugadores.filter(jug => jug.activo === true && jug.categoriacuota.toString() === this.categoria._id)
        loading.dismiss();
      } else {
        this.utilServ.dispararAlert("Upss! :(", "Ocurrió un error al cargar los jugadores de la categoría. Volvé a intentar en unos minutos.")
        loading.dismiss();
        this.navCtrl.setRoot(HomePage)
      }
    } catch (e) {
      loading.dismiss()
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  async consultar(_id: string) {
    try {
      if (_id != null) {
        let cuenta = await this.cuentaServ.obtenerCuenta(_id).toPromise()
        if (cuenta) {
          this.cuentaJugador = cuenta.data.cuenta
          this.cuentaServ.obtenerMovimientos(this.cuentaJugador._id)
            .subscribe((resp) => {
              this.cuentaJugador.movimientos = resp.data.movimientos;
            },
              (err) => {
                console.log("Error obteniendo movimientos", err)
                this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los movimientos")
              })
        } else {
          this.utilServ.dispararAlert("Upss! :(", "Ocurrió un error al obtener los datos de la cuenta.")
        }
      } else {
        this.utilServ.dispararAlert("Upss! :(", "Seleccioná un jugador para consultar.")
      }
    } catch (e) {
      console.log("Error: ", e);
      this.utilServ.dispararAlert("Upss! :(", "Ocurrió un error al obtener los datos de la cuenta.")
    }

  }

  verDetalle(mov,cuentaJugador) {
    this.navCtrl.push((DetalleMovimientoPage), { mov, cuenta: cuentaJugador })
  }

  seleccionado(data) {
    this.consultar(data.cuenta)
  }
}
