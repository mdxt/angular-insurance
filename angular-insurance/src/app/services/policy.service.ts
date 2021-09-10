import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Policy, PolicyAndCost } from '../common/policy';
import { GenderEnum, IncomeRangeEnum, OccupationTypeEnum, PaymentPeriodEnum, QualificationLevelEnum, RequestPolicyList } from '../common/request-policy-list';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  requestPolicyList: Subject<RequestPolicyList> = new BehaviorSubject<RequestPolicyList>(null);

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

  getPolicies(request: RequestPolicyList): Observable<PolicyAndCost[]>{
    console.log("attempting get policies with request: "+request);
    return this.httpClient.post<PolicyAndCost[]>(environment.apiUrl+"/public/policies", request);
  }

  getPolicyDetails(id: number): Observable<Policy>{
    return this.httpClient.get<Policy>(environment.apiUrl+"/public/policy/"+id);
  }

  getPolicyDetailsWithCost(id: number, request: RequestPolicyList): Observable<PolicyAndCost>{
    console.log("attempting post policy with cost with request: "+request);
    return this.httpClient.post<PolicyAndCost>(environment.apiUrl+"/public/policy/"+id, request);
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