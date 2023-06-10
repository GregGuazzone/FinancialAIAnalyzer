from flask import Flask, request, jsonify, render_template, session
from models import db, init_app, User, Watchlist, Stock, Portfolio
from flask_jwt_extended import create_access_token, JWTManager, jwt_required, get_jwt_identity
from flask_cors import CORS, cross_origin
from data import get_stock_data

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://my_username:my_password@localhost:5432/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secret_key'
app.config['JWT_SECRET_KEY'] = 'jwt_secret_key'

db.init_app(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.cli.command("drop_db")                #used to initialize the database
def drop_db():
    db.drop_all()
    print("Database dropped")
    db.create_all()

@app.cli.command("init_db")                #used to initialize the database
def init_db():
    db.create_all()
    print("Database initialized")


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

@app.route('/api/watchlists_names', methods=['GET'])
@cross_origin()
@jwt_required()
def get_watchlists_names():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        print('user does not exist')
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlists_names = []
    for watchlist in user.watchlists:
        watchlists_names.append(watchlist.name)
    return jsonify({'status': True, 'watchlists': watchlists_names}), 200

@app.route('/api/stocks/', methods=['GET'])
@cross_origin()
@jwt_required()
def get_stocks():
    print("Request.args:", request.args.get('watchlist'))
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        print('user does not exist')
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlist = Watchlist.query.filter_by(user_id=user.id, name=request.args.get('watchlist')).first()
    if not watchlist:
        print('watchlist does not exist')
        return jsonify({'status': False, 'message': 'Watchlist does not exist'}), 404
    stocks = []
    for stock in watchlist.stocks:
        stocks.append(stock)
    return jsonify({'status': True, 'stocks': stocks}), 200

@app.route('/api/watchlists/create', methods=['POST'])
@jwt_required()
def create_watchlist():
    print("creating watchlist")
    print("request", request.json)
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        print('user does not exist')
        
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlist = Watchlist.query.filter_by(name=request.json).first()
    if watchlist:
        print('watchlist already exists')
        return jsonify({'status': False, 'message': 'Watchlist already exists'}), 400
    new_watchlist = Watchlist(name=request.json, user_id=current_user)
    print(new_watchlist)
    db.session.add(new_watchlist)
    db.session.commit()
    print('watchlist created successfully')
    return jsonify({'status': True, 'message': 'Watchlist created successfully'}), 200

@app.route('/api/watchlist/add', methods=['POST'])
@jwt_required()
def add_to_watchlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlist_name = request.json.get('watchlist')
    stock_ticker = request.json.get('ticker')
    print("watchlist_name", watchlist_name)
    # Find the watchlist by name
    watchlist = Watchlist.query.filter_by(user_id=user.id, name=watchlist_name).first()
    print(watchlist)
    if not watchlist:
        return jsonify({'status': False, 'message': 'Watchlist does not exist'}), 404
    if watchlist.add_stock(stock_ticker):
        db.session.commit()
        return jsonify({'status': True, 'message': 'Ticker added to watchlist successfully'}), 200
    else:
        return jsonify({'status': False, 'message': 'Ticker already in watchlist'}), 400


@app.route('/api/watchlist/remove', methods=['POST'])
@jwt_required()
def remove_from_watchlist():
    current_user = get_jwt_identity()
    user = User.query.filter_by(id=current_user).first()
    if not user:
        return jsonify({'status': False, 'message': 'User does not exist'}), 404
    watchlist_name = request.json.get('watchlist')
    stock_ticker = request.json.get('ticker')
    # Find the watchlist by name
    watchlist = Watchlist.query.filter_by(user_id=user.id, name=watchlist_name).first()
    if not watchlist:
        return jsonify({'status': False, 'message': 'Watchlist does not exist'}), 404
    if watchlist.remove_stock(stock_ticker):
        db.session.commit()
        return jsonify({'status': True, 'message': 'Ticker removed from watchlist successfully'}), 200
    else:
        return jsonify({'status': False, 'message': 'Ticker not in watchlist'}), 400


@app.route('/api/data/', methods=['GET'])
@cross_origin()
def get_data():
    ticker = request.args.get('ticker')
    if not ticker:
        return jsonify({'status': False, 'message': 'Ticker not provided'}), 404
    stock_data = get_stock_data(ticker)
    print("Previous close:", stock_data["chart"]["result"][0]["meta"]["previousClose"])
    if not stock_data:
        return jsonify({'status': False, 'message': 'Ticker does not exist'}), 404
    return jsonify({'status': True, 'data': stock_data}), 200

