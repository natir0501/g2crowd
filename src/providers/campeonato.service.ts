import { Campeonato, Fecha } from './../models/campeonato.model';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UtilsServiceProvider } from "./utils.service";
import { Observable } from "rxjs/Observable";
import { UsuarioService } from "./usuario.service";
import { Categoria } from '../models/categoria.models';



@Injectable()
export class CampeonatoService {

    consultarCampeonatoActual(categoria: Categoria): Observable<any> {

        
        
        let anioActual = new Date().getFullYear();
        
        
        for (let camp of categoria.campeonatos) {
           
            if (camp.anio === anioActual) {
                let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
                headers = headers.set('x-auth', this.usuarioServ.token)
               
                return this.http.get(`${this.apiUrl}api/campeonato/${camp._id}`, { headers })
            }
        }
    }

    agregarFechaCamp(fecha: Fecha, campeonato: Campeonato): any {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/campeonato/${campeonato._id}/agregarfecha`, fecha, { headers })
    }

    actualizarFecha(fecha: Fecha): any {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.put(`${this.apiUrl}api/campeonato/${fecha._id}/modificarfecha`, fecha, { headers })
    }

    apiUrl: string = ''

    constructor(public http: HttpClient, public utils: UtilsServiceProvider,
        public usuarioServ: UsuarioService) {
        this.apiUrl = this.utils.apiUrl
    }

    obtenerCampeonatos(): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get(`${this.apiUrl}api/campeonatos`, { headers })
    }

    agregarCampeonato(campeonato: Campeonato): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/campeonato`, campeonato, { headers })
    }


    actualizarCampeonato(campeonato: Campeonato): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.put(`${this.apiUrl}api/campeonato/${campeonato._id}`,campeonato, { headers })
    }
    crearEvento(fecha: Fecha, categoriaId: string): Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/campeonato/evento`,{fecha,categoriaId}, { headers })
    }

}