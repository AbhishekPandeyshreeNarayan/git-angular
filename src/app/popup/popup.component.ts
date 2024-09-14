import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  userForm!: FormGroup;
  constructor(private builder: FormBuilder, private dialog: MatDialog, private api: UserService, private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.userForm = this.builder.group({
      id: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      roles: ['', Validators.required],
    });

  }

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
          this.snackbar.openSnackBar('updated successfully', 'cancel')
        });
      } else {
        this.api.addUsers(this.userForm.value).subscribe(res => {
          this.closepopup();
          this.snackbar.openSnackBar('saved successfully', 'cancel')
        });
      }
    }
  }

  get name() {
    return this.userForm.get('name');
  }

  get email() {
    return this.userForm.get('email');
  }

  get roles() {
    return this.userForm.get('roles');
  }

  closepopup() {
    this.dialog.closeAll();
  }

}
