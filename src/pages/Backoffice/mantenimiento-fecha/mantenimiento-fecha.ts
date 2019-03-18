import { UsuarioService } from './../../../providers/usuario.service';
import { MantenimientoCampeonatosPage } from './../../common/mantenimiento-campeonatos/mantenimiento-campeonatos';
import { Partido, Campeonato, Fecha, Lugar } from './../../../models/campeonato.model';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { UtilsServiceProvider } from '../../../providers/utils.service';
import { CampeonatoService } from '../../../providers/campeonato.service';
import { NgForm } from '@angular/forms';
import { Ruedas } from '../../../models/enum.models';


@Component({
  selector: 'page-mantenimiento-fecha',
  templateUrl: 'mantenimiento-fecha.html',
})
export class MantenimientoFechaPage {

  @ViewChild('form') form: NgForm

  campeonato: Campeonato = new Campeonato();
  fecha: Fecha = new Fecha();
  partido: Partido = new Partido();
  lugar: Lugar = new Lugar();
  fechaEncuentrotxt = `2019-01-04T02:01`;
  rueda = Object.keys(Ruedas).map(key => ({ 'id': key, 'value': Ruedas[key] }));

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public campServ: CampeonatoService,
    public utilServ: UtilsServiceProvider,
    public usuServ: UsuarioService) {
    this.fechaEncuentrotxt = this.utilServ.fechahoraToText(new Date())
  }

  ionViewDidLoad() {
    let fecha: Fecha = this.navParams.get('fecha')
    let camp: Campeonato = this.navParams.get('camp')
    this.fecha.rueda = 'R1'
    if (fecha) {
      this.fecha = fecha
      this.fechaEncuentrotxt = this.utilServ.fechahoraToText(new Date(fecha.fechaEncuentro))
    }
    if (camp) {
      this.campeonato = camp
    }
  }

  onSubmit() {
    this.fecha.fechaEncuentro = Date.parse(this.form.value.fechaEncuentro)
    if (this.fecha._id === '') {
      this.campServ.agregarFechaCamp(this.fecha, this.campeonato)
        .subscribe(
          (resp) => {
            this.utilServ.dispararAlert("Ok", "Fecha agregada correctamente.")
            let fecha = resp.data;
            if (resp.data === {}) {
              this.utilServ.dispararAlert("Error", "No se agregó. Ya existe el número de fecha")
            } else {
              let campeonato = this.campeonato
              campeonato.fechas.push(fecha);
              this.navCtrl.setRoot(MantenimientoCampeonatosPage, { campeonato })
            }
          },
          (err) => {
            this.utilServ.dispararAlert("Error", err.error.error)
            console.log(err);

          })
    } else {
      this.campServ.actualizarFecha(this.fecha).subscribe(
        (resp) => {
          this.utilServ.dispararAlert("Ok", "Fecha modificada correctamente.")
          let campeonato = this.campeonato
          this.navCtrl.setRoot(MantenimientoCampeonatosPage, { campeonato })
        },
        (err) => {
          this.utilServ.dispararAlert("Error", "err.error.error")
          console.log(err);
        })
    }
  }


}
