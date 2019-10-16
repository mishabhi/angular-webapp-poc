import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import { ProjectService } from '../service/project.service';


@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../delete-project-component/delete.dialog.html',
  styleUrls: ['../delete-project-component/delete.dialog.css']
})
export class DeleteProjectComponent {

  constructor(public dialogRef: MatDialogRef<DeleteProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public projectService: ProjectService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmDelete(): void {
    this.projectService.deleteProject(this.data.id);
  }
}
