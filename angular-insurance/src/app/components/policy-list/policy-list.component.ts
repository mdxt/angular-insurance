
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { error } from 'protractor';
import { BehaviorSubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { PolicyService } from 'src/app/services/policy.service';
import { RequestPolicyComponent } from '../request-policy/request-policy.component';

@Component({
  selector: 'app-policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
              private router: Router,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.policyService.requestPolicyList.subscribe(
      next => this.policyService.getPolicies(next).pipe(take(1)).subscribe(
          response => {
            this.policies = response;
            this.policyType = next['policyType'];
            this.requestCover = next['coverValue'];
            if(this.policyType == 'LIFE'){
              this.requestAge = next['coverTillAge'];
            }
            if(this.policyType == 'DENTAL' || this.policyType == 'DENTAL_AND_VISION'){
              this.requestAge = next['coverPeriod'];
              this.requestNumberCovered = next['numberCovered'];
            }
            this.requestPaymentPeriod = next['paymentPeriod'];
            console.log('obtained response from policies get request- '+JSON.stringify(response));
            this.ref.detectChanges();
          },
          error => {
            this.policies = [];
            console.log('obtained error from policies get request- '+error);
          }
      ),
      error => {
        console.log('error while retrieving list of policies - '+JSON.stringify(error));
        alert('Error while retrieving list of policies from server');
      }

    );
  }

  showPolicyDetails(id: number){
    this.router.navigateByUrl('/policy/'+this.policyType+'/'+id);
  }

}
