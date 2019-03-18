import { Movimiento } from './../models/cuenta.models';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { UtilsServiceProvider } from "./utils.service";
import { UsuarioService } from "./usuario.service";
import { Observable } from "rxjs/Observable";
import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario.model';
import { query } from '@angular/core/src/animation/dsl';

@Injectable()
export class CuentaService {

  filtrarMovimientos(idCuenta: string, tipo: string, idConcepto: string, fechaD: number, fechaH: number): Observable <any> {
    let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
    headers = headers.set('x-auth', this.usuarioServ.token)

    
    let params : HttpParams = new HttpParams();
    params= tipo? params.set('tipo', tipo): params;
    params = idConcepto? params.set('concepto', idConcepto): params;
    params = fechaD? params.set('fechaInicio', fechaD.toString()):params;
    params = fechaH? params.set('fechaFin', fechaH.toString()): params;
   
    return this.http.get(`${this.apiUrl}api/movimientos/${idCuenta}`, {headers, params} )
  }

    transferenciaSaldo(payload: any, id: string): Observable <any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.patch(`${this.apiUrl}api/cuenta/transferencia/${id}`, payload, { headers })

    }

    rechazarPago(movimiento: Movimiento, _id: string): Observable <any> {

        let pago = {
            jugadorid: movimiento.usuario._id,
            idmov: movimiento._id,
            monto: movimiento.monto,
            referencia: movimiento.referencia,
            comentario: movimiento.comentario_tes
        }
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.patch(`${this.apiUrl}api/pagos/rechazo/${_id}`, pago, { headers })


    }


    confirmarPago(movimiento: Movimiento, _id: string): Observable <any> {

        let pago = {
            jugadorid: movimiento.usuario._id,
            idmov: movimiento._id,
            monto: movimiento.monto,
            referencia: movimiento.referencia,
            comentario: movimiento.comentario_tes
        }
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.patch(`${this.apiUrl}api/pagos/confirmacion/${_id}`, pago, { headers })
    }

    obtenerMovimientosPendientes(_id: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get(`${this.apiUrl}api/movimientospendientes/${_id}`, { headers })
    }

    apiUrl: string = ''

    constructor(public http: HttpClient, private utils: UtilsServiceProvider,
        public usuarioServ: UsuarioService) {

        this.apiUrl = this.utils.apiUrl;
    }

    obtenerMovimientos(_id: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get(`${this.apiUrl}api/movimientos/${_id}`, { headers })
    }

    ingresarMovimiento(payload: any, id: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.patch(`${this.apiUrl}api/cuenta/movimientos/ingresomovimiento/${id}`, payload, { headers })
    }

    registrarPagoCuota(movimiento: Movimiento): Observable<any> {
        let pago = {
            jugadorid: movimiento.jugador._id,
            usuarioid: movimiento.usuario._id,
            concepto: movimiento.concepto._id,
            monto: movimiento.monto,
            comentario: movimiento.comentario
        }
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.post(`${this.apiUrl}api/pagos`, pago, { headers })
    }

    obtenerCuenta(_id: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.get<any>(`${this.utils.apiUrl}api/cuenta/${_id}`, { headers })
    }

    anularMovimiento(idCuenta: string, idMovimiento : string) : Observable<any>{
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        headers = headers.set('x-auth', this.usuarioServ.token)
        return this.http.patch<any>(`${this.utils.apiUrl}api/cuenta/${idCuenta}/movimiento/${idMovimiento}`,{}, { headers })
        
    }


}

