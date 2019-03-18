import { AltaConceptosDeCajaPage } from './../alta-conceptos-de-caja/alta-conceptos-de-caja';
import { ConceptoCaja } from './../../../models/concepto.models';
import { ConceptoService } from './../../../providers/concepto.service';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { UtilsServiceProvider } from '../../../providers/utils.service';
import { Component } from '@angular/core';



@Component({
  selector: 'page-conceptos-de-caja',
  templateUrl: 'conceptos-de-caja.html',
})
export class ConceptosDeCajaPage {

  conceptos: ConceptoCaja[] = [];


  constructor(public navCtrl: NavController, public navParams: NavParams
    , public conceptoServ: ConceptoService, public utilServ: UtilsServiceProvider,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create({
      content: 'Cargando',
      spinner : 'circles'
    });
    loading.present()
  
    this.conceptoServ.obtenerConceptos()
      .subscribe((resp) => {
        this.conceptos = resp.data.conceptosCaja;
      },
        (err) => {
          console.log("Error obteniendo conceptos de caja", err)
          this.utilServ.dispararAlert("Error", "Ocurrió un error al obtener los conceptos de caja")
        },()=>{
          loading.dismiss();
        })
  }

 
  irAlta(){
    this.navCtrl.push(AltaConceptosDeCajaPage)
  }

  modificarConcepto(concepto: ConceptoCaja) {
    this.navCtrl.push(AltaConceptosDeCajaPage, {concepto})
  }


}
