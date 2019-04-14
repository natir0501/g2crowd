import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Club } from './../../../models/club.models'
import { NgForm, NgControl, FormControl } from '@angular/forms';
import { Deportes } from '../../../models/enum.models';
import { Colores } from '../../../models/enum.models';
import { ClubService } from './../../../providers/club.service';
import { HttpClient } from '@angular/common/http';
import { UtilsServiceProvider } from '../../../providers/utils.service';
import { FirebaseApp } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the RegistroClubPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-registro-club',
  templateUrl: 'registro-club.html',
})
export class RegistroClubPage {

  @ViewChild('registroClubForm') registroClubForm: NgForm
  club: Club = new Club()
  deportes = Object.keys(Deportes).map(key => ({ 'id': key, 'value': Deportes[key] }))
  colores = Object.keys(Colores).map(key => ({ 'id': key, 'value': Colores[key] }))
  file: File;
  image: string | ArrayBuffer;
  storage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private clubServ: ClubService,
    private http: HttpClient,
    private toast: ToastController,
    private util: UtilsServiceProvider,
    private app: FirebaseApp) {
    this.storage = app.storage();
  }

  changeListener($event): void {
    this.file = $event.target.files[0];
    this.readThis($event.target);

  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;

    }
    myReader.readAsDataURL(file);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistroClubPage');
  }

  onSubmit() {

    this.club.avatar = '/avatar/' + this.club.nombre;
    this.clubServ.altaClub(this.club).subscribe((resp) => {
      this.util.dispararAlert('Éxito', "Registro realizado correctamente")
      var ref1 = this.storage.ref();
      var ref = ref1.child('/avatar/' + this.club.nombre);
      ref.put(this.file).then(function (snapshot) {
        console.log('Uploaded a blob or file!: ' + snapshot.downloadURL);
      });

    }, (err) => {
      this.util.dispararAlert('Error', "Error al dar de alta, intente nuevamente")
      console.log(err)
    })
  }

}
