from flask import Flask, render_template,redirect,request,url_for, session
# from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
import datetime
import re
import requests
from bs4 import BeautifulSoup

app = Flask(__name__, static_folder="static", template_folder="TEMPLATES")
app.secret_key = "secret"

def open_gs():
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
    spreadsheet_url = "https://docs.google.com/spreadsheets/d/17gEfTOPkqb916jOX2YwETBWtvgX_0XU7MtV3xuZutP0/edit?usp=sharing"
    spreadsheet = gc.open_by_url(spreadsheet_url)
    return spreadsheet

# CORS permission
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# access to / 
@app.route('/',methods=['GET','POST'])
def index():
    if(request.method=="GET"):
        username=""
        if("username" in session):
            username = session["username"]
        try:
            username = request.args["username"]
            session["username"] = username
        except: pass
        return render_template("index.html", username=username)
    elif(request.method=="POST"):
        if('username' not in session):return render_template("index.html")
        try:
            # post-eval.
            stress_level =request.form["q1"];
            stress_diff = request.form["q1"];
            stress_fault = request.form["q3"];
            anger = request.form["e1"]
            sadness = request.form["e2"]
            fear = request.form["e3"]
            ashame = request.form["e4"]
            tiredness = request.form["e5"]
            session["done"] = True
        except:
            try:
                # register
                cw_username = request.forms["username"]
                TIPI = []
                for i in range(10):
                    TIPI.append(request.forms["q"+str(i)])
                # E, A, C, N, O  score: 2 ~ 14 ave: 8
                big_five =[]
                for i in range(5):
                    score = TIPI[i] + 8-TIPI[i+5]
                    if(i==1): score = 8-TIPI[1] + TIPI[i+5]
                    big_five.append(score)
                session["done"] = True
                return render_template("index.html", username = session["username"])
            except:
                try:
                    comments =[]
                    for i in range(4):
                        comments.append([request.forms["good"+str(i)], request.forms["bad"+str(i)], request.forms["opp"+str(i)]])
                    session["done"] = True
                except:
                    #  it is not excepted
                    return render_template("index.html")
            





        spreadsheet = open_gs()
        log = spreadsheet.worksheet(("log"))
        d = datetime.datetime.today()
        # YYYYMMDDHHMM
        date_str = str(d.year).zfill(4) + str(d.month).zfill(2) + str(d.day).zfill(2) + str(d.hour).zfill(2) + str(d.minute).zfill(2);
        log.append_row([date_str, session["username"], session["disclosure"], session["fb_choice"], 
                        stress_level, stress_diff, stress_fault, 
                        anger,sadness,fear,ashame, tiredness])
        return render_template("index.html")
    else:return 0;
    
@app.route("/register", methods=["GET"])
def register():
    session["done"] = False
    return render_template("register.html")

@app.route('/disclosure')
def disclosure():
    if 'username' in session:
        session["done"] = False
        return render_template('disclosure.html')
    else:
        return redirect(url_for('index'))


@app.route('/post-eval', methods=["GET"])
def postEval():
    if 'username' in session:
        return render_template('post-eval.html')
    else:
        return redirect(url_for('index'))
    
@app.route('/final-eval', methods=["GET"])
def finalEval():
    if 'username' in session:
        return render_template('final-eval.html')
    else:
        return redirect(url_for('index'))

@app.route('/feedback', methods=["POST"])
def feedback():
    if 'username' in session:
        session["disclosure"] = request.form["disclosure"]
        # interactive, passive, avoidance.
        fb_choice = request.form["fb"];
        session["fb_choice"] = fb_choice;
        if(fb_choice == "interactive"): return render_template('explosion.html', text=session['disclosure'])
        elif(fb_choice == "passive"): return render_template('distortion.html', text=session['disclosure'])
        elif(fb_choice == "avoidance"): return render_template('avoidance.html', text=session['disclosure'])
        elif(fb_choice == "none"): return redirect(url_for('postEval'))
        else: return fb_choice+" is not in feedback list."
    else:
        return redirect(url_for('index'))

if __name__ == "__main__":
    # print (app.url_map)
    app.run(debug=True, host='0.0.0.0', port=2000)