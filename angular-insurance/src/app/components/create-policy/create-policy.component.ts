import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoverValueEnum, ExaminationTypeEnum, PolicyTypesEnum } from 'src/app/common/request-policy-list';
import { UserService } from 'src/app/services/user.service';
import { FormValidators } from 'src/app/validators/form-validators';

@Component({
  selector: 'app-create-policy',
  templateUrl: './create-policy.component.html',
  styleUrls: ['./create-policy.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePolicyComponent implements OnInit {

  uploadForm: FormGroup;

  fileSuccessfullyUploaded: boolean;
  currentFileName: string;

  createPolicyType: string;

  createPolicyFormGroup: FormGroup;

  examinationTypes: string[] = Object.keys(ExaminationTypeEnum).filter(k => isNaN(+k));
  coverValues: string[] = Object.keys(CoverValueEnum).filter(k => !isNaN(+k));

  constructor(private userService: UserService, 
              private formBuilder: FormBuilder,
              private router: Router,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      profile: ['']
    });
    this.createPolicyFormGroup = this.formBuilder.group({});
  }

  onFileSelect(event) {
    this.setFileSuccessfullyUploaded(false);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('profile').setValue(file);
      this.currentFileName = file.name;
    }
  }

  doFileUpload() {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);

    this.userService.doUpload(formData).subscribe(
      next => { 
        console.log(JSON.stringify(next));
        this.setFileSuccessfullyUploaded(true);
      },
      error => alert('Error uploading file '+JSON.stringify(error.error)),
    )
  }

  setFileSuccessfullyUploaded(value: boolean){
    this.fileSuccessfullyUploaded = value; 
    console.log('fileSuccessfullyUploaded - '+this.fileSuccessfullyUploaded);
    this.ref.detectChanges();
  }

  handlePolicyTypeChange(policyType: string){
    for(let existingControl in this.createPolicyFormGroup.controls){
      this.createPolicyFormGroup.removeControl(existingControl);
    }

    if(policyType == 'LIFE'){
      this.createPolicyFormGroup.addControl('insurer', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('name', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('documentPath', new FormControl(this.currentFileName, [Validators.required, FormValidators.notOnlyWhitespace]));

      this.createPolicyFormGroup.addControl('additionalFeaturesCSV', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('minCoverValue', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(20000000)]));
      this.createPolicyFormGroup.addControl('maxCoverValue', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(20000000), FormValidators.valueGreaterThan(this.createPolicyFormGroup.get('minCoverValue'))]));
      this.createPolicyFormGroup.addControl('multiplierCoverValue', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));
      this.createPolicyFormGroup.addControl('minCoverTillAge', new FormControl(18, [Validators.required, Validators.min(18), Validators.max(99)]));
      this.createPolicyFormGroup.addControl('maxCoverTillAge', new FormControl(18, [Validators.required, Validators.min(18), Validators.max(99), FormValidators.valueGreaterThan(this.createPolicyFormGroup.get('minCoverTillAge'))]));
      this.createPolicyFormGroup.addControl('multiplierCoverTillAge', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));
      this.createPolicyFormGroup.addControl('examinationType', new FormControl(this.examinationTypes[0], [Validators.required, FormValidators.valueFromEnumOnly(this.examinationTypes)]));
    }
    if(policyType == 'DENTAL'){
      this.createPolicyFormGroup.addControl('insurer', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('name', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('documentPath', new FormControl(this.currentFileName, [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('additionalFeaturesCSV', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));

      this.createPolicyFormGroup.addControl('coverValuesCSV', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      
      // private Double multiplierCoverValue;
      this.createPolicyFormGroup.addControl('multiplierCoverValue', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));

      // //age till which the policy applies
      // private Integer minCoverPeriod;
      // private Integer maxCoverPeriod;
      // private Double multiplierCoverPeriod;
      this.createPolicyFormGroup.addControl('minCoverPeriod', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]));
      this.createPolicyFormGroup.addControl('maxCoverPeriod', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10), FormValidators.valueGreaterThanOrEqualTo(this.createPolicyFormGroup.get('minCoverPeriod'))]));
      this.createPolicyFormGroup.addControl('multiplierCoverPeriod', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));

      // private Integer minNumberCovered;
      // private Integer maxNumberCovered;
      // private Double multiplierNumberCovered;
      this.createPolicyFormGroup.addControl('minNumberCovered', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4)]));
      this.createPolicyFormGroup.addControl('maxNumberCovered', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4), FormValidators.valueGreaterThanOrEqualTo(this.createPolicyFormGroup.get('minNumberCovered'))]));
      this.createPolicyFormGroup.addControl('multiplierNumberCovered', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));
      
      // private Long deductible;
      this.createPolicyFormGroup.addControl('deductible', new FormControl(1, [Validators.required, Validators.min(0), Validators.max(500000)]));
    }
    if(policyType == 'DENTAL_AND_VISION'){
      this.createPolicyFormGroup.addControl('insurer', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('name', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('documentPath', new FormControl(this.currentFileName, [Validators.required, FormValidators.notOnlyWhitespace]));
      this.createPolicyFormGroup.addControl('additionalFeaturesCSV', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));

      this.createPolicyFormGroup.addControl('coverValuesCSV', new FormControl('', [Validators.required, FormValidators.notOnlyWhitespace]));
      
      // private Double multiplierCoverValue;
      this.createPolicyFormGroup.addControl('multiplierCoverValue', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));

      // //age till which the policy applies
      // private Integer minCoverPeriod;
      // private Integer maxCoverPeriod;
      // private Double multiplierCoverPeriod;
      this.createPolicyFormGroup.addControl('minCoverPeriod', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10)]));
      this.createPolicyFormGroup.addControl('maxCoverPeriod', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(10), FormValidators.valueGreaterThanOrEqualTo(this.createPolicyFormGroup.get('minCoverPeriod'))]));
      this.createPolicyFormGroup.addControl('multiplierCoverPeriod', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));

      // private Integer minNumberCovered;
      // private Integer maxNumberCovered;
      // private Double multiplierNumberCovered;
      this.createPolicyFormGroup.addControl('minNumberCovered', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4)]));
      this.createPolicyFormGroup.addControl('maxNumberCovered', new FormControl(1, [Validators.required, Validators.min(1), Validators.max(4), FormValidators.valueGreaterThanOrEqualTo(this.createPolicyFormGroup.get('minNumberCovered'))]));
      this.createPolicyFormGroup.addControl('multiplierNumberCovered', new FormControl(0.01, [Validators.required, Validators.min(0.01), Validators.max(200)]));
      
      // private Long deductible;
      this.createPolicyFormGroup.addControl('deductible', new FormControl(1, [Validators.required, Validators.min(0), Validators.max(500000)]));
      this.createPolicyFormGroup.addControl('coversOrthodontia', new FormControl(false, [Validators.required]));
    }
    
    this.createPolicyType = policyType;
  }

  onSubmit(){
    console.log('create policy form data for policy type '+this.createPolicyType+' - '+JSON.stringify(this.createPolicyFormGroup.getRawValue()));
    this.userService.createPolicy(this.createPolicyType, this.createPolicyFormGroup.getRawValue())
                    .subscribe(next => { 
                                 console.log('response from new policy submission - '+JSON.stringify(next)); 
                                 alert('Policy successfully created');
                                 this.router.navigate(['/policies']);
                               },
                               error => {
                                 console.log('error from new policy submission - '+JSON.stringify(error));
                                 alert('Error - '+error.error);
                               }
                              );
  }

  coverValuesSelected: number[] = [];
  newCoverValueSelected(value: string){
    console.log(value);
    if(this.coverValuesSelected.includes(+value)) return;
    this.coverValuesSelected.push(+value);
    //console.log(this.coverValuesSelected);
    this.createPolicyFormGroup.get('coverValuesCSV').setValue(this.coverValuesSelected.join(','));
  }

  getFormValidationErrors() {
    Object.keys(this.createPolicyFormGroup.controls).forEach(key => {
  
    const controlErrors: ValidationErrors = this.createPolicyFormGroup.get(key).errors;
    if (controlErrors != null) {
          Object.keys(controlErrors).forEach(keyError => {
            console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          });
        }
      });
    }
}
