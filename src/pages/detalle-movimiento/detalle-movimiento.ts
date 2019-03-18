import { CuentaService } from './../../providers/cuenta.service';
import { SaldosJugadoresPage } from './../saldos-jugadores/saldos-jugadores';
import { SaldoMovimientosCategoriaPage } from './../Contabilidad/saldo-movimientos-categoria/saldo-movimientos-categoria';
import { CategoriaService } from './../../providers/categoria.service';
import { Categoria } from './../../models/categoria.models';
import { Movimiento, Cuenta } from './../../models/cuenta.models';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { UsuarioService } from '../../providers/usuario.service';
import { UtilsServiceProvider } from '../../providers/utils.service';


@Component({
  selector: 'page-detalle-movimiento',
  templateUrl: 'detalle-movimiento.html',
})
export class DetalleMovimientoPage {

  movimiento: Movimiento = new Movimiento()
  movVinculado: boolean
  categoria: Categoria = new Categoria()
  cuenta: Cuenta = new Cuenta()

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public alertCtr : AlertController, private cuentaServ : CuentaService,
    public utilServ: UtilsServiceProvider, private catService: CategoriaService,
    public usuServ: UsuarioService) {
  }

  async ionViewDidLoad() {
    try {
      let mov: Movimiento = this.navParams.get('mov')
      this.cuenta = this.navParams.get('cuenta')
      let resp: any = await this.catService.obtenerCategoria(this.usuServ.usuario.perfiles[0].categoria).toPromise()
    
      this.categoria = resp.data.categoria
      if (mov) {
        this.movimiento = mov
        if (mov.referencia != null) {
          this.movVinculado = true
        }
      } else {
        this.utilServ.dispararAlert("Upss!", "Ocurrió un error al cargar el movimiento")
      }
    } catch (e) {
      console.log(e)
      this.utilServ.dispararAlert("Upss!", "Ocurrió un error al cargar el movimiento")
    }
  }

  consultar(id: string) {
    console.log("Consultar vinculado");

  }

  puedoAnular() {
    if(this.movimiento.estado !=='Confirmado') return false
    if(this.usuServ.usuario.delegadoInstitucional) return true
    for (let u of this.categoria.tesoreros){
      if(u._id === this.usuServ.usuario._id){
        return true
      }
    }
    return false
  }
  anular() {
    const confirm = this.alertCtr.create({
      title: 'Confirmar anulación',
      message: 'Está seguro de que desea anular el movimiento?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            
          }
        },
        {
          text: 'Ok',
          handler: () => {
            console.log('Agree clicked', this.movimiento._id,this.cuenta);
            this.cuentaServ.anularMovimiento(this.cuenta._id, this.movimiento._id).subscribe((resp)=>{
              if(this.navParams.get('categoria')=== true){
                this.navCtrl.setRoot(SaldoMovimientosCategoriaPage)
                this.utilServ.dispararAlert('Ok','Pago anulado correctamente')
              }else{
                this.navCtrl.setRoot(SaldosJugadoresPage)
              }
            },(err)=>{
              this.utilServ.dispararAlert('Error','Error al anular el pago')
            })
          }
        }
      ]
    });
    confirm.present();
  }

}
