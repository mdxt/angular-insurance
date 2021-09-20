
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { PolicyAndCost } from 'src/app/common/policy';
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

  constructor(private policyService: PolicyService,
              private router: Router) { }

  ngOnInit() {
    this.policyService.requestPolicyList.subscribe(
      request => this.policyService.getPolicies(request).subscribe(
          response => {
            this.policies = response;
            this.policyType = request['policyType'];
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
