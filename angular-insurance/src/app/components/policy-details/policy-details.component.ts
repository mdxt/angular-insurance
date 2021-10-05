import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { PolicyService } from 'src/app/services/policy.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-policy-details',
  templateUrl: './policy-details.component.html',
  styleUrls: ['./policy-details.component.css']
})
export class PolicyDetailsComponent implements OnInit {
  requestPolicyList: any;

  policy: any;

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
    const policyType: string = this.route.snapshot.paramMap.get('type');

    if(policyId == null || policyType == null) {
      this.policy = null;
      return;
    }

    this.policyService.requestPolicyList.pipe(take(1)).subscribe(
      request => { 
          //if(request == null) return;
          console.log('requestPolicyList - '+JSON.stringify(request));
          this.requestPolicyList = request;
          this.policyService.getPolicyDetailsWithCost(policyId, policyType ,request).subscribe(
            response => {
              this.policy = response;
              console.log('obtained response from policies get request- ' + JSON.stringify(response));
            },
            error => {
              this.policy = null;
              console.log('obtained error from policies get request- ' + JSON.stringify(error));
            }
          ) 
      }
    );
  }

  purchase() {
    this.policyService.setCurrentPolicyIdAndCost(this.policy.policy.id,this.policy.cost);
    this.router.navigateByUrl('/purchase');
    
  }
}
