from flask import Flask, request, jsonify, render_template
from models import db, init_app, User
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://my_username:my_password@localhost:5432/my_database'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
init_app(app)

cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

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
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    user = User.query.filter_by(email=request.json['email']).first()
    if not user:
        return jsonify({'error': 'User does not exist'}), 404
    if user.password != request.json['password']:
        return jsonify({'error': 'Incorrect password'}), 400
    return jsonify({'message': 'User logged in successfully'}), 200

@app.route('/api/watchlist', methods=['GET'])
def watchlist():
    return



