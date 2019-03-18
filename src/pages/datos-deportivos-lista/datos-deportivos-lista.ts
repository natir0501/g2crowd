import { UtilsServiceProvider } from './../../providers/utils.service';
import { DetalleComentarioPage } from './../detalle-comentario/detalle-comentario';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Evento } from '../../models/evento.models';
import { Categoria } from '../../models/categoria.models';
import { EventoService } from '../../providers/evento.service';
import { UsuarioService } from '../../providers/usuario.service';
import { CategoriaService } from '../../providers/categoria.service';
import { ModificarEventoPage } from '../modificar-evento/modificar-evento';
import { DetallesEventoPage } from '../detalles-evento/detalles-evento';
import { Usuario } from '../../models/usuario.model';
import { ListaRegistroEventoPage } from '../lista-registro-evento/lista-registro-evento';

/**
 * Generated class for the DatosDeportivosListaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-datos-deportivos-lista',
  templateUrl: 'datos-deportivos-lista.html',
})
export class DatosDeportivosListaPage {

  eventos: Evento[] = []
  eventosDelDia: Evento[] = []
  currentEvents = []
  fechaSeleccionada: Date = new Date()
  categoria: Categoria = new Categoria()

  usuario: Usuario

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventoServ: EventoService, private utilServ: UtilsServiceProvider
    , private usuServ: UsuarioService, private categoriaServ: CategoriaService) {
    this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
    this.usuario = this.usuServ.usuario
  }

  async ionViewDidLoad() {

    try {
      await this.cargarEventos(new Date().getFullYear(), new Date().getMonth())
      this.eventosDelDia = this.eventos.filter((evt) => new Date(evt.fecha).getDate() === new Date().getDate())
    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }


  detalles(evento: Evento) {
    this.navCtrl.push(DetalleComentarioPage, { evento })
  }

  onDateSelected(data: any) {
    this.fechaSeleccionada = new Date(data.year, data.month, data.date)
    this.eventosDelDia = this.eventos.filter((evt) => new Date(evt.fecha).getDate() === data.date)
  }

  onMonthSelect(data: any) {
    this.cargarEventos(data.year, data.month)
    this.eventosDelDia = []
  }


  async cargarEventos(year: number, mes: number) {
    let fechaInicio = new Date(year, mes, 0)
    let fechaFin = new Date(year, mes + 1, 1)
    try {
      let resp: any = await this.eventoServ.obtenerEventos(fechaInicio.valueOf(), fechaFin.valueOf(), this.usuario._id).toPromise()
      if (resp) {
        this.eventos = resp.data.eventos
        this.currentEvents = this.eventos.map(evt => ({
          year: new Date(evt.fecha).getFullYear(),
          month: new Date(evt.fecha).getMonth(),
          date: new Date(evt.fecha).getDate()
        })
        )

      }

    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }

  }





}
