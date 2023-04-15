export interface ServerResponse{
    success:boolean,
    message:string
}

export interface GetListsResponse{
    success:boolean,
    lists : list_item[]
}

export interface list_item{
    title:string,
    desc:string
}

export interface GetTasksResponse{
    success:boolean,
    tasks : task_item[]
}

export interface task_item{
    task : string,
    completed : boolean
}