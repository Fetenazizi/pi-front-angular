import { Component } from '@angular/core';
import { UserServiceService } from '../../service/user-service.service';
import { User } from 'src/app/model/User';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css',"../../../assets/BackOffice/assets/css/bootstrap.min.css",
              "../../../assets/BackOffice/assets/css/demo.css",
              "../../../assets/BackOffice/assets/css/fonts.css",
              "../../../assets/BackOffice/assets/css/fonts.min.css",
              "../../../assets/BackOffice/assets/css/kaiadmin.css",
              "../../../assets/BackOffice/assets/css/kaiadmin.min.css"]
})
export class UserComponent {
  listUser!: User[]; 

  searchTerm: string = "";
  
  constructor(private userService: UserServiceService) { }
  
  ngOnInit() {
    this.userService.getUser().subscribe(
      (data) => {
        this.listUser = data;
      }
    );
  }
  
  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe(
      () => this.ngOnInit()
    );
  }
  
  get filteredUser(): User[] {
    return this.listUser.filter(user =>
      user.id.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
}
