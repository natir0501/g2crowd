import { Categoria } from './categoria.models';
import { PatternValidator } from "@angular/forms";

export class Campeonato{
    _id: string  = ''
    nombre?: string
    anio?: number
    fechas?: Fecha[] = []
    categoria?: Categoria
}

export class Fecha {
    _id?: string=''
    numeroFecha?: number
    fechaEncuentro?: number
    rueda?: string
    partido?: Partido= new Partido()
}

export class Partido{
    rival?: string
    golesPropios? : number
    golesRival?: number
    local: boolean = false
    lugar?: Lugar= new Lugar()
}

export class Lugar{
    nombre? : string
    direccion? : string
    linkUbicacion? : string
}


