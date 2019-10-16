import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../project-component/service/project.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { AddProjectComponent } from '../project-component/add-project-component/add.dialog.component';
import { UpdateProjectComponent } from '../project-component/update-project-component/update.dialog.component';
import { DeleteProjectComponent } from '../project-component/delete-project-component/delete.dialog.component';
import { BehaviorSubject, fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Project } from '../project-component/model/project.model';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  displayedColumns = ['id', 'name', 'status', 'description', 'actions'];
  projectData: ProjectService | null;
  dataSource: ProjectDataSource | null;
  index: number;
  id: number;

  constructor(public httpClient: HttpClient,
    public dialog: MatDialog,
    public toastrService: ToastrService,
    public dataService: ProjectService) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;

  ngOnInit() {
    this.loadData();
  }

  refresh() {
    this.loadData();
  }

  addProject(project: Project) {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      data: { project: project }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.projectData.dataChange.value.push(this.dataService.getDialogData());
        this.refreshTable();
      }
    });
  }

  updateProject(project: Project) {
    const dialogRef = this.dialog.open(UpdateProjectComponent, {
      data: project
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        // When using an edit things are little different, firstly we find record inside DataService by id
        const foundIndex = this.projectData.dataChange.value.findIndex(x => x.id === this.id);
        // Then you update that record using data from dialogData (values you enetered)
        this.projectData.dataChange.value[foundIndex] = this.dataService.getDialogData();
        // And lastly refresh table
        this.refreshTable();
      }
    });
  }

  deleteProject(id: number) {
    this.id = id;
    const dialogRef = this.dialog.open(DeleteProjectComponent, {
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        const foundIndex = this.projectData.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.projectData.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }


  private refreshTable() {
    this.paginator._changePageSize(this.paginator.pageSize);
  }

  public loadData() {
    this.projectData = new ProjectService(this.httpClient, this.toastrService);
    this.dataSource = new ProjectDataSource(this.projectData, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}

export class ProjectDataSource extends DataSource<Project> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: Project[] = [];
  renderedData: Project[] = [];

  constructor(public projectData: ProjectService,
    public paginator: MatPaginator,
    public sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this.paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Project[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this.projectData.dataChange,
      this.sort.sortChange,
      this._filterChange,
      this.paginator.page
    ];

    this.projectData.getProjects();


    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this.projectData.data.slice().filter((project: Project) => {
        const searchStr = (project.id + project.name).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
      return this.renderedData;
    }
    ));
  }

  disconnect() { }


  /** Returns a sorted copy of the database data. */
  sortData(data: Project[]): Project[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
