import { Observable, BehaviorSubject, from, of } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient,RequestOptions, Headers } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { take, map, switchMap, tap } from 'rxjs/operators';

const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    public user: Observable<any>;
    private userData = new BehaviorSubject(null);

    constructor(private storage: Storage, private http: HttpClient, private plt: Platform, private router:Router) { 
            this.loadStoredToken();
    }

    loadStoredToken(){
        let platformObs = from(this.plt.ready());
        this.user = platformObs.pipe(
            switchMap(() => {
                return from(this.storage.get(TOKEN_KEY))
            }),
            map(token => {
                console.log('Token froms storage: ', token );
                if(token){
                    let decoded = helper.decodeToken(token);
                    console.log('decoded: ', decoded);
                    this.userData.next(decoded);
                } else {
                    return null;
                }
            })
        )
    }



    login(credentials: {email:string,pw:string}): Observable<any> {
        if(credentials.email != 'heittorfernandes@gmail.com' || credentials.pw != 'prse303') {
            return of(null);
        }
        let user = {
            email: credentials.email,
            password: credentials.pw
        }
        return this.http.post('http://localhost:8000/api/login', user).pipe(
            tap(async (res: any) => {
    
            if (res.user) {
                let decoded = helper.decodeToken(res.user.access_token);                         
                console.log('login decoded: ', decoded);
                this.userData.next(decoded);
                await this.storage.set('ACCESS_TOKEN', res.user.access_token);
                console.log(res.user.access_token);
                let storageObs = from(this.storage.set(TOKEN_KEY, res.user.access_token));
                return storageObs;
            }
          })
        );
      }
      /*
    login(credentials: {email:string,pw:string}):Observable<any>{
        if(credentials.email != 'heittorfernandes@gmail.com' || credentials.pw != 'prse303') {
            return of(null);
        }

       
    
     

        return this.http.post('http://localhost:8000/api/login').pipe(
            take(1),
            map(res => {
                return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhlaXR0b3JmZXJuYW5kZXNAZ21haWwuY29tIn0.DjTTvdhNUQBFVV8ocQY08_MR1A9Hof3hpuHeUZQRCBA` 
            }),
            switchMap(token => {
                let decoded = helper.decodeToken(token);
                console.log('login decoded: ', decoded);
                this.userData.next(decoded);

                let storageObs = from(this.storage.set(TOKEN_KEY, token));
                return storageObs;
            })
        );
    } */

   

    logout(){
        this.storage.remove(TOKEN_KEY).then( () => {
            this.router.navigateByUrl('/');
            this.userData.next(null);
        });
    }
}
