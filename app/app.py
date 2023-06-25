from flask import Flask, render_template,redirect,request,Blueprint,jsonify,url_for
from flask_cors import CORS
import json
from google.oauth2.service_account import Credentials
import gspread
import random

app = Flask(__name__, static_folder="static", template_folder='templates')
# CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/',methods=['GET','POST'])
def index():
    # Google Sheet setting.
    scopes = [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    credentials = Credentials.from_service_account_file(
        "./static/awesome-advice-328201-fd45bb3e869e.json",
        scopes=scopes
    )
    gc = gspread.authorize(credentials)
    spreadsheet_url = "https://docs.google.com/spreadsheets/d/1dXK8ix7_0_988-hzUX_BQbJd6mJeLiS5Ccd_81Ohndk"
    spreadsheet = gc.open_by_url(spreadsheet_url)

    if request.method == "POST":
        print(spreadsheet.sheet1.get_all_values())
        """let request = {
            name: $("#optionTitle")[0].innerHTML,
            trust: null,
            effectiveness: null,
            WillingnessFriends: null,
            WillingnessPublic: null,
            user_id: userId,
            post_category
        };"""
        data=request.get_data()
        data_dict=json.loads(data.decode('utf-8')) # null is converted to None.
        if(str(data_dict["post_category"])=="rating"):
            data_list=([
                str(data_dict["name"]), str(data_dict["trust"]),
                str(data_dict["effectiveness"]), str(data_dict["WillingnessFriends"]), 
                str(data_dict["WillingnessPublic"]), str(data_dict["user_id"]),
                str(data_dict["additionalfeedback"])
                ])
            print(data_list)
            spreadsheet.sheet1.append_row(data_list)
            return data 
        elif(str(data_dict["post_category"])=="option"):
            row_num=len(spreadsheet.worksheet("methods").get_all_values())+1
            data_list=([
                str(data_dict["title"]), str(data_dict["details"]),
                str(data_dict["optionURL"]), row_num
                ])
            print(data_list)
            spreadsheet.worksheet("methods").append_row(data_list)
            # return row_num
            return data
    
    elif(request.method == "GET"):
        all_methods=spreadsheet.worksheet("methods").get_all_values()
        random.shuffle(all_methods)
        return all_methods
    
    else: return render_template('index.html')

if __name__ == "__main__":
    print (app.url_map)
    app.run()