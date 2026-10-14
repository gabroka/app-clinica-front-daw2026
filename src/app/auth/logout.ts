import { Injectable } from "@angular/core";



@Injectable({providedIn:"root"})
export class Logout{
  logout(){
    sessionStorage.clear();
    location.reload();
  }
}