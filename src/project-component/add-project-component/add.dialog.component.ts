import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {ProjectService} from '../service/project.service'
import { Project } from '../model/project.model';

 
@Component({
  selector: 'app-add.dialog',
  templateUrl: '../add-project-component/add.dialog.html',
  styleUrls: ['../add-project-component/add.dialog.css']
})

export class AddProjectComponent {

  constructor(public dialogRef: MatDialogRef<AddProjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: Project,
              public projectService: ProjectService) { }

  formControl = new FormControl('', [
    Validators.required
  ]);

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
      this.formControl.hasError('name') ? 'Not a valid email' :
        '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    this.projectService.addProject(this.data);
  }
}
