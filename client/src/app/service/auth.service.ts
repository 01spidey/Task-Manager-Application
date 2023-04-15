import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { GetListsResponse, GetTasksResponse, ServerResponse, list_item, task_item } from 'src/model';


@Injectable({
  providedIn: 'root'
})

export class AuthService{

  API_URL = 'http://localhost:5000';

  user = ""

  constructor(
    private http:HttpClient
  ) {   }

  initUser() {
    this.user = sessionStorage.getItem('user') || '';
  }

  login(username:string, password:string){
    const formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    return this.http.post<ServerResponse>(`${this.API_URL}/login`,formData);
  }

  register(username:string, password:string){
    const formData = new FormData();
    formData.append('username',username);
    formData.append('password',password);
    return this.http.post<ServerResponse>(`${this.API_URL}/register`,formData);
  }

  createList(title:string, desc:string){
    const formData = new FormData();
    formData.append('title',title);
    formData.append('desc',desc);
    formData.append('user_id', this.user)
    return this.http.post<ServerResponse>(`${this.API_URL}/create_list`,formData);
  }

  getLists(username:string){
    const formData = new FormData();
    formData.append('user_id', username)
    return this.http.post<GetListsResponse>(`${this.API_URL}/get_lists`,formData);
  }

  getTasks(list_name:string){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_name)
    
    return this.http.post<GetTasksResponse>(`${this.API_URL}/get_tasks`,formData);
  }

  addtask(list_name:string,task:string){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_name)
    formData.append('task',task)
    console.log(`list_name : ${list_name}`)
    return this.http.post<ServerResponse>(`${this.API_URL}/add_task`,formData);
  }

  completeTask(list_item:list_item,task_item:task_item){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_item.title)
    formData.append('task',task_item.task)
    // console.log('Completeing the task!!')
    return this.http.post<ServerResponse>(`${this.API_URL}/complete_task`,formData);
  }

  retrieveTask(list_item:list_item,task_item:task_item){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_item.title)
    formData.append('task',task_item.task)
    return this.http.post<ServerResponse>(`${this.API_URL}/retrieve_task`,formData);
  }

  deleteTask(list_item:list_item,task_item:task_item){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_item.title)
    formData.append('task',task_item.task)

    return this.http.post<ServerResponse>(`${this.API_URL}/delete_task`,formData);
  }

  deleteList(list_item:list_item){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_item.title)
   
    return this.http.post<ServerResponse>(`${this.API_URL}/delete_list`,formData);
  }

  editTask(old_task:string,new_task:string,list_name:string){
    const formData = new FormData()
    formData.append('user_id', this.user)
    formData.append('list_name',list_name)
    formData.append('old_task',old_task)
    formData.append('new_task',new_task)

    return this.http.post<ServerResponse>(`${this.API_URL}/edit_task`,formData);

  }

  editList(
    old_list_name:string,
    new_list_name:string,
    list_desc:string){
      // console.log(`Old List : ${old_list_name}\nNew List : ${new_list_name}\nList Desc : ${list_desc}`)\
      const formData = new FormData()
      formData.append('user_id', this.user)
      formData.append('old_list_name',old_list_name)
      formData.append('new_list_name',new_list_name)
      formData.append('list_desc',list_desc)

    return this.http.post<ServerResponse>(`${this.API_URL}/edit_list`,formData);
  }
}
