import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Project } from '../model/project.model';
import { ToastrService } from 'ngx-toastr';
import { text } from '@angular/core/src/render3/instructions';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  }
  )
};

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly projectApiBaseUrl: string = 'http://localhost:3000/api/project';

  dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
  // Temporarily stores data from dialogs
  dialogData: any;

  constructor(private httpClient: HttpClient, private toastrService: ToastrService) { }

  get data(): Project[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  getProjects(): void {
    this.httpClient.get<Project[]>(this.projectApiBaseUrl, httpOptions).subscribe(response => {
      this.dataChange.next(response);
    },
      (error: HttpErrorResponse) => {
        console.log(error.name + ' ' + error.message);
      });
  }


  getProject(id: number): Observable<Project> {
    const url = `${this.projectApiBaseUrl}/${id}`;
    return this.httpClient.get<Project>(url, httpOptions);
  }

  addProject(project: Project): void {
    this.httpClient.post<Project>(this.projectApiBaseUrl, project, httpOptions).subscribe(response => {
      this.dialogData = response;
      this.toastrService.success("Project " + project.name + " successfully created.", "Success!");
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error('Error occurred. Details: ' + err.name + ' ' + err.message);
      });
  }


  deleteProject(id: number): void {
    const url = `${this.projectApiBaseUrl}/${id}`;
    this.httpClient.delete<string>(url, {observe: 'response'}).subscribe(response => {
      if (response.status == 200) {
        this.toastrService.success('Project successfully deleted');
      } else {
        this.toastrService.error('Error while deleting. Please try again after some time.');
      }

    },
      (err: HttpErrorResponse) => {
        if (err.status == 200) {
          this.toastrService.success('Project successfully deleted');
        } else {
          this.toastrService.error('Error occurred. Details: ' + err.name + ' ' + err.message);
        }        
      }
    );
  }


  updateProject(project: Project): void {
    this.httpClient.put<Project>(this.projectApiBaseUrl, project, httpOptions).subscribe(response => {
      this.dialogData = project;
      this.toastrService.success('Project ' + project.name + " successfully updated.");
    },
      (err: HttpErrorResponse) => {
        this.toastrService.error('Error occurred. Details: ' + err.name + ' ' + err.message);
      });
  }
}
