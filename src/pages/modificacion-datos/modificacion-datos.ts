import { CategoriaService } from './../../providers/categoria.service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Posiciones } from '../../models/enum.models';
import { UsuarioService } from '../../providers/usuario.service';
import { UtilsServiceProvider } from '../../providers/utils.service';

/**
 * Generated class for the ModificacionDatosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-modificacion-datos',
  templateUrl: 'modificacion-datos.html',
})
export class ModificacionDatosPage {

  @ViewChild('form') form: NgForm

  usuario: Usuario = new Usuario()
  fmedicaVigente: boolean = false
  fechaVtoTxt: string = '2020-01-01'
  fechaNacTxt: string = '1990-01-01'
  fexamenTxt: string = '2018-01-01'
  delegado: boolean = false
 
  requiereCategoria: boolean = false

  posiciones = Object.keys(Posiciones).map(key => ({ 'id': key, 'value': Posiciones[key] }))
  posicionesElegidas: string[] = ['GK'];


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private usuarioServ: UsuarioService,
    private catServ: CategoriaService,
    private util: UtilsServiceProvider) {

  }

  async ngOnInit() {
    try {

      let usu = this.navParams.get('usuario')
      this.delegado = this.navParams.get('delegado')
      let catId = this.usuarioServ.usuario.perfiles[0].categoria
      let dataUsuarios: any = await this.catServ.obtenerCategoria(catId).toPromise()
      if (dataUsuarios) {
        this.requiereCategoria = dataUsuarios.data.categoria.requiereEscolaridad
      }

      if (usu) {
        this.usuario = usu
        this.usuario.perfiles = usu.perfiles
      } else {
        this.usuario = this.usuarioServ.usuario

      }
      this.fechaNacTxt = this.util.fechaToText(new Date(this.usuario.fechaNacimiento))
      console.log(this.fechaNacTxt)
      this.fexamenTxt = this.util.fechaToText(new Date(this.usuario.fechaUltimoExamen))
      console.log(this.fexamenTxt)
      if (this.usuario.fechaVtoCarneSalud > 0) {
        this.fmedicaVigente = true
        this.fechaVtoTxt = this.util.fechaToText(new Date(this.usuario.fechaVtoCarneSalud))
      }

    } catch (e) {
      console.log(e)
    }
  }



  onSubmit() {

    if (this.validoUsuario()) {
      this.usuario.password = 'n'

      this.usuarioServ.actualizarUsuario(this.usuario).subscribe((resp) => {
        this.util.dispararAlert('Éxito', "Actualizado correctamente")
        this.usuario = resp.data
        if (!this.delegado) {
          this.usuarioServ.usuario = resp.data

        }

      }, (err) => {
        this.util.dispararAlert('Error', "Error al actualizar")
        console.log(err)
      })
    }

  }

  validoUsuario(): boolean {


    this.usuario.fechaNacimiento = Date.parse(this.fechaNacTxt) + 86400000
    if (this.usuario.fechaNacimiento >= Date.now()) {
      this.util.dispararAlert('Fecha de Nacimiento', "Fecha de nacimiento inválida")
      return false
    }
    this.usuario.fechaUltimoExamen = Date.parse(this.fexamenTxt) + 86400000
    if(this.delegado){
      if (this.usuario.fechaUltimoExamen > Date.now()) {
        this.util.dispararAlert('Fecha de escolaridad', "Fecha de escolaridad inválida")
        return false
      }
    }
    if(!this.fmedicaVigente){
      this.usuario.fechaVtoCarneSalud = new Date('2018-01-02').valueOf()
      return true
    }  
    if (this.fmedicaVigente && Date.parse(this.fechaVtoTxt) <= Date.now()) {
      this.util.dispararAlert('F/Médica - C/ Salud', "Fecha de vencimiento inválida")
      return false
    }
    this.usuario.fechaVtoCarneSalud = Date.parse(this.fechaVtoTxt) + 86400000
    return true
  }

}
