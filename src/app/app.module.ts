import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatSortModule,
  MatTableModule, MatToolbarModule,
} from '@angular/material';
import { AddProjectComponent } from '../project-component/add-project-component/add.dialog.component';
import { DeleteProjectComponent } from '../project-component/delete-project-component/delete.dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectService } from '../project-component/service/project.service';
import { UpdateProjectComponent } from '../project-component/update-project-component/update.dialog.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    AddProjectComponent,
    UpdateProjectComponent,
    DeleteProjectComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDialogModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right'
    })
  ],
  entryComponents: [
    AddProjectComponent,
    UpdateProjectComponent,
    DeleteProjectComponent
  ],
  providers: [
    ProjectService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
