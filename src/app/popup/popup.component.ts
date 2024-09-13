import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  editdata: any;
  constructor(private builder: FormBuilder, private dialog: MatDialog, private api: UserService, private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    userForm = this.builder.group({
      id: this.builder.control({ value: '', disabled: true }),
      name: this.builder.control('', Validators.required),
      email: this.builder.control('', Validators.required,),
      roles: this.builder.control('', Validators.required),
    });

  ngOnInit(): void {
    if (this.data.id != '' && this.data.id != null) {
      this.api.getUsers(this.data.id).subscribe(response => {
        this.editdata = response;
        this.userForm.setValue({
          id: this.editdata.id, name: this.editdata.name, email: this.editdata.email,
          roles: this.editdata.roles
        });
      });
    }
  }

  addUsers() {
    if (this.userForm.valid) {
      const Editid = this.userForm.getRawValue().id;
      if (Editid != '' && Editid != null) {
        this.api.updateUsers(Editid, this.userForm.getRawValue()).subscribe(res => {
          this.closepopup();
          this.snackbar.openSnackBar('updated successfully','cancel')
        });
      } else {
        this.api.addUsers(this.userForm.value).subscribe(res => {
          this.closepopup();
          this.snackbar.openSnackBar('saved successfully','cancel')
        });
      }
    }
  }

  closepopup() {
    this.dialog.closeAll();
  }
}
