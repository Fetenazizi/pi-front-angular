import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserServiceService } from '../../service/user-service.service';
import { User } from 'src/app/model/User';
import {Router} from '@angular/router';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {
  Userform: FormGroup;
  constructor(private userService:  UserServiceService,private rt:Router){
    this.Userform=new FormGroup({
      name: new FormControl('',[Validators.required]),
      age: new FormControl('',[Validators.required]),
      email: new FormControl('',[Validators.required, Validators.minLength(10)]),// controle de saisie
      password: new FormControl('',[Validators.required, Validators.minLength(10)]),
      });
    }

    save(){
      if (this.Userform.valid) {
        const newUser = {
          ...this.Userform.value, // Récupère title et description
         
        };

      this.userService.addUser(newUser).subscribe(
        ()=> this.rt.navigateByUrl('/backoffice/user')
      )
  
    }
  }
}
