import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/authservice.service';
import { PolicyService } from 'src/app/services/policy.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  user: User;
  type: string;
  data: any;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private policyService: PolicyService) { }

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
    console.log('called get purchase data of type '+policyType);
    console.log('component type - '+this.type);
    if(this.type == 'history'){
      this.policyService.getUserOrderHistory(policyType).subscribe(data => this.data = data);
    } 
    else if(this.type == 'underwrite'){
      this.policyService.getPoliciesForUnderwriter(policyType).subscribe(data => { this.data = data; console.log('data - '+data) });
    }
  }

}
