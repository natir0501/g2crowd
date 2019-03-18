import { UtilsServiceProvider } from './utils.service';
import { UsuarioService } from './usuario.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { ConceptoCaja } from '../models/concepto.models';

@Injectable()
export class ConceptoService{
    apiUrl: string=''
    //apiUrl: string = ''
    constructor(public http: HttpClient, public utils: UtilsServiceProvider, public usuarioServ: UsuarioService){
        this.apiUrl = this.utils.apiUrl
    }

    agregarConcepto(concepto : ConceptoCaja):Observable<any>{

        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/conceptoscaja`,concepto, { headers })
    }

    actualizarConcepto(concepto : ConceptoCaja):Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.put(`${this.apiUrl}api/conceptoscaja/${concepto._id}`,concepto, { headers })
    }

    obtenerConceptos():Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get(`${this.apiUrl}api/conceptoscaja`, { headers })
    }

}