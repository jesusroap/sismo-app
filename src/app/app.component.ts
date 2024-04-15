import { Component, Inject } from '@angular/core';
import { SismoDataService } from './services/sismo-data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  body: string;
  feature_id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  collection: any = [];
  currentPage = 1;
  totalItems = 0;
  itemsPerPage = 10;
  magType = ""

  constructor(
    private sismoDataService: SismoDataService,
    public dialog: MatDialog
  ) {
    for (let i = 1; i <= 100; i++) {
      this.collection.push(`item ${i}`);
    }
  }

  displayedColumns: string[] = ['id', 'title', 'mag_type', 'magnitude', 'actions'];
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
      this.dataSource = response.data; // Aquí obtienes los datos de tu API
      this.currentPage = response.pagination.current_page;
      this.totalItems = response.pagination.total;
      this.itemsPerPage = response.pagination.per_page;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: `<h2 mat-dialog-title>Comments</h2>
            <mat-dialog-content>
              <p>Write your comment</p>
              <mat-form-field>
                <mat-label>Body</mat-label>
                <input matInput [(ngModel)]="request.body">
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
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  request: any = {
    body: "",
    feature_id: this.data.feature_id
  }

  save() {
    this.sismoDataService.postComment(this.request).subscribe(data => {
      console.log(data)
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
