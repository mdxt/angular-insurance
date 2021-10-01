import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { PolicyService } from 'src/app/services/policy.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePurchaseComponent implements OnInit {
  additionalDetailsFormGroup: FormGroup;

  requestPolicyList: any;
  id: number;
  cost: number;

  constructor(private policyService: PolicyService,
              private router: Router) { }

  ngOnInit() {
    this.additionalDetailsFormGroup = new FormGroup({
      address: new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]),
      buyerName: new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]),
    });

    this.policyService.requestPolicyList.subscribe(requestPolicyList => {
    
      this.requestPolicyList = requestPolicyList;
      this.cost = this.policyService.getCurrentPolicyCost();
      this.id = this.policyService.getCurrentPolicyId();
      console.log('noted policy request change in create purchase '+this.cost+','+this.id);
    });
  }

  submitPurchase() {
    let request: any = {};
    Object.assign(request, this.requestPolicyList, this.additionalDetailsFormGroup.getRawValue(), { 'cost': this.cost }, { 'policyId': this.id });
    console.log('constructed purchase request - '+JSON.stringify(request));
    
    this.policyService.doPurchase(request).pipe(take(1)).subscribe(
      next => { 
        console.log('purchase successful - '+next); 
        alert('Purchase successfully submitted');
        this.router.navigate(['/policies']);
      },
      error => { console.log('purchase error - '+JSON.stringify(error)) }
    );
  }

  formatEnumForOutput(inp: String): String {
    let temp: string = inp.split('_').join(' ');
    return temp.charAt(0).toUpperCase() + temp.slice(1);
  }
}
