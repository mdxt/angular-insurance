import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormService {



  policyTypes: Subject<Array<string>> = new BehaviorSubject<Array<string>>(null);

  constructor(private httpClient: HttpClient) { 
    this.httpClient.get<Array<string>>(environment.apiUrl + '/public/types').subscribe(
      next => {
        this.policyTypes.next(next);
        console.log('Obtained policy types from server - '+ JSON.stringify(next));
      },
      error => console.log('Error obtaining policy types - '+error)
    );
  }

  getForm(type: string): Observable<any>{
    return this.httpClient.post<any>(environment.apiUrl + '/public/getForm', type);
  }
}
