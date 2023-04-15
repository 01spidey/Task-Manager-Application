from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__) 
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['Task-Manager']
collection = db['Users']

@app.route("/")
def home():
    return 'home'

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    
    user = collection.find_one({'user_id': username})
    if user:
        return jsonify({'success':False,'message': 'Username not available!!'})
    
    data = {
        'user_id':username,
        'password':password,
        'Lists': []
    }
    
    collection.insert_one(data)
    return jsonify({'success':True,'message':'Registration Successfull!!'})

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    
    user = collection.find_one({
        'user_id': username,
        'password':password
    })
    
    if user:
        return jsonify({'success':True,'message': f'Welcome {username}!!'})
    
    return jsonify({'success':False,'message':'User Not Found!!'})

@app.route('/create_list', methods=['POST'])
def create_list():
    user_id = request.form['user_id']
    title = request.form['title']
    desc = request.form['desc']
    
    print(f'user_id : {user_id}\ntitle : {title}\ndesc : {desc}')
    
    user = collection.find_one({"user_id": user_id})
    lists = user.get("Lists", [])
    
    for existing_list in lists:
        if existing_list["title"] == title:
            return jsonify({'success':False,'message':'List already exists!!'})
    
    lists.append({
        "title": title,
        "desc": desc,
        "tasks": []
    })
    
    collection.update_one({"user_id": user_id}, {"$set": {"Lists": lists}})
    return jsonify({'success':True,'message':'List created Successfully!!'})


@app.route('/get_lists', methods=['POST'])
def get_lists():
    user_id = request.form['user_id']
    
    user = collection.find_one({"user_id": user_id})
    
    lists = user['Lists']

    out = []
    
    for lst in lists:
        list_dict = dict()
        list_dict["title"] = lst['title']
        list_dict["desc"] = lst['desc']
        out.append(list_dict)
             
    return jsonify({'success':True, 'lists':out})
        
@app.route('/get_tasks', methods=['POST'])
def get_tasks():
    user_id = request.form['user_id']
    list_title = request.form['list_name']
        
    user = collection.find_one({"user_id": user_id})
    
    tasks = []
    for lst in user['Lists']:
        if lst['title'] == list_title:
            tasks = lst['tasks']
            break
    
    out = []

    for task_item in tasks:
        task_dict = dict()
        task_dict["task"] = task_item['task']
        task_dict["completed"] = task_item['completed']        
        out.append(task_dict)
        
    return jsonify({'success':True, 'tasks':out})


@app.route('/add_task', methods=['POST'])
def add_task():
    user_id = request.form['user_id']
    list_name = request.form['list_name']
    task = request.form['task']
    
    user = collection.find_one({"user_id": user_id})
    
    for task_item in user["Lists"]:
        if task in [t["task"] for t in task_item['tasks']]:
            return jsonify({'success':False,'message':'Task already exists!!'})
    
    task_obj = {
        'task' : task,
        'completed':False
    }
    
    list_item = next((item for item in user["Lists"] if item["title"] == list_name), None)
    
    if list_item is not None:
        list_item["tasks"].append(task_obj)
        collection.update_one({"user_id": user_id}, {"$set": {"Lists": user["Lists"]}})
        return jsonify({'success':True,'message':'Task added Successfully!!'})
    else:
        return jsonify({'success':False,'message':'List not found!!'})

@app.route('/complete_task', methods=['POST'])
def complete_task():
    user_id = request.form['user_id']
    list_name = request.form['list_name']
    task = request.form['task']
    
    user = collection.find_one({"user_id": user_id})
    tasks = user['Lists']
    
    for lst in tasks:
        if lst['title'] == list_name:
            for task_item in lst['tasks']:
                if task_item['task'] == task:
                    task_item['completed'] = True
                    break
    
    collection.update_one({"user_id": user_id}, {"$set": {"Lists": tasks}})
    
    return jsonify({'success':True,'message':'Task Completed!!'})

@app.route('/retrieve_task', methods=['POST'])
def retrieve_task():
    user_id = request.form['user_id']
    list_name = request.form['list_name']
    task = request.form['task']

    query = {"user_id": user_id, "Lists.title": list_name, "Lists.tasks.task": task}
    update = {"$set": {"Lists.$[outer].tasks.$[inner].completed": False}}
    array_filters = [{"outer.title": list_name}, {"inner.task": task}]
    collection.update_one(query, update, array_filters=array_filters)

    return jsonify({'success': True, 'message': 'Task Retrieved!!'})

 
@app.route('/delete_task', methods=['POST'])
def delete_task():   
    user_id = request.form['user_id']
    list_name = request.form['list_name']
    task = request.form['task']
    
    query = {'user_id': user_id, f'Lists.title': list_name}
    update = {'$pull': {f'Lists.$.tasks': {'task': task}}}
    
    collection.update_one(query, update)
    return jsonify({'success':True,'message':'Task Deleted!!'})

@app.route('/delete_list', methods=['POST'])
def delete_list():
    user_id = request.form['user_id']
    list_name = request.form['list_name']

    query = {'user_id': user_id}
    update = {'$pull': {'Lists': {'title': list_name}}}

    collection.update_one(query, update)
    return jsonify({'success':True,'message':'List Deleted!!'})

# ---------------------


@app.route('/edit_list', methods=['POST'])
def edit_list():
    user_id = request.form['user_id']
    old_list_name = request.form['old_list_name']
    new_list_name = request.form['new_list_name']
    list_desc = request.form['list_desc']
    
    query = {'user_id': user_id, 'Lists': {'$elemMatch': {'title': old_list_name}}}
    update = {'$set': {'Lists.$.title': new_list_name, 'Lists.$.desc': list_desc}}
    collection.update_one(query, update)

    return jsonify({'success':True,'message':'List updated !!'})

@app.route('/edit_task', methods=['POST'])
def edit_task():
    user_id = request.form['user_id']
    list_name = request.form['list_name']
    old_task_name = request.form['old_task']
    new_task_name = request.form['new_task']

    collection.update_one({"user_id": user_id, f"Lists.title": list_name, "Lists.tasks.task": old_task_name},
                 {"$set": {"Lists.$[list].tasks.$[task].task": new_task_name}},
                 array_filters=[{"list.title": list_name}, {"task.task": old_task_name}])

    return jsonify({'success':True,'message':'Task updated!!'})


if __name__ == '__main__':
    app.run(debug=True)