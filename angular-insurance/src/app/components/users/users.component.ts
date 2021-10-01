import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { error } from 'protractor';
import { Subject } from 'rxjs';
import { debounceTime, map, take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'], 
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {

  searchForm: FormGroup;
  public keyUp = new Subject<KeyboardEvent>();

  userData: any[];

  constructor(private userService: UserService,
              private ref: ChangeDetectorRef) { }

  ngOnInit() {
    //this.getUsersMatching('ab');
    this.keyUp.pipe(
        debounceTime(500)
      ).subscribe(next => {
        this.onSearchStringChanged(next);
      });
  }

  onSearchStringChanged(event: any){
    console.log(event.target.value);
    //this.getUsersMatching(event.target.value);
    this.userService.getUsersMatching(event.target.value).subscribe(
      next => {
        console.log('users matching '+event.target.value+' are '+JSON.stringify(next));
        this.userData = next;
        this.ref.detectChanges()
      },
      error => { 
        console.log(error.toString()); 
        this.userData = null;
        this.ref.detectChanges()
      }
    );
  }

  setAsUnderwriter(email: string){
    this.userService.setAsUnderwriter(email).pipe(take(1)).subscribe(
      next => alert('User has been set to underwriter'),
      error => alert('Error'+error.error)
    )
  }
}
