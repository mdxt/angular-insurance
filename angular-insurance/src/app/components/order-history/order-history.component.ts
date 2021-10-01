import { JsonpClientBackend } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { request } from 'http';
import { error } from 'protractor';
import { take } from 'rxjs/operators';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/authservice.service';
import { PolicyService } from 'src/app/services/policy.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderHistoryComponent implements OnInit {
  user: User;
  type: string;
  data: any;
  dataKeys: any;
  policyType: string;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private policyService: PolicyService,
              private userService: UserService,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    this.authService.user.subscribe(user => this.user = user);
    console.log('route - '+this.route.toString())
    this.route.url.subscribe(url => { 
      console.log('order details url - '+JSON.stringify(url));
      this.type = url[0]['path'];
      console.log(this.type);
    });

  }

  getPurchaseData(policyType: string){
    this.policyType = policyType;
    console.log('called get purchase data of type '+policyType);
    console.log('component type - '+this.type);
    if(this.type == 'history'){
      this.policyService.getUserOrderHistory(policyType).pipe(take(1)).subscribe(
        next => this.updateDisplayedData(next, policyType),
        error => console.log(JSON.stringify(error)),
      );
    } 
    else if(this.type == 'underwrite'){
      this.policyService.getPoliciesForUnderwriter(policyType).pipe(take(1)).subscribe(
        next => this.updateDisplayedData(next, policyType),
        error => console.log(JSON.stringify(error))
      );
    }
    else if(this.type == 'all'){
      this.userService.getAllPolicyPurchases(policyType).pipe(take(1)).subscribe(
        next => this.updateDisplayedData(next, policyType),
        error => console.log(JSON.stringify(error))
      );
    }
  }

  updateDisplayedData(data: any, policyType: string){
    this.data = data; 
    this.dataKeys = (data && data[0]) ? Object.keys(data[0]) : null;
    console.log('data for operation type '+this.type+', policy type '+policyType+' is '+JSON.stringify(data)); 
    console.log('dataKeys - '+this.dataKeys);
    this.ref.detectChanges();
  }

  setPolicyApproval(id: string, status: string){
    console.log('setPolicyApproval '+id+', '+status);
    
    if(status!='yes' && status!='no') return;
    
    this.policyService.setPolicyApproval(this.policyType, (status == 'yes') ? true : false, +id).subscribe(
      next => { 
        console.log(JSON.stringify(next)); 
        alert(JSON.stringify(next));
      },
      error => { 
        console.log(JSON.stringify(error));
        alert('Error while setting approval - '+error.error);
      }
    );
    
  }

  formatEnumForOutput(inp: String): String {
    return inp.split('_').join(' ');
  }
}
