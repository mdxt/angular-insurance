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
  obtainedDistrict: string;
  obtainedState: string;

  enumToStringArray(enumObject: Object): string[]{
    return Object.keys(enumObject).filter(k => isNaN(+k));
  }  

  constructor(private policyService: PolicyService,
              private formBuilder: FormBuilder,
              private httpClient: HttpClient) {
                
               }

  ngOnInit() {
    console.log('request policy component init');
    this.requestPoliciesFormGroup = this.formBuilder.group({
      policyType: new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace, FormValidators.valueFromEnumOnly(this.policyTypes)]),
    });

    this.requestPoliciesFormGroup.get('policyType').valueChanges.subscribe(selectedPolicyType => this.handlePolicyTypeChange(selectedPolicyType));

    if(localStorage.getItem('request') != null){
      this.requestPoliciesFormGroup.setValue(JSON.parse(localStorage.getItem('request')));
      this.policyService.requestPolicyList.next(this.requestPoliciesFormGroup.getRawValue());
    }
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
      this.requestPoliciesFormGroup.addControl('coverTillAge', new FormControl(18, [Validators.required, Validators.min(18) ,Validators.max(99), FormValidators.valueGreaterThan(this.requestPoliciesFormGroup.get('age'))]));
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
      this.requestPoliciesFormGroup.get('zipCode').valueChanges
                                                  .pipe((valueChange) => { this.requestPoliciesFormGroup.controls['zipCode'].setErrors({'incomplete': true}); return valueChange})
                                                  .pipe(debounceTime(300)).subscribe(zipCode => this.checkZipCode(zipCode));
      this.checkZipCode(0);
    }
  }

  checkZipCode(zipCode: number){
    this.httpClient.get<any>('https://api.postalpincode.in/pincode/'+zipCode).subscribe(
      next => {
        if(next[0]['Status'] == 'Success' && next[0]['PostOffice']){
  
          this.obtainedDistrict = next[0]['PostOffice'][0]['District'];
          this.obtainedState = next[0]['PostOffice'][0]['State'];

          this.requestPoliciesFormGroup.controls['zipCode'].setErrors(null);
        }
        else if(next[0]['Status'] == 'Error'){
          console.log('no zipcode data found');
          this.obtainedDistrict = null;
          this.obtainedState = null;
          this.requestPoliciesFormGroup.controls['zipCode'].setErrors({'incorrect': true});
        }
      },
      error => console.log('error fetching zip code '+zipCode+' - '+error) 
    );
  }

  onSubmit() {
    // const request: RequestPolicyList = this.requestPoliciesFormGroup.getRawValue();

    // if(this.currentPolicyType == 'LIFE'){
    //   if(+this.requestPoliciesFormGroup.get('age').value >= +this.requestPoliciesFormGroup.get('coverTillAge').value){
    //     this.requestPoliciesFormGroup.get('coverTillAge').setErrors({lessThanCurrentAge: true});
    //     return;
    //   }
    // }

    console.log('Submitting following');
    console.log(this.requestPoliciesFormGroup.getRawValue());

    this.policyService.setCurrentPolicyIdAndCost(0, 0.0);
    this.policyService.requestPolicyList.next(this.requestPoliciesFormGroup.getRawValue());//request);
    localStorage.setItem('request',JSON.stringify(this.requestPoliciesFormGroup.getRawValue()));
  }

  formatEnumForOutput(inp: String): String {
    return inp.split('_').join(' ');
  }

  get policyType() { return this.requestPoliciesFormGroup.get('policyType'); }
  get gender() { return this.requestPoliciesFormGroup.get('gender'); }
  get age() { return this.requestPoliciesFormGroup.get('age'); }
  get coverTillAge() { return this.requestPoliciesFormGroup.get('coverTillAge'); }
  get numberCovered() { return this.requestPoliciesFormGroup.get('numberCovered'); }
  get zipCode() { return this.requestPoliciesFormGroup.get('zipCode'); }
  get coverPeriod() { return this.requestPoliciesFormGroup.get('coverPeriod'); }
  get CoverValueEnum() { return CoverValueEnum; }
}
