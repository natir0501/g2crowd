import { UtilsServiceProvider } from './utils.service';
import { UsuarioService } from './usuario.service';
import { Categoria } from './../models/categoria.models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';



@Injectable()
export class CategoriaService{
    
   
    constructor(public http:HttpClient, private utils: UtilsServiceProvider, public usuarioServ: UsuarioService){
        
    }

    obtenerCategorias():Observable<any>{

        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
     
        headers = headers.set('x-auth', this.usuarioServ.token)

        return this.http.get(`${this.utils.apiUrl}api/categorias`, { headers })
    }
    crearCategoria(categoriaData: any): Observable<any>{
        
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        
        headers = headers.set('x-auth', this.usuarioServ.token)

        return this.http.post(`${this.utils.apiUrl}api/categorias`,categoriaData, { headers })
    }

    actualizarCategoria(categoriaData: any): Observable<any>{
        
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        
        headers = headers.set('x-auth', this.usuarioServ.token)

        return this.http.put(`${this.utils.apiUrl}api/categorias/${categoriaData._id}`,categoriaData, { headers })
    }

    obtenerCategoria(_id: string): Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get<any>(`${this.utils.apiUrl}api/categorias/${_id}`,{ headers })
    }
    obtenerSaldosCategoria(_id: string): Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get<any>(`${this.utils.apiUrl}api/categorias/saldos/${_id}`,{ headers })
    }


    obtenerRoles(): Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        
        headers = headers.set('x-auth', this.usuarioServ.token)

        return this.http.get<any>(`${this.utils.apiUrl}api/roles`,{ headers })
    }

    
}