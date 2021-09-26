import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { Policy, PolicyAndCost } from '../common/policy';
import { GenderEnum, IncomeRangeEnum, OccupationTypeEnum, PaymentPeriodEnum, QualificationLevelEnum } from '../common/request-policy-list';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  requestPolicyList: Subject<any> = new BehaviorSubject<any>(null);

  private currentPolicyId: number;

  private currentPolicyCost: number;

  constructor(private httpClient: HttpClient) { 
    //this.createRequestForPolicies();
  }

  getPolicies(request: any): Observable<any[]>{
    console.log("attempting get policies with request: "+JSON.stringify(request));
    return this.httpClient.post<any[]>(environment.apiUrl+"/public/policies/"+(request ? request['policyType'] : ''), request);
  }

  getPolicyDetails(id: number, policyType: string): Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl+"/public/policy/"+policyType+'/'+id);
  }

  getPolicyDetailsWithCost(id: number, type: string, request: any): Observable<any>{
    console.log("attempting post policy with cost with request: "+request);
    return this.httpClient.post<any>(environment.apiUrl+"/public/policy/"+type+'/'+id, request);
  }  

  setCurrentPolicyIdAndCost(currentPolicyId: number, currentPolicyCost: number) {
    this.currentPolicyId = currentPolicyId;

    this.currentPolicyCost = currentPolicyCost;
  }

  getCurrentPolicyId(): number{
    return this.currentPolicyId;
  }

  getCurrentPolicyCost(): number{
    return this.currentPolicyCost;
  }

  doPurchase(request: any): Observable<string>{
    return this.httpClient.post<string>(environment.apiUrl+'/user/purchase/'+request['policyType'],request,{responseType: 'text' as 'json'});
  }

  getUserOrderHistory(policyType: string): Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl+'/user/history/'+policyType);
  }

  getPoliciesForUnderwriter(policyType: string): Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl+'/underwriter/pending/'+policyType);
  }

  setPolicyApproval(type: string, status: boolean, id: number): Observable<string>{
    return this.httpClient.post<string>(environment.apiUrl+'/underwriter/approve/'+type+'/'+id, status, {responseType: 'text' as 'json'});
  }
}
