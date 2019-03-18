import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { CategoriaService } from '../../providers/categoria.service';
import { CuentaService } from '../../providers/cuenta.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { HomePage } from '../home/home';
import { Concepto, Cuenta } from './../../models/categoria.models';
import { Movimiento } from './../../models/cuenta.models';
import { Usuario } from './../../models/usuario.model';
import { ConceptoService } from './../../providers/concepto.service';
import { UsuarioService } from './../../providers/usuario.service';
import { CachedResourceLoader } from '@angular/platform-browser-dynamic/src/resource_loader/resource_loader_cache';


@Component({
  selector: 'page-registro-pago-cuota',
  templateUrl: 'registro-pago-cuota.html',
})
export class RegistroPagoCuotaPage {

  categoria: Categoria = new Categoria()
  cuentaCat: Cuenta = new Cuenta()
  cuentaJugador: Cuenta = new Cuenta()
  usuario: Usuario = new Usuario()
  usuarios: Usuario[] = [];
  concepto: Concepto = new Concepto()
  movimiento: Movimiento = new Movimiento()

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cuentaServ: CuentaService, public loadingCtrl: LoadingController,
    public utilServ: UtilsServiceProvider, public usuServ: UsuarioService,
    public catService: CategoriaService, public conceptoServe: ConceptoService) {
  }

  async ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present()
    try {
      this.usuario = this.usuServ.usuario

      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catService.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
        this.usuarios = this.categoria.jugadores.filter(jug => jug.activo === true)

        this.conceptoServe.obtenerConceptos()
          .subscribe((resp) => {
            let conceptos = resp.data.conceptosCaja;
            for (let c of conceptos) {
              if (c.nombre === "Pago de Cuota") {
                this.concepto = c
              }
            }
          }, (err) => {
            this.utilServ.dispararAlert("Upss", "Ocurrió un error al obtener los conceptos de caja")
          }, () => {
            loading.dismiss();
          })
      } else {
        this.utilServ.dispararAlert("Upss! :(", "Ocurrió un error al cargar los jugadores de la categoría. Volvé a intentar en unos minutos.")
        loading.dismiss();
        this.navCtrl.setRoot(HomePage)
      }

      this.movimiento.jugador = undefined
    } catch (e) {
      console.log(e)
      loading.dismiss()
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  onSubmit() {
    if (this.movimiento.comentario === '' || this.movimiento.comentario === undefined) {
      return this.utilServ.dispararAlert("Error", "Ingrese comentario")
    }
    this.movimiento.usuario = this.usuServ.usuario
    this.movimiento.concepto = this.concepto
    this.movimiento.jugador = !this.registraPagosDeTerceros() ? this.usuario : this.movimiento.jugador
    if (this.movimiento.jugador.categoriacuota.toString() !== this.usuServ.usuario.perfiles[0].categoria) {
      return this.utilServ.dispararAlert("Error", "Jugador no debe pagar en esta categoría")
    }


    this.cuentaServ.registrarPagoCuota(this.movimiento)
      .subscribe((resp) => {
        this.utilServ.dispararAlert("Listo!", "Pago registrado correctamente.")
        this.movimiento.comentario = ""
        this.movimiento.monto = 0
        this.movimiento.jugador = null


      }, (err) => {
        console.log(err);
        this.utilServ.dispararAlert("Error", "Error al procesar pago")

      })
  }

  getPlaceHolderText(){
    return this.registraPagosDeTerceros() ? 'Ej: Pagó mediante transferencia a mi cuenta bancaria' : 'Ej: Le transfería al tesorero / Pagué en efectivo en la práctica pasada'
  }

  registraPagosDeTerceros() {
    let usuario: Usuario = this.usuServ.usuario
    if (usuario) {
      if (usuario.delegadoInstitucional) return true
      for (let usu of this.categoria.tesoreros) {
        if (usu._id === usuario._id) {
          return true
        }
      }
    }
  }


}
