from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, ForeignKey, Table, ARRAY

db = SQLAlchemy()


def init_app(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()


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
    stocks = Column(ARRAY(String(10)), nullable=False)

    def __init__(self, name, user_id):
        self.name = name
        self.user_id = user_id
        self.stocks = []


class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    price = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)


# Association tables
watchlist_stock_association = Table('watchlist_stock_association', db.Model.metadata,
                                    Column('watchlist_id', Integer, ForeignKey('watchlists.id')),
                                    Column('stock_id', Integer, ForeignKey('stocks.id'))
                                    )

portfolio_stock_association = Table('portfolio_stock_association', db.Model.metadata,
                                    Column('portfolio_id', Integer, ForeignKey('portfolios.id')),
                                    Column('stock_id', Integer, ForeignKey('stocks.id'))
                                    )