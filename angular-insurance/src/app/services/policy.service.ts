import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Policy } from '../common/policy';
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
    tempRequest.coverValue = 3500000;
    tempRequest.coverTillAge = 60;
    tempRequest.payMonthly = true;


    this.httpClient.post<Policy[]>("http://localhost:8080/api/public/policies", tempRequest).subscribe(
      response => {
        console.log('obtained response from policies get request- '+JSON.stringify(response));
      },
      error => {
        console.log('obtained error from policies get request- '+error);
      }

    )
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