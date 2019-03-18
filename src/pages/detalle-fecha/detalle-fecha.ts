import { Categoria } from './../../models/categoria.models';
import { CategoriaService } from './../../providers/categoria.service';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Campeonato, Fecha, Partido, Lugar } from '../../models/campeonato.model';
import { Ruedas } from '../../models/enum.models';
import { CampeonatoService } from '../../providers/campeonato.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { UsuarioService } from '../../providers/usuario.service';
import { Usuario } from '../../models/usuario.model';

/**
 * Generated class for the DetalleFechaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-detalle-fecha',
  templateUrl: 'detalle-fecha.html',
})
export class DetalleFechaPage {

  campeonato: Campeonato = new Campeonato();
  categoria: Categoria = new Categoria()
  fecha: Fecha = new Fecha();
  fechaEncuentrotxt = `2019-01-04T02:01`;
  rueda = Object.keys(Ruedas).map(key => ({ 'id': key, 'value': Ruedas[key] }));

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public campServ: CampeonatoService,
    public utilServ: UtilsServiceProvider,
    private categoriaServ: CategoriaService,
    public loader: LoadingController,
    public usuServ: UsuarioService) {
  }

  async ionViewDidLoad() {

    try {
      let f: Fecha = this.navParams.get('fecha')
      if (f) {
        this.fecha = f
      }
      let categoriaId = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.categoriaServ.obtenerCategoria(categoriaId).toPromise()
      if (dataUsuarios) {
        this.categoria = dataUsuarios.data.categoria
      }
    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  diayhora(): string {
    return new Date(this.fecha.fechaEncuentro).toLocaleString()
  }

  nuevoEvento() {
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()
    let categoriaId = this.usuServ.usuario.perfiles[0].categoria
    this.campServ.crearEvento(this.fecha, categoriaId).subscribe((resp) => {
      this.utilServ.dispararAlert('Éxito', 'Evento ha sido creado, revisá la agenda')
      loader.dismiss()
    }, (err) => {
      this.utilServ.dispararAlert('Error', 'No se ha podido crear el evento')
      loader.dismiss()
    })
  }
  puedoCrearEvento() {
    return this.fecha.fechaEncuentro > Date.now() && this.esDelegado()
  }
  esDelegado() {
    let usuario: Usuario = this.usuServ.usuario
    if (usuario.delegadoInstitucional) return true
    for (let usu of this.categoria.delegados) {
      if (usu._id === usuario._id) {
        return true
      }
    }
  }
}
