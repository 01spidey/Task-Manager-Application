import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ServerResponse, list_item } from 'src/model';

@Component({
  selector: 'app-new-list-popup',
  templateUrl: './new-list-popup.component.html',
  styleUrls: ['./new-list-popup.component.scss']
})
export class NewListPopupComponent implements OnInit{

  card_title = ""
  action_name = ""
  public new_list_name = ""
  public new_list_desc = ""

  old_list_name = ""
  old_list_desc = ""

  @Output() newListCreated = new EventEmitter<list_item>();


  constructor(
    private dialogref: MatDialogRef<NewListPopupComponent>, 
    private toastr:ToastrService,
    private service:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any){

  }

  ngOnInit(): void {
      if(this.data['action']=='new'){
        this.card_title = "New List"
        this.action_name = "Create"
      }else{
        this.card_title = "Edit List"
        this.action_name = "Save"
        this.new_list_name = this.data['old_list'].title
        this.new_list_desc = this.data['old_list'].desc

        this.old_list_name = this.data['old_list'].title
        this.old_list_desc = this.data['old_list'].desc
      }
  }

  createList(){
    // const list_desc = (document.getElementById('list_desc')! as HTMLInputElement).value;
    
    if(this.data['action']=='new'){
      this.service.createList(this.new_list_name,this.new_list_desc).subscribe(
        (res:ServerResponse)=>{
          if(res.success) this.toastr.success(res.message)
          else this.toastr.warning(res.message)
          
          this.dialogref.close()
        },
        err=>{
          this.toastr.error("Server Not Reachable!!")
        }
      )
    }
    else{
      this.service.editList(this.old_list_name,this.new_list_name,this.new_list_desc).subscribe(
        (res:ServerResponse)=>{
          this.toastr.success(res.message)
          
          const list_item:list_item = {
            'title':this.new_list_name,
            'desc':this.new_list_desc}

          this.newListCreated.emit(list_item)
          this.dialogref.close()
        },err=>{
          this.toastr.error("Server Not Reachable!!")
        }
      )
    }
  
  }

  

  dialogClose(){
    this.dialogref.close()
  }
}

