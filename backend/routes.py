from flask import Flask, request, jsonify, render_template, session
from models import db, init_app, User
from flask_jwt import JWT, jwt_required, current_identity
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://my_username:my_password@localhost:5432/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key'

init_app(app)

cors = CORS(app)

def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return user
    
def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()

jwt = JWT(app, authenticate, identity)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    user = User.query.filter_by(email=request.json['email']).first()
    if user:
        return jsonify({'error': 'Email already exists'}), 400
    new_user = User(
        username=request.json['username'],
        email=request.json['email'],
        password=request.json['password']
    )
    db.session.add(new_user)
    db.session.commit()
    print('signup successful')
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    if user.password != request.json['password']:
        return jsonify({'status': False, 'message': 'Incorrect email or password'}), 400
    access_token = create_access_token(identity=user.id)
    print('login successful')
    return jsonify({'status': True, 'message': 'User logged in successfully', 'access_token': access_token}), 200

#TODO: Watch: https://www.youtube.com/watch?v=8-W2O_R95Pk

@app.route('/api/logout', methods=['GET'])
def logout():
    return jsonify({'message': 'User logged out successfully'}), 200

@app.route('/api/check_login', methods=['GET'])
def check_login():
    if 'logged_in' in session and session['logged_in']:
        return jsonify({'login_status': True}), 200
    else:
        return jsonify({'login_status': False}), 200


@app.route('/api/watchlist', methods=['GET'])
@jwt_required()
def watchlist():
    print(current_identity)
    #user = get_current_user()
    #print("User:", user)
    #print("Request Header:", request.headers)
    #if not user:
        #return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlist = ['AAPL', 'TSLA', 'GOOG', 'AMZN', 'MSFT']
    return jsonify({'status': True, 'watchlist': {watchlist}}), 200



