import { UsuariosEnCategoriaPage } from './../usuarios-en-categoria/usuarios-en-categoria';
import { UtilsServiceProvider } from './../../providers/utils.service';
import { UsuarioService } from './../../providers/usuario.service';
import { Usuario } from './../../models/usuario.model';
import { Component } from '@angular/core';
import {  NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

/**
 * Generated class for the ModificarPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-modificar-password',
  templateUrl: 'modificar-password.html',
})
export class ModificarPasswordPage {

  formulario: FormGroup
  nuevaPassword: string = ''
  repetirPassword: string = ''
  usuario: Usuario

  constructor(public navCtrl: NavController, public navParams: NavParams, private usuServ: UsuarioService
    , private loadContr: LoadingController, private util : UtilsServiceProvider) {
    this.usuario = this.navParams.get('usuario')
    if(!this.usuario){
      this.usuario = this.usuServ.usuario
    }
    this.formulario = this.createFormGroup()
  }

  createFormGroup() {
    return new FormGroup({

      newpassword: new FormControl(null,[Validators.required, Validators.pattern('(?=.*?[a-z])(?=.*?[0-9]).{8,}')]),
      repeatpassword: new FormControl(null,[Validators.required, this.validarPassword.bind(this.formulario)], ),



    });
  }

  onSubmit() {
    let loader = this.loadContr.create({
      content: 'Cargando',
      spinner : 'circles'
    });
    loader.present()
    
    this.usuServ.modificarPassword({usuario: this.usuario, nuevaPassword: this.formulario.value.newpassword})
    .subscribe((resp)=>{
      loader.dismiss()
      this.util.dispararAlert('Éxito','Usuario modificado correctamente')
      if (this.usuario._id === this.usuServ.usuario._id){
        window.location.reload()
      }else{
        this.navCtrl.setRoot(UsuariosEnCategoriaPage)
      }

    },(err)=>{
      console.log(err)
      loader.dismiss()
      this.util.dispararAlert('Error','Ocurrió un error al modificar passowrd')
      
    })
  }

  validarPassword(arg: FormControl) : {[s: string]: boolean}{
    if(arg.root.value && arg.root.value.newpassword !== arg.value){
    
    return {'nameIsForbidden': true}
    }

    return null
  }
  
  mostrarUsuario(usuario: Usuario){
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta +' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' +usuario.apellido : etiqueta 
    etiqueta = etiqueta ==='' ? ` (${usuario.email})` : etiqueta
    return etiqueta
  }
}
