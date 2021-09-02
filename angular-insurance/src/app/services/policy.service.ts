import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { GenderEnum, IncomeRangeEnum, OccupationTypeEnum, QualificationLevelEnum, RequestPolicyList } from '../common/request-policy-list';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  requestPolicyList: Subject<RequestPolicyList> = new BehaviorSubject<RequestPolicyList>(null);

  constructor(private httpClient: HttpClient) { 

    let tempRequest: RequestPolicyList = new RequestPolicyList();
    tempRequest.gender = GenderEnum.MALE;
    tempRequest.age = 23;
    tempRequest.incomeRange = IncomeRangeEnum.ONE_TO_FIVE_LAKH;
    tempRequest.occupationType = OccupationTypeEnum.SALARIED;
    tempRequest.qualificationLevel = QualificationLevelEnum.COLLEGE_GRADUATE_AND_ABOVE;
    tempRequest.tobaccoUser = false;    

    this.httpClient.post<any>("http://localhost:8080/api/public/policies", tempRequest).subscribe(
      response => {
        console.log('obtained response from policies get request- '+response);
      },
      error => {
        console.log('obtained error from policies get request- '+error);
      }

    )
  }




}
