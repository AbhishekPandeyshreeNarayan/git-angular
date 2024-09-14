import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class UserListComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ["id", "name", "email", "roles", "action"];
  dataSource = new MatTableDataSource<userElement>();
  pageSize = 10;
  allUsers: userElement[] = [];
  selectedRoles: Set<string> = new Set();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: UserService, private snackbar: SnackbarService) { }

  ngOnInit() {
    this.getUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers() {
    this.api.getAllUsers().subscribe(res => {
      this.allUsers = res;
      this.dataSource.data = this.allUsers;
    });
  }

  Openpopup(id: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: { id: id }
    });

    _popup.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }

  editUser(id: any) {
    this.Openpopup(id);
  }

  deleteUser(userId: any): void {
    const dialogRef = this.dialog.open(AlterDailogComponent, {
      data: {
        message: 'Are you sure you want to delete this user?',
        buttonText: { ok: 'Yes', cancel: 'No' }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.api.deleteUsers(userId).subscribe(
          () => {
            this.getUsers();
            this.snackbar.openSnackBar('Deleted successfully', 'Cancel');
          },
          error => {
            this.snackbar.openSnackBar('Error deleting user:', error);
          }
        );
      }
    });
  }

  applyFilter(event: Event) {
    const input = event.target as HTMLInputElement;
    const filterValue = input.value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
  

  onRoleFilterChange(event: any, role: string) {
    if (event.checked) {
      this.selectedRoles.add(role);
    } else {
      this.selectedRoles.delete(role);
    }
    this.filterByRoles();
  }

  filterByRoles() {
    if (this.selectedRoles.size === 0) {
      this.dataSource.data = this.allUsers;
    } else {
      this.dataSource.data = this.allUsers.filter(user =>
        user.roles.split(',').map(role => role.trim()).some(role => this.selectedRoles.has(role))
      );
    }
    // Reset filter after role-based filtering
    this.dataSource.filter = this.dataSource.filter;
  }
}
