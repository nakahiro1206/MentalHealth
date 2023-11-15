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
                return render_template("index.html", username = session["username"])
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
    
@app.route("/register", methods=["GET", "POST"])
def register():
    if(request.method=="GET"):
        line_id = request.args["userId"]
        session["line_id"] = line_id
        return render_template("register.html")
    if(request.method == "POST"):
        crowdworks_username = request.form["username"]
        big5_url = request.form["url"] # 'https://bigfive-test.com/ja/result/58a70606a835c400c8b38e84'
        headers = {'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"} 
        # Here the user agent is for Edge browser on windows 10. You can find your browser user agent from the above given link. 
        response = requests.get(url=big5_url, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        subheadings = soup.find_all(class_="subheading")
        neuroticism = re.sub(r"\D", "", subheadings[0].get_text())
        extraversion = re.sub(r"\D", "", subheadings[7].get_text())
        openess2experience = re.sub(r"\D", "", subheadings[14].get_text())
        agreeableness = re.sub(r"\D", "", subheadings[21].get_text())
        conscientiousness = re.sub(r"\D", "", subheadings[28].get_text())
        print(neuroticism, extraversion, openess2experience, agreeableness, conscientiousness)
        spreadsheet = open_gs()
        worksheet = False
        for s in spreadsheet.worksheets():
            if(crowdworks_username == s.title):
                worksheet = s
        if(worksheet == False):
            worksheet = spreadsheet.add_worksheet(title = crowdworks_username, rows=50, cols=50)
            label = [["timestamp", "disclosure", "fb choice", "stress level", "stress difficulty", "stress fault", "angry", "sad", "fear", "ashame", "tired"]]
            worksheet.update("A1:K1", label)
            userlist = spreadsheet.worksheet("userlist")
            index = len(userlist.row_values(1))
            data = [crowdworks_username, session["line_id"], big5_url, neuroticism, extraversion, openess2experience, agreeableness, conscientiousness, str(datetime.datetime.today())]
            for i in range(len(data)):
                userlist.update_cell(i+1, index+1, data[i])
                print(data[i], "row", i+1,"col", index+1, "ok")
        # シート作成. 書き込み処理.
        return response.content

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
        return redirect(url_for('index'))
    
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
        return "username is not in session. resume from start."

if __name__ == "__main__":
    # print (app.url_map)
    app.run(debug=True, host='0.0.0.0', port=2000)