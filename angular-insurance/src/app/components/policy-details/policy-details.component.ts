import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Policy, PolicyAndCost } from 'src/app/common/policy';
import { PolicyService } from 'src/app/services/policy.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {
  requestPolicyList: any;

  policy: PolicyAndCost;

  apiUrl: string = environment.apiUrl;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private policyService: PolicyService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(
      () => {
        this.handlePolicyDetails();
      }
    );
  }

  handlePolicyDetails() {
    const policyId: number = +this.route.snapshot.paramMap.get('id');

    this.policyService.requestPolicyList.subscribe(
      request => { 
          console.log('requestPolicyList - '+JSON.stringify(request));
          this.requestPolicyList = request;
          this.policyService.getPolicyDetailsWithCost(policyId, request).subscribe(
            response => {
              this.policy = response;
              console.log('obtained response from policies get request- ' + JSON.stringify(response));
            },
            error => {
              this.policy = null;
              console.log('obtained error from policies get request- ' + error);
            }
          ) 
      }
    );
  }

  purchase() {
    this.policyService.setCurrentPolicyIdAndCost(this.policy.policy.id,this.policy.totalCost);
    this.router.navigateByUrl('/purchase');
    
  }

}
