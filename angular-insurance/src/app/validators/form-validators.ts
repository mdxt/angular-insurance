import { HttpClient } from "@angular/common/http";
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
   
}