import { Platform, ToastController } from 'ionic-angular';
import { UsuarioService } from './usuario.service';
import { Injectable } from "@angular/core";
import { FirebaseApp } from 'angularfire2';
// I am importing simple ionic storage (local one), in prod this should be remote storage of some sort.
import { Storage } from '@ionic/storage';
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject } from 'rxjs/BehaviorSubject'

@Injectable()
export class FirebaseMessagingProvider {
  private messaging;
  private unsubscribeOnTokenRefresh = () => { };
  public token: string
  currentMessage = new BehaviorSubject(null)

  constructor(
    private storage: Storage,
    private app: FirebaseApp,
    private usuServ: UsuarioService,
    private platform: Platform,
    private toaster: ToastController
  ) {
    this.messaging = app.messaging();
    navigator.serviceWorker.register('service-worker.js').then((registration) => {
      this.messaging.useServiceWorker(registration);
      //this.disableNotifications()
      this.enableNotifications();

    });
  }

  public enableNotifications() {
    try {
      console.log('Requesting permission...');
      return this.messaging.requestPermission().then(() => {
        console.log('Permission granted');
        // token might change - we need to listen for changes to it and update it
        this.setupOnTokenRefresh();
        this.receiveMessage()
        return this.updateToken();

      })
        .catch((err) => console.log(err))
        ;

    } catch (e) {
      console.log('Error en enablenotificacion', e)
    }
  }

  public disableNotifications() {
    this.unsubscribeOnTokenRefresh();
    this.unsubscribeOnTokenRefresh = () => { };
    return this.storage.set('fcmToken', '').then();
  }

  private updateToken() {
    return this.messaging.getToken().then((currentToken) => {
      if (currentToken) {
        // we've got the token from Firebase, now let's store it in the database

        this.token = currentToken

        if (this.usuServ.usuario) {
          if (this.platform.platforms().indexOf('mobile') >= 0) {
            this.usuServ.registrarPush({ platform: 'mobile', token: this.token }).subscribe((resp) => {

            }, (error) => {

            })
          }
          else {
            this.usuServ.registrarPush({ platform: 'desktop', token: this.token }).subscribe((resp) => {

            }, (error) => {

            })
          }
        }

        return this.storage.set('fcmToken', currentToken);
      } else {
        console.log('No Instance ID token available. Request permission to generate one.');
      }
    });
  }

  private setupOnTokenRefresh(): void {
    this.unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
      console.log("Token refreshed");
      this.storage.set('fcmToken', '').then(() => { this.updateToken(); });
    });
  }
  receiveMessage() {

    this.messaging.onMessage((payload) => {
      
      if (this.platform.is('ios')) {
        
        let toast = this.toaster.create({
          message: `${JSON.parse(payload.data.notification).body}`,
          duration: 5000,
          position: 'top',
          cssClass: "yourtoastclass"
        });

        toast.onDidDismiss(() => {

        });

        toast.present();
      }


      this.currentMessage.next(payload)
    });

  }

}