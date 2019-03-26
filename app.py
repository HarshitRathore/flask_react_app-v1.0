from flask import Flask, render_template, redirect, request, Response
import pymongo
from flask_restful import Resource, Api
import os
import json

app = Flask(__name__)
api = Api(app)

dbname = "abc"
colname = "def"
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient[dbname]
mycol = mydb[colname]

class GetDefAll(Resource):
	def get(self):
		all_documents = mycol.find()
		all_rows = []
		for document in all_documents:
			all_rows.append(document)
		return Response(str(all_rows))

class InsertOneDocument(Resource):
	def post(self, data_input):
		data_input = eval(data_input)
		inserted_document = mycol.insert_one(data_input)
		if inserted_document.inserted_id is None:
			return Response("Record not inserted.")
		else:
			return Response("Record inserted.")

class InsertOneItem(Resource):
	def post(self, data_input):
		data_input = eval(data_input)
		document_id = data_input['_id']
		matched_document = mycol.find({'_id':document_id})
		updated_document = matched_document[0]
		updated_document['Items'].append(data_input['New_Item'])
		result = mycol.update_one(matched_document[0],{"$set":updated_document})
		return Response(str(result.matched_count))
		if result.matched_count > 0:
			return Response("Record updated.")
		else:
			return Response("Record not updated.")

api.add_resource(GetDefAll, '/GetDefAll')
api.add_resource(InsertOneDocument, '/InsertOneDocument/<string:data_input>')
api.add_resource(InsertOneItem, '/InsertOneItem/<string:data_input>')

if __name__ == '__main__':
	app.run(debug=True)

# Document Insertion syntax
# http://127.0.0.1:5000/InsertOneDocument/{ "_id": 1, "Name": "A1", "Address": { "Street": "12, lane 1","City": "Bhopal" }, "Items": [{         "Item_Name": "I1","Item_Price": "IP1"},{"Item_Name": "I2","Item_Price": "IP2"},{"Item_Name": "I3","Item_Price": "IP3"}]}

# Item Insertion syntax
# http://127.0.0.1:5000/InsertOneItem/{"_id": 1,"Name": "A1","New_Item": {"Item_Name": "I4","Item_Price": "IP4"}}