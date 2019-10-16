import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import { ProjectService } from '../service/project.service';

@Component({
  selector: 'app-baza.dialog',
  templateUrl: '../update-project-component/update.dialog.html',
  styleUrls: ['../update-project-component/update.dialog.css']
})
export class UpdateProjectComponent {

  constructor(public dialogRef: MatDialogRef<UpdateProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, public projectService: ProjectService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('name') ? 'Please provide a valid name' :
        '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update(): void {
    this.projectService.updateProject(this.data);
  }
}
