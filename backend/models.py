from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Table, ARRAY
from sqlalchemy.ext.mutable import MutableList

db = SQLAlchemy()

def init_app(app):
    db.init_app(app)
    db.create_all(app=app)

class User(db.Model):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), nullable=False)
    email = Column(String(50), nullable=False, unique=True)
    password = Column(String(50), nullable=False)
    watchlists = db.relationship('Watchlist', backref='user', cascade='all, delete-orphan')
    portfolios = db.relationship('Portfolio', backref='user', uselist=False, cascade='all, delete-orphan')

@property
def watchlist(self):
    if self.watchlists:
        return self.watchlists[0]
    return None

class Stock(db.Model):
    __tablename__ = 'stocks'
    id = Column(Integer, primary_key=True)
    symbol = Column(String(10), nullable=False)
    name = Column(String(100), nullable=False)

class Watchlist(db.Model):
    __tablename__ = 'watchlists'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    stocks = Column(MutableList.as_mutable(ARRAY(String(10))), nullable=False)

    def __init__(self, name, user_id):
        self.name = name
        self.user_id = user_id
        self.stocks = MutableList()

    def add_stock(self, stock):
        self.stocks = self.stocks or []
        if stock not in self.stocks:
            self.stocks.append(stock)
            db.session.commit()
            return True
        return False
    
    def remove_stock(self, stock):
        self.stocks = self.stocks or []
        if stock in self.stocks:
            self.stocks.remove(stock)
            db.session.commit()
            return True
        return False


class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    price = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
