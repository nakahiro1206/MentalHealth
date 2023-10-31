from flask import Flask, render_template,redirect,request,Blueprint,jsonify,url_for, session
from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
import datetime

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
@app.route('/',methods=['GET'])
def index():
#     if request.method == "POST":
#         spreadsheet = open_gs()
#         print(spreadsheet.sheet1.get_all_values())
#         """let request = {
#             name: $("#optionTitle")[0].innerHTML,
#             trust: null,
#             effectiveness: null,
#             WillingnessFriends: null,
#             WillingnessPublic: null,
#             user_id: userId,
#             post_category
#         };"""
#         data=request.get_data()
#         data_dict=json.loads(data.decode('utf-8')) # null is converted to None.
#         if(str(data_dict["post_category"])=="rating"):
#             data_list=([
#                 str(data_dict["name"]), str(data_dict["trust"]),
#                 str(data_dict["effectiveness"]), str(data_dict["WillingnessFriends"]), 
#                 str(data_dict["WillingnessPublic"]), str(data_dict["user_id"]),
#                 str(data_dict["additionalfeedback"])
#                 ])
#             print(data_list)
#             spreadsheet.sheet1.append_row(data_list)
#             return data 
#         elif(str(data_dict["post_category"])=="option"):
#             row_num=len(spreadsheet.worksheet("methods").get_all_values())+1
#             data_list=([
#                 str(data_dict["title"]), str(data_dict["details"]),
#                 str(data_dict["optionURL"]), row_num
#                 ])
#             print(data_list)
#             spreadsheet.worksheet("methods").append_row(data_list)
#             # return row_num
#             return data   
    return render_template('index.html')

# signin page
@app.route("/signin", methods=["GET"])
def signin():
    return render_template("signin.html")

# authentication
@app.route("/authentication", methods=["GET", "POST"])
def authentication():
    if(request.method == "POST"):
        spreadsheet = open_gs()
        username = request.form["username"]
        password = request.form["password"]
        User_list = spreadsheet.worksheet("userlist")
        Usernames = User_list.col_values(1)
        Passwords = User_list.col_values(2)
        Users={}
        for i in range(min(len(Usernames), len(Passwords))):
            Users[Usernames[i]] = Passwords[i]
        if(username in Users):
            if(password == Users[username]):
                session["username"] = username
                return redirect(url_for("disclosure"))# render_template("disclosure.html")
            else:
                # wrong password
                return render_template("signin.html", error="Invalid crediential!")
        else:
            # not registered
            return render_template("signin.html", error="Invalid crediential!")

    # if request method is GET
    else: return render_template("signin.html")

@app.route('/disclosure')
def disclosure():
    if 'username' in session:
        return render_template('disclosure.html')
    else:
        return redirect(url_for('signin'))
    
@app.route('/pre-eval', methods=["GET", "POST"])
def preEval():
    if(request.method =="POST"):
        session["disclosure"] = request.form["disclosure"]
        print(request.form["disclosure"])
        if 'username' in session:
            return render_template('pre-eval.html')
        else:
            return redirect(url_for('signin'))
    else: return redirect(url_for('signin'))

@app.route('/post-eval', methods=["GET"])
def postEval():
    if 'username' in session:
        return render_template('post-eval.html')
    else:
        return redirect(url_for('signin'))

@app.route('/feedback', methods=["GET", "POST"])
def feedback():
    if 'username' in session:
        if(request.method=="POST"):
            session["stress_level"] =request.form["q1"];
            session["stress_difficulty"] = request.form["q1"];
            session["stress_fault"] = request.form["q3"];
            session["emotion_primary"] = request.form["primary-emotion"];
            session["emotion_secondary"] = request.form["secondary-emotion"];
            session["emotion_tertiary"] = request.form["tertiary-emotion"];


            session["emotion_primary2"] = request.form["primary-emotion2"];
            session["emotion_secondary2"] = request.form["secondary-emotion2"];
            
            fb_choice = request.form["fb"];
            session["fb_choice"] = fb_choice;

            if(fb_choice == "explosion"): return render_template('explosion.html', text=session['disclosure'])
            elif(fb_choice == "distortion"): return render_template('distortion.html', text=session['disclosure'])
            elif(fb_choice == "distancing"): return render_template('breathing.html')
            elif(fb_choice == "distraction"): return render_template('explosion.html', text=session['disclosure'])
            elif(fb_choice == "none"): return redirect(url_for('postEval'))
            else: return redirect(url_for('signin'))
        else: return redirect(url_for('signin'))
    else:
        return redirect(url_for('signin'))
    
@app.route('/home', methods=["POST"])
def goHome():
    if 'username' in session:
        a1 = request.form["q1"];
        a2 = request.form["q2"];
        print(session)
        spreadsheet = open_gs()
        log = spreadsheet.worksheet(("log"))
        log.append_row([str(datetime.datetime.today()), session["username"], session["disclosure"], session["stress_level"], session["stress_difficulty"], session["stress_fault"], 
                        session["emotion_primary"], session["emotion_secondary"], session["emotion_tertiary"], session["fb_choice"]])
        return "HOME PAGE HERE"
    else:
        return redirect(url_for('signin'))

if __name__ == "__main__":
    # print (app.url_map)
    app.run(debug=True)