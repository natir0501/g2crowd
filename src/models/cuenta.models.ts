import { ConceptoCaja } from './concepto.models';
import { Usuario } from './usuario.model';


export class Cuenta{
    _id?:  string=''
    movimientos? : Movimiento[] = []
    saldo?: number
}

export class Movimiento{
        _id?:string
        fecha?: number
        monto?: number
        tipo?: string 
        concepto?: ConceptoCaja=new ConceptoCaja()
        comentario?:string
        confirmado?: boolean
        referencia?: string
        usuario?:Usuario=new Usuario()
        jugador?:Usuario= new Usuario()
        estado?:string
        comentario_tes?:string
}

