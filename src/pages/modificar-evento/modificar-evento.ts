import { ListaEventosPage } from './../lista-eventos/lista-eventos';
import { CategoriaService } from './../../providers/categoria.service';
import { Categoria } from './../../models/categoria.models';
import { EventoService } from './../../providers/evento.service';
import { UtilsServiceProvider } from './../../providers/utils.service';
import { TipoEvento } from './../../models/tipo.evento.models';
import { NgForm } from '@angular/forms';
import { Evento } from './../../models/evento.models';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, Alert, AlertController, Platform } from 'ionic-angular';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../providers/usuario.service';
import * as _ from 'lodash';

/**
 * Generated class for the ModificarEventoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-modificar-evento',
  templateUrl: 'modificar-evento.html',
})
export class ModificarEventoPage {

  evento: Evento = new Evento()
  @ViewChild('form') form: NgForm
  tiposEvento: TipoEvento[] = []
  btnUsuario = '+'
  btnInvitados = '+'
  verUsuarios = false
  verInvitados = false
  usuarios: Usuario[] = []
  diahoratxt = `2019-01-04T02:01`
  categoria: Categoria = new Categoria()
  notificar: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private utilService: UtilsServiceProvider, private loader: LoadingController,
    private platform : Platform,
    private eventoService: EventoService, private usuServ: UsuarioService, private catService: CategoriaService,
    private alertCont: AlertController) {


  }

  async ionViewDidLoad() {
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    try {



      loader.present()

      this.categoria._id = this.usuServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catService.obtenerCategoria(this.categoria._id).toPromise()
      if (dataUsuarios) {
        this.usuarios = _.uniqBy([...dataUsuarios.data.categoria.delegados,
        ...dataUsuarios.data.categoria.tesoreros,
        ...dataUsuarios.data.categoria.dts,
        ...dataUsuarios.data.categoria.jugadores,
        ], '_id')
        this.usuarios = this.usuarios.filter((u)=> u.activo)
        this.categoria = dataUsuarios.data.categoria
        this.evento.categoria = this.categoria
      }
      let dataTipo: any = await this.eventoService.obtenerTipoEventos().toPromise()
      this.tiposEvento = dataTipo.data.tipoEventos


      if (!this.navParams.get('evento')) {
        this.diahoratxt = this.utilService.fechahoraToText(this.navParams.get('fecha'))
        this.evento.tipoEvento = this.tiposEvento[0]
     
      } else {
        this.evento = {...this.navParams.get('evento')}
        this.diahoratxt = this.utilService.fechahoraToText(new Date(this.evento.fecha))
        for (let tipo of this.tiposEvento) {
         
          if (tipo._id === this.evento.tipoEvento._id) {
            this.evento.tipoEvento = tipo
          
          }

        }
      
        
        let invitadosIds: any[] = [
          ...this.evento.invitados,
          ...this.evento.confirmados,
          ...this.evento.noAsisten]
        this.evento.invitados = []
        
        for (let usu of this.usuarios) {
          if (invitadosIds.indexOf(usu._id) > -1) {
            this.evento.invitados.push(usu)
          }
        }

        this.usuarios = _.differenceBy(this.usuarios, this.evento.invitados, '_id')

      }





      loader.dismiss()
    } catch (e) {
      console.log(e)
      loader.dismiss()
    }


  }

  agregarTodos() {
    this.evento.invitados = [
      ...this.evento.invitados,
      ...this.usuarios
    ]
    this.usuarios = []
  }

  quitarTodos() {
    this.usuarios = [
      ...this.usuarios,
      ...this.evento.invitados
    ]
    this.evento.invitados = []
  }

  agregar(u: Usuario) {
    
    this.usuarios = this.usuarios.filter((usu) => usu._id !== u._id )
    this.evento.invitados.push(u)
    
  }

  quitar(u: Usuario) {
    this.evento.invitados = this.evento.invitados.filter((usu) => usu._id !== u._id )
    this.usuarios.push(u)
  }

  onSubmit() {
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()
    this.evento.fecha = Date.parse(this.form.value.diahora.replace(/-/g,'/').replace('T',' '))

    if (this.evento._id === '') {
      this.eventoService.altaEvento(this.evento).subscribe((resp) => {
        loader.dismiss()
        this.utilService.dispararAlert("Éxito", "Evento creado correctamente")
        this.navCtrl.setRoot(ListaEventosPage)
      }, (err) => {
        loader.dismiss()
        this.utilService.dispararAlert("Error", "Se ha producido un error al crear evento")
      })
    } else {
      this.eventoService.modificarEvento(this.evento, this.notificar).subscribe(
        (resp) => {
          loader.dismiss()
          this.utilService.dispararAlert("Éxito", "Evento modificado correctamente")
          this.navCtrl.setRoot(ListaEventosPage)
        }, (err) => {
          loader.dismiss()
          this.utilService.dispararAlert("Error", "Se ha producido un error al modificar evento")
        }
      )

    }

  }

  toggle(lista: string) {
    if (lista === 'usuarios') {
      if (!this.verUsuarios) {
        this.btnUsuario = '-'
      } else {
        this.btnUsuario = '+'
      }
      this.verUsuarios = !this.verUsuarios
    } else {
      if (!this.verInvitados) {
        this.btnInvitados = '-'
      } else {
        this.btnInvitados = '+'
      }
      this.verInvitados = !this.verInvitados
    }
  }
  descUsu(usu: Usuario) {
    if (usu.nombre) {
      return usu.nombre + ' ' + usu.apellido
    }
    return usu.email
  }

  validarForm(): boolean {
    if (this.evento.invitados.length === 0) return false
    if (Date.parse(this.form.value.diahora) <= Date.now()) return false
    return true
  }

  nopuedeCancelar(): boolean {
    return Date.parse(this.form.value.diahora) <= Date.now()
  }
  confirmarCancelacion() {
    let alert = this.alertCont.create({
      title: 'Confirmar cancelación',
      message: '¿Está seguro que desea borrar el evento?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Sí',
          handler: () => {
            this.cancelarEvento()
          }
        }
      ]
    });
    alert.present();
  }

  cancelarEvento() {
    let loader = this.loader.create({
      content: 'Cargando...',
      spinner: 'circles'

    })
    loader.present()
    this.eventoService.cancelarEvento(this.evento).subscribe(
      (resp) => {
        loader.dismiss()
        this.utilService.dispararAlert("Éxito", "Evento borrado correctamente")
        this.navCtrl.setRoot(ListaEventosPage)
      }, (err) => {
        loader.dismiss()
        this.utilService.dispararAlert("Error", "Se ha producido un error al borrar evento")
      }
    )
  }
  goBack(){
    this.navCtrl.setRoot(ListaEventosPage)
     
  }
  mobile(): boolean{
    return this.platform.is('mobile')
  }

}


