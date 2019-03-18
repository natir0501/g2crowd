import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, NavController, NavParams } from 'ionic-angular';
import { Categoria } from '../../models/categoria.models';
import { Usuario } from '../../models/usuario.model';
import { CategoriaService } from '../../providers/categoria.service';
import { UsuarioService } from '../../providers/usuario.service';
import { UtilsServiceProvider } from '../../providers/utils.service';
import { Roles } from './../../models/enum.models';
import { Perfil } from './../../models/usuario.model';
import { UsuariosEnCategoriaPage } from './../usuarios-en-categoria/usuarios-en-categoria';

/**
 * Generated class for the ModificacionPeriflesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-modificacion-perifles',
  templateUrl: 'modificacion-perifles.html',
})
export class ModificacionPeriflesPage {

  categorias: Categoria[] = [];
  categoriasCuotas: Categoria[] = [];
  usuario: Usuario = new Usuario();
  roles = Object.keys(Roles).map(key => ({ 'id': key, 'value': Roles[key] }))
  rolesBack = []
  perfiles: any = {}
  array: any



  @ViewChild("form") formulario: NgForm


  constructor(public navCtrl: NavController, public usuarioServ: UsuarioService, public navParams: NavParams,
    private load: LoadingController, public categoriaServ: CategoriaService, public utilServ: UtilsServiceProvider) {


  }

  async ionViewWillEnter() {
    let loader = this.load.create({
      content: 'Cargando',
      spinner: 'circles'
    })
    loader.present()
    try {
      this.usuario = this.navParams.get('usuario')
      let categoriasData = await this.categoriaServ.obtenerCategorias().toPromise()
      this.categoriasCuotas = categoriasData.data.categorias

      let resp2 = await this.categoriaServ.obtenerRoles().toPromise()

      this.rolesBack = resp2.data.roles

      await this.cargoPerfiles(categoriasData)
      loader.dismiss()
    } catch (e) {
      console.log(e)
      loader.dismiss()
      this.utilServ.dispararAlert('Error', 'Ocurrión un error con el servidor')
    }
  }

  cargoPerfiles(resp: any) {
    this.categorias = resp.data.categorias

    this.categorias = resp.data.categorias
    for (let cat of this.categorias) {
      this.perfiles[cat._id] = []

    }

  }

  armoPerfiles() {

    let rolDelInst = this.rolesBack.filter((rol) => rol.codigo === 'DIN')[0]

    let perfiles = []
    let keys = Object.keys(this.perfiles)

    for (let key of keys) {
      if (this.perfiles[key].length > 0) {
        if (this.usuario.delegadoInstitucional) {
          this.perfiles[key].push(rolDelInst._id)
        }
        perfiles.push({
          'categoria': key,
          'roles': this.perfiles[key]
        })

      }
    }
    this.usuario.perfiles = perfiles


  }

  ionViewDidLoad() {


  }

  onSubmit() {
    let loader = this.load.create({
      content: 'Cargando',
      spinner: 'circles'
    })
    loader.present()
    this.armoPerfiles()


    this.usuarioServ.modificarPerfil(this.usuario)
      .subscribe(
        (resp) => {
          this.utilServ.dispararAlert("Listo!", "Usuario modificado correctamente.")
          this.navCtrl.setRoot(UsuariosEnCategoriaPage)
          loader.dismiss()
        },
        (err) => {
          console.log("Error modificando usuario", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al modificar usuario")
          loader.dismiss()
        }
      )

  }

  mostrarUsuario(usuario: Usuario) {
    let etiqueta: String = ''
    etiqueta = usuario.nombre ? etiqueta + ' ' + usuario.nombre : etiqueta
    etiqueta = usuario.apellido ? etiqueta + ' ' + usuario.apellido : etiqueta
    etiqueta = etiqueta === '' ? ` (${usuario.email})` : etiqueta
    return etiqueta
  }


  listarRol(perfil: Perfil): string {
    let nombreCat
    for (let cat of this.categorias) {
      if (perfil.categoria === cat._id) {
        nombreCat = cat.nombre
      }
    }
    let roles = []
    for (let rolId of perfil.roles) {
      for (let rol of this.rolesBack) {
        if (rolId === rol._id) {
          roles.push(rol.nombre)
        }
      }
    }
    let stringRoles = roles.join(', ')

    return `Categoría ${nombreCat}: ${stringRoles}.`
  }

}
