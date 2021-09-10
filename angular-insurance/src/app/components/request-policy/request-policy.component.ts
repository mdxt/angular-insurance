import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GenderEnum, IncomeRangeEnum, OccupationTypeEnum, PaymentPeriodEnum, QualificationLevelEnum, RequestPolicyList } from 'src/app/common/request-policy-list';
import { PolicyService } from 'src/app/services/policy.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { isNumber, isString } from 'util';

@Component({
  selector: 'app-request-policy',
  templateUrl: './request-policy.component.html',
  styleUrls: ['./request-policy.component.css']
})
export class RequestPolicyComponent implements OnInit {

  requestPoliciesFormGroup: FormGroup;

  genders: string[] = Object.keys(GenderEnum).filter(k => isNaN(+k));
  incomeRanges: string[] = Object.keys(IncomeRangeEnum).filter(k => isNaN(+k));
  occupationTypes: string[] = Object.keys(OccupationTypeEnum).filter(k => isNaN(+k));
  qualificationLevels: string[] = Object.keys(QualificationLevelEnum).filter(k => isNaN(+k));
  paymentPeriods: string[] = Object.keys(PaymentPeriodEnum).filter(k => isNaN(+k));


  constructor(private policyService: PolicyService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.requestPoliciesFormGroup = this.formBuilder.group({
      gender: new FormControl(this.genders[0], [Validators.required, FormValidators.valueFromEnumOnly(this.genders)]),
      age: new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99)]),
      tobaccoUser: new FormControl(false, [Validators.required]),
	    incomeRange: new FormControl(this.incomeRanges[0], [Validators.required, FormValidators.valueFromEnumOnly(this.incomeRanges)]),
	    occupationType:  new FormControl(this.occupationTypes[0], [Validators.required, FormValidators.valueFromEnumOnly(this.occupationTypes)]),
	    qualificationLevel: new FormControl(this.qualificationLevels[0], [Validators.required, FormValidators.valueFromEnumOnly(this.qualificationLevels)]),
	    coverValue: new FormControl(50000, [Validators.required, Validators.min(50000) ,Validators.max(20000000)]),
      coverTillAge: new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99)]),
	    paymentPeriod: new FormControl(this.paymentPeriods[0], [Validators.required, FormValidators.valueFromEnumOnly(this.paymentPeriods)]),
    });
  }

  onSubmit() {
    const request: RequestPolicyList = this.requestPoliciesFormGroup.getRawValue();
    console.log('Submitting following');
    console.log(request);

    this.policyService.requestPolicyList.next(request);
  }

  formatEnumForOutput(inp: String): String {
    return inp.split('_').join(' ');
  }

  get gender() { return this.requestPoliciesFormGroup.get('gender'); }
  get age() { return this.requestPoliciesFormGroup.get('age'); }

}
