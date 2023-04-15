import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthRevGuard implements CanActivate {
  constructor(private router:Router){ }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      console.log(`user:${sessionStorage.getItem('user')}`)
      if(sessionStorage.getItem('user')=='null' || sessionStorage.getItem('user') == null){
        return true;
      }else{
        this.router.navigate(['home']);
        return false;
      }
      
      
  }
  
}
