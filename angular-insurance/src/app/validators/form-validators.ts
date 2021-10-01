import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class FormValidators {
 
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        if(control.value != null && control.value.trim().length ===0){
        return { 'notOnlyWhitespace': true };
        }
        return null;
    }

    //function factory. used since normal validator functions cannot have params
    static valueFromEnumOnly(enumValues: string[]) : ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            //return null when you want the validation to pass
            if (control.value !== undefined && !enumValues.includes(control.value)) {
                console.log('invalid value of enum control: '+control.value, ', should be from '+enumValues);
                return { 'valueFromEnumOnly': true };
            }
            return null;
        };
    }

    static valueGreaterThan(lowerValueControl: AbstractControl) : ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            console.log('inside valueGreaterThan - '+control.value+', '+lowerValueControl.value);
            if(control.value != undefined && lowerValueControl.value != undefined && control.value <= lowerValueControl.value){
                console.log('invalid value of control ');
                return { 'lowValue' : true}
            }
            return null;
        };
    }
   
}