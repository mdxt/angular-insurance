import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyService } from 'src/app/services/policy.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-create-purchase',
  templateUrl: './create-purchase.component.html',
  styleUrls: ['./create-purchase.component.css']
})
export class CreatePurchaseComponent implements OnInit {
  additionalDetailsFormGroup: FormGroup;

  requestPolicyList: any;
  id: number;
  cost: number;

  constructor(private policyService: PolicyService) { }

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
    
    this.policyService.doPurchase(request).subscribe(
      next => { console.log('purchase successful') },
      error => { console.log('purchase error - '+JSON.stringify(error)) }
    );
  }
}
