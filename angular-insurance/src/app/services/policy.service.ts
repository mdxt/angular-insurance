import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Policy, PolicyAndCost } from '../common/policy';
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

  createRequestForPolicies(){
    let tempRequest: RequestPolicyList = new RequestPolicyList();
    tempRequest.gender = GenderEnum.MALE;
    tempRequest.age = 23;
    tempRequest.incomeRange = IncomeRangeEnum.ONE_TO_FIVE_LAKH;
    tempRequest.occupationType = OccupationTypeEnum.SALARIED;
    tempRequest.qualificationLevel = QualificationLevelEnum.COLLEGE_GRADUATE_AND_ABOVE;
    tempRequest.tobaccoUser = false;    
    tempRequest.coverValue = 3500000;
    tempRequest.coverTillAge = 60;
    tempRequest.paymentPeriod = PaymentPeriodEnum.MONTHLY;
    this.requestPolicyList.next(tempRequest);
  }

  getPolicies(request: any): Observable<PolicyAndCost[]>{
    console.log("attempting get policies with request: "+JSON.stringify(request));
    return this.httpClient.post<PolicyAndCost[]>(environment.apiUrl+"/public/policies/"+(request ? request['policyType'] : ''), request);
  }

  getPolicyDetails(id: number, policyType: string): Observable<Policy>{
    return this.httpClient.get<Policy>(environment.apiUrl+"/public/policy/"+policyType+'/'+id);
  }

  getPolicyDetailsWithCost(id: number, request: any): Observable<PolicyAndCost>{
    console.log("attempting post policy with cost with request: "+request);
    return this.httpClient.post<PolicyAndCost>(environment.apiUrl+"/public/policy/"+(request ? request['policyType'] : '')+'/'+id, request);
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
    return this.httpClient.post<string>(environment.apiUrl+'/user/purchase/'+request['policyType'],request);
  }

  getUserOrderHistory(policyType: string): Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl+'/user/history/'+policyType);
  }

  getPoliciesForUnderwriter(policyType: string): Observable<any>{
    return this.httpClient.get<any>(environment.apiUrl+'/underwriter/pending/'+policyType);
  }
}

// [
//   {"policy": {"insurer":"mdxt",
//               "name":"fantabulous policy",
//               "documentPath":"http://www.africau.edu/images/default/sample.pdf",
//               "minCoverValue":1000000,
//               "maxCoverValue":10000000,
//               "minCoverTillAge":30,
//               "maxCoverTillAge":99,
//               "multiplierCoverTillAge":2.0,
//               "additionalFeatures":["some other feature"],
//               "id":1},
//    "totalCost":3.14159}
// ]