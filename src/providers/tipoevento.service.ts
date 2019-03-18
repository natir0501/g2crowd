import { UtilsServiceProvider } from './utils.service';
import { UsuarioService } from './usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { TipoEvento } from '../models/tipo.evento.models';
//import { TipoEvento } from '../models/tipo.evento.models';

@Injectable()
export class TipoEventoService{


    apiUrl: string= ''
    
    constructor(public http: HttpClient, private utils: UtilsServiceProvider, public usuarioServ: UsuarioService){
        this.apiUrl = this.utils.apiUrl;
    }

    obtenerEventos() :Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get(`${this.apiUrl}api/tipoeventos`, { headers })
    }

    agregarTipoEvento(tipoEvento: TipoEvento):Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/tipoeventos`,tipoEvento, { headers })
      }

      actualizarTipoEvento(tipoEvento: TipoEvento):Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.put(`${this.apiUrl}api/tipoeventos/${tipoEvento._id}`,tipoEvento, { headers })
      }

}