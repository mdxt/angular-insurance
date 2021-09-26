
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { PolicyService } from 'src/app/services/policy.service';
import { RequestPolicyComponent } from '../request-policy/request-policy.component';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {

  policies: any[] = [];
  policyType: string;

  requestCover: number;
  requestAge: number;
  requestPaymentPeriod: string;
  requestPeriod: number;
  requestNumberCovered: number;

  constructor(private policyService: PolicyService,
              private router: Router) { }

  ngOnInit() {
    this.policyService.requestPolicyList.subscribe(
      request => this.policyService.getPolicies(request).subscribe(
          response => {
            this.policies = response;
            this.policyType = request['policyType'];
            this.requestCover = request['coverValue'];
            if(this.policyType == 'LIFE'){
              this.requestAge = request['coverTillAge'];
            }
            if(this.policyType == 'DENTAL'){
              this.requestAge = request['coverPeriod'];
              this.requestNumberCovered = request['numberCovered'];
            }
            this.requestPaymentPeriod = request['paymentPeriod'];
            console.log('obtained response from policies get request- '+JSON.stringify(response));
          },
          error => {
            this.policies = [];
            console.log('obtained error from policies get request- '+error);
          }
      )
    );
  }

  showPolicyDetails(id: number){
    this.router.navigateByUrl('/policy/'+this.policyType+'/'+id);
  }

}
