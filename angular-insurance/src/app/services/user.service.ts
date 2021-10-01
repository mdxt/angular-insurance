import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  getUsersMatching(pattern: string){
    return this.httpClient.get<any>(environment.apiUrl + '/admin/usersMatching/' + pattern);
  }

  setAsUnderwriter(email: string): Observable<string>{
    return this.httpClient.post<string>(environment.apiUrl + '/admin/setAsUnderwriter', email,  {responseType: 'text' as 'json'});
  }

  doUpload(formData: FormData): Observable<any>{
    return this.httpClient.post<any>(environment.apiUrl + '/admin/uploadPDF', formData, {responseType: 'text' as 'json'});
  }

  createPolicy(policyType: string, formData: any){
    return this.httpClient.post<string>(environment.apiUrl + '/admin/create/'+policyType, formData, {responseType: 'text' as 'json'});
  }

  getAllPolicyPurchases(policyType: string){
    return this.httpClient.get<any[]>(environment.apiUrl + '/admin/all/' + policyType);
  }
}
