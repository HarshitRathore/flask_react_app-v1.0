from flask import Flask, render_template, redirect, request, Response
from flask_sqlalchemy import SQLAlchemy
from flask_pymongo import PyMongo
import os
import json

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'flask_react_app_v1.0.sqlite')
sqldb = SQLAlchemy(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/flask_react_app_v1.0"
mongo = PyMongo(app)
# mongodb = mongo['task4_form']
# mongocoll = mongodb['all_data']

class SQLiteDatabase(sqldb.Model):
    id = sqldb.Column(sqldb.Integer, primary_key = True)
    input1 = sqldb.Column(sqldb.Integer)
    input2 = sqldb.Column(sqldb.Integer)
    sum = sqldb.Column(sqldb.Integer)

    def __init__(self, input1, input2, sum):
        self.input1 = input1
        self.input2 = input2
        self.sum = sum

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/publishSQLiteDB')
def publish_SQLites():
    input1 = request.args.get('input1')
    input2 = request.args.get('input2')
    addition = request.args.get('sum')
    x = SQLiteDatabase(input1, input2, addition)
    sqldb.session.add(x)
    sqldb.session.commit()
    return Response('Record inserted in database.')

@app.route('/publishMongoDB')
def publish_MongoDB():
    input1 = request.args.get('input1')
    input2 = request.args.get('input2')
    addition = request.args.get('sum')
    datadict = {
        "input1" : input1,
        "input2" : input2,
        "sum" : addition
    }
    result = mongo.db.all_data.insert_one(datadict)
    if result.inserted_id == None:
        return Response('Record could not be inserted in database.')
    else:
        return Response('Record inserted in database.')

if __name__ == '__main__':
    sqldb.create_all()
    app.run(debug=True)