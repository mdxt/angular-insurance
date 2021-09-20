import { Component, OnInit, RootRenderer } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/authservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PolicyService } from 'src/app/services/policy.service';
import { environment } from 'src/environments/environment';
import { FormService } from 'src/app/services/form.service';
import { FormValidators } from 'src/app/validators/form-validators';
import { getLocaleDateFormat } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  
  requestForm: FormGroup;
  policyTypes: string[];

  formData: {[control: string]: any}; 

  returnTo: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private formService: FormService) { 
    this.form = this.formBuilder.group({
      email: ['',Validators.required],
      password: ['',Validators.required]
    });

    this.formService.policyTypes.subscribe(
      data => {
        this.policyTypes = data;
        console.log('set policy types - '+this.policyTypes);
        if(this.policyTypes == null) return;

        this.requestForm = new FormGroup({
          policyType: new FormControl(this.policyTypes[0], [Validators.required, FormValidators.valueFromEnumOnly(this.policyTypes)]),
          // request: new FormArray([])
        });
        
        
        // this.formBuilder.group({
        //   policyType: [this.policyTypes[0], [Validators.required, FormValidators.valueFromEnumOnly(this.policyTypes)]],
        //   request: this.formBuilder.array([])
        // });
        this.requestForm.get("policyType").valueChanges.subscribe(value => this.getForm(value));
      }
    ); 
  }
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => { this.returnTo = params['returnTo'] || '/policies'; console.log('query params - '+JSON.stringify(params))});
  }

  login() {
    const val = this.form.value;
    if (val.email && val.password) {
      this.authService.login(val.email, val.password)
          .subscribe(
              data => {
                console.log('login succeeded? = '+data);
                if(data) {
                  this.router.navigateByUrl(this.returnTo);
                }
              }
          );
    }
  }

  getForm(value: string): void {
    console.log('called get form from server with type- '+value);
    this.formService.getForm(value).subscribe(
        next => this.setForm(next),
        error => console.log('Error obtaining form data from server- '+JSON.stringify(error))
      );
  }

  setForm(data: any) {
    console.log('Obtained the following form data from server- '+JSON.stringify(data));

    //remove any existing form controls except policy type
    for(let existingControl in this.requestForm.controls){
      if(existingControl !== "policyType") this.requestForm.removeControl(existingControl);
    }
    this.formData = {}

    for(let control of data){
      // construct form control from data
      this.formData[control['name']] = control;

      if(control['controlType'] == 'select') {
        console.log('select control');
        //this.permittedValues[control['name']] = control['permittedValues'];
        this.requestForm.addControl(control['name'], new FormControl( 
          control['permittedValues'][0], [Validators.required, FormValidators.valueFromEnumOnly(control['permittedValues'])]
          )
        );
        continue;
      }
      if(control['controlType'] == 'input') {
        console.log('select control');
        if(control['dataType'] == 'number') {
          this.requestForm.addControl(control['name'], new FormControl(
            +control['min'], [Validators.required, Validators.min(+control['min']), Validators.max(+control['max'])]
          )
          );
        }
      }
    }
    
    console.log(this.requestForm.get('gender'));
    console.log(this.formData['gender']);
  }

  // get controlContainer() {
  //   return this.requestForm.get('request') as FormArray;
  // }

  formatEnumForOutput(inp: String): String {
    return inp.split('_').join(' ');
  }



  // tryAdmin() {
  //   console.log('in tryAdmin');
  //   this.httpClient.get(environment.apiUrl+'/v1/tests/admin/test2'
  //                 , {responseType: 'text'})
  //                 .subscribe(
  //                   next => console.log('result of tryAdmin- '+next),
  //                   error => console.log('tryAdmin returned error- '+error));
  // }
}


