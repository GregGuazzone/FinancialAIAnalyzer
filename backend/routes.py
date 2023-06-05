from flask import Flask, request, jsonify, render_template, session
from models import db, init_app, User
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://my_username:my_password@localhost:5432/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key'

init_app(app)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and user.password == password:
        return user
    
def identity(payload):
    user_id = payload['identity']
    return User.query.filter_by(id=user_id).first()

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = False
jwt = JWTManager(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/signup', methods=['POST'])
def signup():
    email_check = User.query.filter_by(email=request.json['email']).first()
    if email_check:
        print('email already exists')
        return jsonify({'error': 'email', 'message': 'Email already exists'}), 400
    username_check = User.query.filter_by(username=request.json['username']).first()
    if username_check:
        return jsonify({'error': 'username', 'message': 'Username already exists'}), 400
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
@cross_origin()
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    if user.password != request.json['password']:
        return jsonify({'status': False, 'message': 'Incorrect email or password'}), 400
    access_token = create_access_token(identity=user.id)
    print('login successful')
    return jsonify({'status': True, 'message': 'User logged in successfully', 'access_token': access_token}), 200


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
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    return jsonify({'status': True, 'watchlist': user.watchlist}), 200

@app.route('/api/watchlist/add', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    stock_ticker = request.json
    if stock_ticker in user.watchlist:
        return jsonify({'status': False, 'message': 'Ticker already in watchlist'}), 400
    user.watchlist.append(stock_ticker)
    db.session.commit()
    return jsonify({'status': True, 'message': 'Ticker added to watchlist successfully'}), 200




