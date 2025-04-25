from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies,unset_jwt_cookies
from flask_cors import CORS
from datetime import timedelta
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)

# Database and JWT configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecreta'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = False
app.config['SECRET_KEY'] = 'supersecreta'

# Initialize extensions
jwt = JWTManager(app)
db = SQLAlchemy(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# User model
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    tasks = db.relationship('Tasks', backref='userId_ref', lazy=True, cascade="all,delete")

# Task model
class Tasks(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    userId = db.Column(db.Integer, db.ForeignKey('users.id'))
    title = db.Column(db.String(20))
    content = db.Column(db.String(500))
    status = db.Column(db.Boolean)

# Route to log in a user and return a JWT cookie
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    userQuery = Users.query.filter_by(username=username).first()
    if userQuery and check_password_hash(userQuery.password, password):
        access_token = create_access_token(identity=username)
        response = make_response(jsonify({"msg": f"Login successful for {username}"}))
        set_access_cookies(response, access_token)
        return response
    else:
        return jsonify({"msg": "Invalid credentials"}), 401
    
#Route to logout and eliminate the JWT cookie   
@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    response = make_response(jsonify({"msg":"Logout sucessful"}),200)
    unset_jwt_cookies(response)
    return response



# Route to register a new user
@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    userQuery = Users.query.filter_by(username=username).first()
    if userQuery:
        return jsonify({"msg": "Username already taken"}), 401
    else:
        hashed_password = generate_password_hash(password)
        new_user = Users(username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "User registered successfully"})

# Route to add a new task for the logged-in user
@app.route('/addTask', methods=['POST'])
@jwt_required()
def addTask():
    title = request.json.get('title')
    content = request.json.get('content')
    username = get_jwt_identity()
    userQuery = Users.query.filter_by(username=username).first()
    if userQuery:
        nTask = Tasks(title=title, content=content, userId=userQuery.id, status=False)
        db.session.add(nTask)
        db.session.commit()
        return jsonify({"msg": "Task added successfully"})
    else:
        return jsonify({"msg": "Error authenticating user"})

# Route to get all tasks of the logged-in user
@app.route('/tasks', methods=['GET'])
@jwt_required()
def tasks():
    username = get_jwt_identity()
    userQuery = Users.query.filter_by(username=username).first()
    if userQuery:
        tasksQuery = Tasks.query.filter_by(userId=userQuery.id).all()
        tasks_list = []
        for task in tasksQuery:
            tasks_list.append({
                'id': task.id,
                'title': task.title,
                'content': task.content,
                'status': task.status
            })
        return jsonify(tasks_list)
    else:
        return jsonify({"msg": "No tasks found"})

# Route to handle single task operations (GET, PUT, DELETE)
@app.route('/tasks/<int:task_id>', methods=['PUT', 'DELETE', 'GET'])
@jwt_required()
def handle_tasks(task_id):
    task = Tasks.query.get(task_id)
    if not task:
        return jsonify({"msg": "Task not found"}), 404
    else:
        if request.method == 'DELETE':
            db.session.delete(task)
            db.session.commit()
            return jsonify({"msg": f"Task {task_id} deleted successfully"})
        elif request.method == 'PUT':
            data = request.get_json()
            if 'done' in data:
                task.status = data['done']
            if 'title' in data:
                task.title = data['title']
            if 'content' in data:
                task.content = data['content']
            db.session.commit()
            return jsonify({"msg": f"Task {task_id} updated successfully"})
        elif request.method == 'GET':
            return jsonify({
                'id': task.id,
                'title': task.title,
                'content': task.content,
                'status': task.status
            })

# Create database tables and run the app
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
