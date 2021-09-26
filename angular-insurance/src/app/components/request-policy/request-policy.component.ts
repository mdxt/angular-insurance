import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { CoverValueEnum, GenderEnum, IncomeRangeEnum, OccupationTypeEnum, PaymentPeriodEnum, PolicyTypesEnum, QualificationLevelEnum} from 'src/app/common/request-policy-list';
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

  policyTypes: string[] = this.enumToStringArray(PolicyTypesEnum);
  coverValues: string[] = this.enumToStringArray(CoverValueEnum); 
  genders: string[] = Object.keys(GenderEnum).filter(k => isNaN(+k));
  incomeRanges: string[] = Object.keys(IncomeRangeEnum).filter(k => isNaN(+k));
  occupationTypes: string[] = Object.keys(OccupationTypeEnum).filter(k => isNaN(+k));
  qualificationLevels: string[] = Object.keys(QualificationLevelEnum).filter(k => isNaN(+k));
  paymentPeriods: string[] = Object.keys(PaymentPeriodEnum).filter(k => isNaN(+k));

  currentPolicyType: string;

  enumToStringArray(enumObject: Object): string[]{
    return Object.keys(enumObject).filter(k => isNaN(+k));
  }  

  constructor(private policyService: PolicyService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient) { }

  ngOnInit() {
    this.requestPoliciesFormGroup = this.formBuilder.group({
      policyType: new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace, FormValidators.valueFromEnumOnly(this.policyTypes)]),
    });

    this.requestPoliciesFormGroup.get('policyType').valueChanges.subscribe(selectedPolicyType => this.handlePolicyTypeChange(selectedPolicyType));
  }

  handlePolicyTypeChange(policyType: string) {
    //remove all controls except policy type
    for(let existingControl in this.requestPoliciesFormGroup.controls){
      if(existingControl !== "policyType") this.requestPoliciesFormGroup.removeControl(existingControl);
    }

    console.log('requested policy type - '+policyType);    
    
    if(policyType == PolicyTypesEnum[PolicyTypesEnum.LIFE]){
      
      this.requestPoliciesFormGroup.addControl('gender', new FormControl(this.genders[0], [Validators.required, FormValidators.valueFromEnumOnly(this.genders)]));
      this.requestPoliciesFormGroup.addControl('age', new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99)]));
      this.requestPoliciesFormGroup.addControl('tobaccoUser', new FormControl(false, [Validators.required]));
	    this.requestPoliciesFormGroup.addControl('incomeRange', new FormControl(this.incomeRanges[0], [Validators.required, FormValidators.valueFromEnumOnly(this.incomeRanges)]));
	    this.requestPoliciesFormGroup.addControl('occupationType',  new FormControl(this.occupationTypes[0], [Validators.required, FormValidators.valueFromEnumOnly(this.occupationTypes)]));
	    this.requestPoliciesFormGroup.addControl('qualificationLevel', new FormControl(this.qualificationLevels[0], [Validators.required, FormValidators.valueFromEnumOnly(this.qualificationLevels)]));
	    this.requestPoliciesFormGroup.addControl('coverValue', new FormControl(50000, [Validators.required, Validators.min(50000) ,Validators.max(20000000)]));
      this.requestPoliciesFormGroup.addControl('coverTillAge', new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99)]));
	    this.requestPoliciesFormGroup.addControl('paymentPeriod', new FormControl(this.paymentPeriods[0], [Validators.required, FormValidators.valueFromEnumOnly(this.paymentPeriods)]));
      this.currentPolicyType = policyType;
      console.log('current policy type - '+this.currentPolicyType); 
    }

    if(policyType == PolicyTypesEnum[PolicyTypesEnum.DENTAL]){

      this.requestPoliciesFormGroup.addControl('gender', new FormControl(this.genders[0], [Validators.required, FormValidators.valueFromEnumOnly(this.genders)]));
      this.requestPoliciesFormGroup.addControl('age', new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99)]));
      this.requestPoliciesFormGroup.addControl('numberCovered', new FormControl(1, [Validators.required, Validators.min(1) ,Validators.max(5)]));
      this.requestPoliciesFormGroup.addControl('zipCode', new FormControl('', [Validators.required]));
      this.requestPoliciesFormGroup.addControl('coverValue', new FormControl("500000", [Validators.required, FormValidators.valueFromEnumOnly(Object.keys(CoverValueEnum).filter(k => !isNaN(+k)))])); //TODO
      this.requestPoliciesFormGroup.addControl('coverPeriod', new FormControl(1, [Validators.required, Validators.min(1) ,Validators.max(10)]));
	    this.requestPoliciesFormGroup.addControl('paymentPeriod', new FormControl(this.paymentPeriods[0], [Validators.required, FormValidators.valueFromEnumOnly(this.paymentPeriods)]));
      this.currentPolicyType = policyType;
      console.log('current policy type - '+this.currentPolicyType); 
      this.requestPoliciesFormGroup.get('zipCode').valueChanges.pipe(debounceTime(500)).subscribe(zipCode => this.checkZipCode(zipCode));
    }
  }

  checkZipCode(zipCode: number){
    this.httpClient.get<any>('https://api.postalpincode.in/pincode/'+zipCode).subscribe(
      next => {
        if(next[0]['Status'] == 'Success' && next[0]['PostOffice']){
          
          console.log('Obtained district - '+next[0]['PostOffice'][0]['District']);
          console.log('Obtained state - '+next[0]['PostOffice'][0]['State']);
          this.requestPoliciesFormGroup.controls['zipCode'].setErrors(null);
        }
        else if(next[0]['Status'] == 'Error'){
          console.log('no zipcode data found');
          this.requestPoliciesFormGroup.controls['zipCode'].setErrors({'incorrect': true});
        }
      },
      error => console.log('error fetching zip code '+zipCode+' - '+error) 
    );
  }

  onSubmit() {
    // const request: RequestPolicyList = this.requestPoliciesFormGroup.getRawValue();
    console.log('Submitting following');
    console.log(this.requestPoliciesFormGroup.getRawValue());

    this.policyService.setCurrentPolicyIdAndCost(0, 0.0);
    this.policyService.requestPolicyList.next(this.requestPoliciesFormGroup.getRawValue());//request);
  }

  formatEnumForOutput(inp: String): String {
    return inp.split('_').join(' ');
  }

  get policyType() { return this.requestPoliciesFormGroup.get('policyType'); }
  get gender() { return this.requestPoliciesFormGroup.get('gender'); }
  get age() { return this.requestPoliciesFormGroup.get('age'); }
  get numberCovered() { return this.requestPoliciesFormGroup.get('numberCovered'); }
  get zipCode() { return this.requestPoliciesFormGroup.get('zipCode'); }
  get CoverValueEnum() { return CoverValueEnum; }
}
