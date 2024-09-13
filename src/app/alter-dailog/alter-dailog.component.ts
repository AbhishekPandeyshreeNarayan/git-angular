import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alter-dailog',
  templateUrl: './alter-dailog.component.html',
  styleUrls: ['./alter-dailog.component.scss']
})
export class AlterDailogComponent  {

  constructor(
    public dialogRef: MatDialogRef<AlterDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close('ok');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }

}
