import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../user.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { userElement } from '../model/users';
import { AlterDailogComponent } from '../alter-dailog/alter-dailog.component';
import { SnackbarService } from '../snackbar.service';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  userdata!: userElement[];
  finaldata: any;
  pageSize!: number;
  constructor(private dialog: MatDialog, private api: UserService, private snackbar: SnackbarService) { }
  @ViewChild(MatPaginator) _paginator!: MatPaginator;
  @ViewChild(MatSort) _sort!: MatSort;

  ngOnInit() {
    this.getUsers();
    this.pageSize = 5;
  }

  displayColums: string[] = ["id", "name", "email", "roles", "action"]

  Openpopup(id: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        id: id
      }
    })
    _popup.afterClosed().subscribe(r => {
      this.getUsers();
    });
  }

  getUsers() {
    this.api.getAllUsers().subscribe(res => {
      this.userdata = res;
      this.finaldata = new MatTableDataSource<userElement>(this.userdata);
      if (this._paginator) {
        this.finaldata.paginator = this._paginator;
      }
      if (this._sort) {
        this.finaldata.sort = this._sort;
      }
    });
  }

  ngAfterViewInit() {
    this.finaldata.paginator = this._paginator;
    this.finaldata.sort = this._sort;
  }


  editUser(id: any) {
    this.Openpopup(id);
  }

  deleteUser(userId: any): void {
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(AlterDailogComponent, {
      data: {
        message: 'Are you sure you want to delete this user?',
        buttonText: {
          ok: 'Yes',
          cancel: 'No'
        }
      }
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        // User confirmed deletion
        this.api.deleteUsers(userId).subscribe(
          () => {
            this.getUsers(); // Refresh the user list after deletion
            this.snackbar.openSnackBar('deleted successfull', 'cancel')
          },
          error => {
            this.snackbar.openSnackBar('Error deleting user:', error)
            // Handle the error as needed
          }
        );
      }
      // If result is 'cancel', do nothing (the dialog was dismissed)
    });
  }

}
