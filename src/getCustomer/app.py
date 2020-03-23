import os
import mysql.connector
from flask import Flask,request,render_template
from flask_cors import CORS
import json
app = Flask(__name__)
CORS(app)



USER = os.getenv('MYSQL_USER')
PASSWORD = os.environ.get('MYSQL_PASSWORD')
HOST = os.environ.get('MYSQL_HOST')
DATABASE = os.getenv('MYSQL_DATABASE')

try:
    mydb = mysql.connector.connect(
    host=str(HOST),
    user=str(USER),
    passwd=str(PASSWORD),
    db = str(DATABASE)
    )
    mycursor = mydb.cursor()
    print("Database successfully connected")

except Exception as e:
    print("could not connect to Database")
    print(str(e))


@app.route('/')
def home():
    return 'getCustomer version 1.1'

@app.route('/customer/<id>')
def getCustomer(id):
    sql = "SELECT * FROM customer WHERE id = %(id)s"
    try:
        mycursor.execute(sql,{ 'id': str(id) })
        columns = mycursor.column_names
        myresult = mycursor.fetchall()
        json_data=[]
        for result in myresult:
            json_data.append(dict(zip(columns,result)))

        print(json_data)
        return json.dumps(json_data[0],default=str)
      
    except Exception as e:
        return "Could not retrieve records from DB: " + str(e)

    
app.run("0.0.0.0","8080")
