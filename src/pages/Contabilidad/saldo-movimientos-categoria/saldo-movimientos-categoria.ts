import { ConceptoService } from './../../../providers/concepto.service';
import { DetalleMovimientoPage } from './../../detalle-movimiento/detalle-movimiento';
import { Usuario } from './../../../models/usuario.model';
import { UtilsServiceProvider } from './../../../providers/utils.service';
import { CuentaService } from './../../../providers/cuenta.service';
import { Cuenta, Movimiento } from './../../../models/cuenta.models';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { CategoriaService } from '../../../providers/categoria.service';
import { Categoria } from '../../../models/categoria.models';
import { UsuarioService } from '../../../providers/usuario.service';
import { ConceptoCaja } from '../../../models/concepto.models';
import { Tipos } from '../../../models/enum.models';


@Component({
  selector: 'page-saldo-movimientos-categoria',
  templateUrl: 'saldo-movimientos-categoria.html',
})
export class SaldoMovimientosCategoriaPage {

  cuenta: Cuenta = new Cuenta();
  movimientos: Movimiento[] = []
  mov: Movimiento = new Movimiento;
  categoria: Categoria = new Categoria()
  usuarios: Usuario[] = [];
  btnMovs: string = '+';
  verMovs: boolean = false;
  btnFiltros: string = '+';
  verFiltros: boolean = false;
  concepto: ConceptoCaja = new ConceptoCaja();
  listaConceptos: ConceptoCaja[] = [];
  tipo = Object.keys(Tipos).map(key => ({ 'id': key, 'value': Tipos[key] }));
  fDesdeTxt: string = 'aaaa-mm-dd'
  fHastaTxt: string = 'aaaa-mm-dd'
  fechaD: number
  fechaH: number
  tipoSeleccionado: string = ''



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public cuentaServ: CuentaService, public loadingCtrl: LoadingController
    , public utilServ: UtilsServiceProvider, public catService: CategoriaService,
    public usuServ: UsuarioService, public conceptoServ: ConceptoService) {
  }

  async ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present();
    try {
      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catService.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
      }
      this.cuenta = this.categoria.cuenta

      let conc = await this.conceptoServ.obtenerConceptos().toPromise()

      if (conc) {
        this.listaConceptos = conc.data.conceptosCaja;
      }

      this.cuentaServ.obtenerMovimientos(this.cuenta._id)
        .subscribe((resp) => {
          this.cuenta.movimientos = resp.data.movimientos;
          this.movimientos = resp.data.movimientos;

        },
          (err) => {
            console.log("Error obteniendo movimientos", err)
            this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los movimientos")
            loading.dismiss();
          }, () => {
            loading.dismiss();
          })
    } catch (e) {
      console.log(e)
      loading.dismiss()
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  verDetalle(mov, cuenta) {
    this.navCtrl.push((DetalleMovimientoPage), { mov, cuenta, categoria: true })
  }

  exportarPDF() {

    let columnas = ['Fecha', 'Importe', 'Tipo', 'Concepto', 'Estado', 'Usuario', 'Comentario']
    let contenidoFilas = []
    this.movimientos = this.cuenta.movimientos
    for (let m of this.movimientos) {
      let fila = [new Date(m.fecha).toLocaleDateString(), m.monto, m.tipo, m.concepto, m.estado, m.usuario, m.comentario ? m.comentario.substr(0, 20) + '...' : '']
      contenidoFilas.push(fila)
    }
    this.utilServ.generarPDF(columnas, contenidoFilas, `Movimientos`, 'h')
  }
  reset() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner: 'circles'
    });
    loading.present();
    this.tipoSeleccionado = ''
    this.concepto = new ConceptoCaja();
    this.fDesdeTxt = 'aaaa-mm-dd'
    this.fHastaTxt = 'aaaa-mm-dd'

    this.cuentaServ.obtenerMovimientos(this.cuenta._id)
      .subscribe((resp) => {
        this.cuenta.movimientos = resp.data.movimientos;
        this.movimientos = resp.data.movimientos;
        loading.dismiss()

      },
        (err) => {
          console.log("Error obteniendo movimientos", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los movimientos")
          loading.dismiss();
        })

  }
  toggle(lista: string) {
    if (lista === 'verMovs') {
      if (!this.verMovs) {
        this.btnMovs = '-'
      } else {
        this.btnMovs = '+'
      }
      this.verMovs = !this.verMovs
    }
    if (lista === 'filtros') {
      if (!this.verFiltros) {
        this.btnFiltros = '-'
      } else {
        this.btnFiltros = '+'
      }
      this.verFiltros = !this.verFiltros

    }
  }

  filtrar() {
    //Si no apliqué ningún filtro, ya muestro los movimientos y oculto sección filtros.
    if (this.noHayFiltros()) {

      this.btnFiltros = '+'
      this.verFiltros = !this.verFiltros
      this.toggle('verMovs');
      this.movimientos = this.cuenta.movimientos
    } else {
      if (this.validoFechas()) {


        let loading = this.loadingCtrl.create({
          content: 'Cargando',
          spinner: 'circles'
        });
        loading.present()


        this.cuentaServ.filtrarMovimientos(this.cuenta._id,
          this.tipoSeleccionado, this.concepto._id, this.fechaD, this.fechaH).subscribe((resp) => {
            this.cuenta.movimientos = resp.data.movimientos;


            loading.dismiss();
          }, (err) => {
            console.log(err);
            loading.dismiss();
            this.utilServ.dispararAlert("Upss!", "Ocurrió un error al obtener los movimientos. Intentá nuevamente en unos minutos.")
          })

      }
    }
  }

  noHayFiltros(): boolean {
    return this.tipoSeleccionado === '' && this.concepto._id === '' && this.fDesdeTxt === 'aaaa-mm-dd' && this.fHastaTxt === 'aaaa-mm-dd';
  }

  validoFechas(): boolean {

    let hayFecDesde: boolean = this.fDesdeTxt.trim() !== 'aaaa-mm-dd'
    let hayFecHasta: boolean = this.fHastaTxt.trim() !== 'aaaa-mm-dd'

    if (!hayFecDesde && !hayFecHasta) return true
    if (hayFecDesde && hayFecHasta) {
      this.fechaD = Date.parse(this.fDesdeTxt) + 86400000
      this.fechaH = Date.parse(this.fHastaTxt) + 86400000
      let fecha = new Date(this.fechaH)
      fecha.setHours(24)
      this.fechaH = fecha.valueOf()
      fecha = new Date(this.fechaD)
      fecha.setHours(0,1)
      this.fechaD = fecha.valueOf()
      if (this.fechaH < this.fechaD) {
        this.utilServ.dispararAlert('Error', "Fecha hasta no puede ser anterior a la fecha desde.")
        return false
      }
      let fechaLimite = new Date()
      fechaLimite.setHours(24)
      if (this.fechaH > fechaLimite.valueOf()) {
        this.utilServ.dispararAlert('Error', "Fecha hasta no puede ser posterior a la fecha de hoy.")
        return false
      }
      return true
    }
    this.utilServ.dispararAlert('Error', "Si ingresa una fecha, debe ingresar la otra")
    return false
  }
}