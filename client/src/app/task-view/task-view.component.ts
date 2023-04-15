import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { NewListPopupComponent } from '../new-list-popup/new-list-popup.component';
import { GetListsResponse, GetTasksResponse, ServerResponse, list_item, task_item } from 'src/model';
import { ToastrService } from 'ngx-toastr';
import { NewTaskPopupComponent } from '../new-task-popup/new-task-popup.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {
  list_flag = true;
  task_flag = true;
  username = "";
  
  tasks:task_item[] = []
  lists:list_item[] = []

  list_title = ""
  list_desc = ""
  activeList:list_item|null = null;
  

  check_flag(){
    if(this.lists.length>0) this.list_flag = true;
    else this.list_flag = false;

    if(this.tasks.length>0) this.task_flag = true;
    else this.task_flag = false;
  }

  ngOnInit(){
    
  }

  constructor(
    private service:AuthService, 
    private dialog:MatDialog,
    private toastr:ToastrService,
    private router:Router){
      this.username = sessionStorage.getItem('user')!
      this.service.initUser();
      this.fetchList(this.username,true);
  }

  fetchList(username:string, is_new:boolean){
    this.service.getLists(username).subscribe(
      (res:GetListsResponse)=>{
        if(res.success){
          let temp = []
          for(let list_item in res.lists){
            temp.push(res.lists[list_item]) 
          }
          this.lists = temp
          if(this.lists.length>0){
            if(is_new) this.getTasks(this.lists[0]);
            else this.getTasks(this.lists[this.lists.length-1])
          }
        }
        this.check_flag();
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  newList(){
    const popup = this.dialog.open(NewListPopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data : {
        'action': 'new'
      }
    }
    );

    popup.afterClosed().subscribe(
      res=>{
        this.fetchList(this.username,false)
      }
    )
  }

  getTasks(list_item:list_item){
    
    this.activeList = list_item
    console.log(this.activeList)

    this.list_title = list_item.title
    this.list_desc = list_item.desc

    // console.log(this.list_title)
    // console.log(this.list_desc)
    
    const temp:task_item[] = []
    this.service.getTasks(this.list_title).subscribe(
      (res:GetTasksResponse)=>{
        for(let i=0;i<res.tasks.length;i++){
          temp.push(res.tasks[i]);  
        }
        this.tasks = temp
        this.check_flag()
      },
      err=>{

      }
    )
  }

  addTask(){
    const popup = this.dialog.open(NewTaskPopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data : {
        'action':'Add',
        'list':this.activeList!.title
      }
    });
    popup.afterClosed().subscribe(
      res=>{
        this.getTasks(this.activeList!)
      }
    )
  }

  completeTask(task_item:task_item){
    if(task_item.completed==false){
      for(let task in this.tasks){
        if(this.tasks[task].task===task_item.task){
          this.tasks[task].completed = true;
        }
      }

      this.service.completeTask(this.activeList!,task_item).subscribe(
        (res:ServerResponse)=>{
          this.toastr.success(res.message);
        },
        err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
    }
    else this.toastr.success('Task Already Completed!!')
  }

  retrieveTask(task_item:task_item){
  
    for(let task in this.tasks){
      if(this.tasks[task].task===task_item.task){
        this.tasks[task].completed = false;
      }
    }

    this.service.retrieveTask(this.activeList!,task_item).subscribe(
      (res:ServerResponse)=>{
        this.toastr.warning(res.message);
      },
      err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
    
  }

  deleteTask(task_item:task_item){
    this.service.deleteTask(this.activeList!,task_item).subscribe(
      (res:ServerResponse)=>{
        this.toastr.warning(res.message)
        this.getTasks(this.activeList!)
      },err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  deleteList(list_item:list_item){
    this.service.deleteList(list_item).subscribe(
      (res:ServerResponse)=>{
        this.toastr.warning(res.message)
        
        this.fetchList(this.username,false)
      },err=>{
        this.toastr.error('Server Not Reachable!!')
      }
    )
  }

  editTask(task_item:task_item){
    const popup = this.dialog.open(NewTaskPopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data : {
        'action':'Edit',
        'list':this.activeList!.title,
        'task':task_item.task
      }
    });
    popup.afterClosed().subscribe(
      res=>{
        this.getTasks(this.activeList!)
      }
    )
  }

  editList(list_item:list_item){
    // this.toastr.success("List will be Edited!!")
    const popup = this.dialog.open(NewListPopupComponent,{
      enterAnimationDuration:'300ms',
      exitAnimationDuration:'100ms',
      data : {
        'action': 'edit',
        'old_list':list_item
      }
    });

    popup.componentInstance.newListCreated.subscribe(newList => {
      this.activeList = newList
      console.log(this.activeList)
      this.fetchList(this.username,false)
    });
     

    
  }

  logout(){
    sessionStorage.setItem('user','null')
    this.router.navigate([''])
  }

}
