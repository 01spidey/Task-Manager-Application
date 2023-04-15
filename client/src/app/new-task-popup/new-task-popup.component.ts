import { Component,ElementRef,EventEmitter,Inject,OnInit,Output, ViewChild} from '@angular/core';
import { NewListPopupComponent } from '../new-list-popup/new-list-popup.component';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServerResponse, task_item } from 'src/model';

@Component({
  selector: 'app-new-task-popup',
  templateUrl: './new-task-popup.component.html',
  styleUrls: ['./new-task-popup.component.scss']
})
export class NewTaskPopupComponent implements OnInit{

  // @ViewChild('task_area') task_area!: ElementRef<HTMLInputElement>;

  list_name:string = ""
  public task:string = ""
  card_title:string = ""
  action_name:string = ""
  text_area:HTMLTextAreaElement|null = null; 
  
  constructor(
    private dialogref: MatDialogRef<NewListPopupComponent>, 
    private toastr:ToastrService,
    private service:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any){
      this.list_name = data['list']
      
    }
  
  ngOnInit(): void {
    this.text_area = document.getElementById('task_desc') as HTMLTextAreaElement;
    
    if(this.data['action']==='Edit'){
      this.card_title = "Edit Task"
      this.action_name = "Save"
      this.task = this.data['task'];
    }else{ 
      this.card_title = "Add Task"
      this.action_name = "Add"
    }
  }


  addTask(){
    // this.task = this.text_area!.value;
      
    if(this.data['action']=='Add'){
        
      console.log(this.task)
      this.service.addtask(this.list_name,this.task).subscribe(
        (res:ServerResponse)=>{
          if(res.success){
            this.toastr.success(res.message)
            
            this.dialogref.close()
            
          }else this.toastr.warning(res.message)
        },err=>{
          this.toastr.error('Server Not Reachable!!')
        }
      )
    } 

    else{ 
      let old_task = this.data['task'];
      if(old_task!==this.task){
        this.service.editTask(old_task,this.task,this.list_name).subscribe(
          (res:ServerResponse)=>{
            this.toastr.success(res.message)
            this.dialogref.close()
          },err=>{
            this.toastr.error("Server Not Reachable!!")
          }
        )
      }else{ 
        this.dialogref.close()
      }

    }
    
  }  

  dialogClose(){
    this.dialogref.close()
  }
}
