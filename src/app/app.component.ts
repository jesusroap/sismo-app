import { Component, Inject } from '@angular/core';
import { SismoDataService } from './services/sismo-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

export interface DialogData {
  body: string;
  feature_id: number;
}

interface MagType {
  value: string;
  viewValue: string;
}

interface PerPage {
  value: number | string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 5;
  magType = ""

  magTypes: MagType[] = [
    {value: '', viewValue: 'Select'},
    {value: 'md', viewValue: 'md'},
    {value: 'ml', viewValue: 'ml'},
    {value: 'ms', viewValue: 'ms'},
    {value: 'mw', viewValue: 'mw'},
    {value: 'me', viewValue: 'me'},
    {value: 'mi', viewValue: 'mi'},
    {value: 'mb', viewValue: 'mb'},
    {value: 'mlg', viewValue: 'mlg'},
  ];

  itemsPerPages: PerPage[] = [
    {value: 1, viewValue: '1'},
    {value: 5, viewValue: '5'},
    {value: 50, viewValue: '50'},
    {value: 500, viewValue: '500'},
    {value: 1000, viewValue: '1000'},
  ];

  constructor(
    private sismoDataService: SismoDataService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  displayedColumns: string[] = ['id', 'place', 'magnitude', 'coordinates', 'time', 'mag_type', 'tsunami', 'actions'];
  dataSource: any = [];

  ngOnInit() {
    this.loadData()
  }

  openDialog(feature_id: number): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {feature_id: feature_id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

  loadData(page?: number, perPage?: number, magType?: string) {
    this.sismoDataService.getData(page || this.currentPage, perPage || this.itemsPerPage, magType || this.magType).subscribe((response: any) => {
      if (response.pagination.total == 0) {
        this.snackBar.open("No seismological data found", "", {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        })
      }

      this.dataSource = response.data;
      this.currentPage = response.pagination.current_page;
      this.totalItems = response.pagination.total;
      this.itemsPerPage = response.pagination.per_page;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h2 mat-dialog-title>Feature {{request.feature_id}}</h2>
            <mat-dialog-content>
              <p>Write your comment</p>
              <mat-form-field>
                <mat-label>Body</mat-label>
                <textarea matInput [(ngModel)]="request.body"></textarea>
              </mat-form-field>
            </mat-dialog-content>
            <mat-dialog-actions>
              <button mat-button (click)="onNoClick()">Close</button>
              <button mat-button [mat-dialog-close]="request.body" cdkFocusInitial (click)="save()">Save</button>
            </mat-dialog-actions>`,
})
export class DialogOverviewExampleDialog {
  constructor(
    public sismoDataService: SismoDataService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  request: any = {
    body: "",
    feature_id: this.data.feature_id
  }

  save() {
    if (!this.request.body) {
      this.snackBar.open("The body can't be blank", "", {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      })
      return
    }
    this.sismoDataService.postComment(this.request).subscribe(data => {
      console.log(data)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
