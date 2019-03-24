import { Club } from "../models/club.models";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable } from "@angular/core";
import { UtilsServiceProvider } from "./utils.service";

@Injectable()
export class ClubService{
    apiUrl : string = ''
    constructor(public http: HttpClient, public utils: UtilsServiceProvider){
        this.apiUrl = this.utils.apiUrl
    }
  
    public altaClub(club: Club): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/json")
        return this.http.post(`${this.apiUrl}api/club`, club, { headers })
    }
}