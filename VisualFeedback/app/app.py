from flask import Flask, render_template,redirect,request,url_for, session
# from flask_cors import CORS
from google.oauth2.service_account import Credentials
import gspread
import datetime
import itertools

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
        # username
        username = ""
        if(request.args.get("username") is not None):
            username = request.args.get("username")
        if((username=="") and ("username" in session)):
            username = session["username"]
        session["username"] = username
        # progress
        progress = -1
        if("progress" in session): progress = session["progress"]
        session["progress"] = progress
        # crowdworks name
        crowdworks_username = ""
        if("crowdworks_username" in session):crowdworks_username=session["crowdworks_username"]
        session["crowdworks_username"]=crowdworks_username
        # last access
        last_access = -1
        if("last_access" in session): last_access = session["last_access"]
        session["last_access"] = last_access
        # render template
        return render_template("index.html", username=username, progress=progress, 
                               crowdworks_username=crowdworks_username,last_access=last_access)
    elif(request.method=="POST"):
        if('username' not in session):return redirect(url_for('index'))
        spreadsheet = open_gs()
        userlist = spreadsheet.worksheet("userlist")
        hash_list = userlist.row_values(1)
        idx = hash_list.index(session["username"])
        # increment progress.
        progress = int(userlist.cell(3,idx+1).value)
        session["progress"] = progress+1
        userlist.update_cell(3,idx+1,progress+1)
        d = datetime.datetime.today()
        # YYYYMMDDHHMM
        date_str = str(d.year).zfill(4) + str(d.month).zfill(2) + str(d.day).zfill(2) + str(d.hour).zfill(2) + str(d.minute).zfill(2);
        userlist.update_cell(4,idx+1,date_str)
        session["last_access"] = int(date_str)
        if(request.form.get("username") is not None):
            # register
            register_list = []
            crowdworks_username = request.form["username"]
            session["crowdworks_username"] = crowdworks_username
            register_list.append(crowdworks_username)
            TIPI=[]
            for i in range(10):
                TIPI.append(int(request.form["q"+str(i)]))
                register_list.append(TIPI[i])
            # E, A, C, N, O  score: 2 ~ 14 ave: 8
            for i in range(5):
                score = TIPI[i] + 8-TIPI[i+5]
                if(i==1): score = 16-score
                register_list.append(score)
            register_cells = userlist.range(6,idx+1,21,idx+1)
            for i in range(len(register_list)):
                register_cells[i].value=register_list[i]
            userlist.update_cells(register_cells)

            user_sheet = spreadsheet.worksheet("P"+str(idx))
            label = ["timestamp","disclosure","choice","effectiveness","choice reason","stress level","stress difficulty","stress self fault","anger","sadness","fear","ashame","tiredness"]
            user_sheet.append_row(label)
            return redirect(url_for('index'))
        elif(request.form.get("good0") is not None):
            # final eval.
            comments =[]
            for i in range(4):
                comments.append(request.form["good"+str(i)])
                comments.append(request.form["bad"+str(i)])
                comments.append(request.form["sug"+str(i)])
                comments.append(request.form["opp"+str(i)])
            comment_cells = userlist.range(22,idx+1,37,idx+1)
            for i in range(len(comments)):
                comment_cells[i].value=comments[i]
            print(comments)
            userlist.update_cells(comment_cells)
            return redirect(url_for('index'))
        elif(request.form.get("ch0") is not None):
            # instruction check.
            comments =[]
            for i in range(4):
                comments.append(request.form["ch"+str(i)])
            comment_cells = userlist.range(38,idx+1,41,idx+1)
            for i in range(len(comments)):
                comment_cells[i].value=comments[i]
            print(comments)
            userlist.update_cells(comment_cells)
            return redirect(url_for('index'))
        else:
            #  from repeat_check -> index
            return redirect(url_for('index'))
    else:return 0;
    
@app.route("/register", methods=["POST"])
def register():
    if 'username' in session:
        session["progress"]=request.form["p"]
        session["lastAccess"]=request.form["l"]
        session["crowdworks_username"]=request.form["c"]
        return render_template("register.html")
    else:
        return redirect(url_for('index'))

@app.route('/disclosure', methods=["POST"])
def disclosure():
    if 'username' in session:
        fb_list = ["interactive","passive","avoidance","none"]
        group = int(session["username"][0:2])
        fb_list = list(itertools.permutations(fb_list))[group]
        session["fb_list"] = fb_list
        session["progress"]=request.form["p"]
        session["lastAccess"]=request.form["l"]
        session["crowdworks_username"]=request.form["c"]
        return render_template('disclosure.html', progress=session["progress"], fb_list=fb_list)
    else:
        return redirect(url_for('index'))


@app.route('/post-eval', methods=["GET"])
def postEval():
    if 'username' in session:
        return render_template('post-eval.html')
    else:
        return redirect(url_for('index'))
    
@app.route('/final-eval', methods=["POST"])
def finalEval():
    if 'username' in session:
        session["progress"]=request.form["p"]
        session["lastAccess"]=request.form["l"]
        session["crowdworks_username"]=request.form["c"]
        return render_template('final-eval.html')
    else:
        return redirect(url_for('index'))

@app.route('/feedback', methods=["POST"])
def feedback():
    if 'username' in session:
        session["disclosure"] = request.form["disclosure"]
        # interactive, passive, avoidance.
        if(request.form.get("fb") is None):
            return redirect(url_for('instruction',number=0))
        fb_choice = request.form["fb"];
        session["fb_choice"] = fb_choice;
        if(fb_choice == "interactive"): return render_template('explosion.html', text=session['disclosure'])
        elif(fb_choice == "passive"): return render_template('distortion.html', text=session['disclosure'])
        elif(fb_choice == "avoidance"): return render_template('avoidance.html', text=session['disclosure'])
        elif(fb_choice == "none"): return render_template('none.html', text=session['disclosure'])
        else: return fb_choice+" is not in feedback list."
    else:
        return redirect(url_for('index'))
    
@app.route('/instruction/<int:number>', methods=["GET"])
def instruction(number):
    if('username' not in session):return redirect(url_for('index'))
    if(number==0):return render_template("instruction_explosion.html",text="TEST")
    elif(number==1):return render_template("instruction_distortion.html",text="TEST")
    elif(number==2):return render_template("instruction_avoidance.html")
    elif(number==3):return render_template("instruction_none.html",text="TEST")
    else:
        if(session["progress"]==3):
            return render_template("instruction_check.html")
        else:return redirect(url_for('index'))

@app.route("/repeat_check", methods=["POST"])
def repeat_check():
    if("username" not in session): redirect(url_for('index'))
    # post-eval.
    stress_level =request.form["q1"];
    stress_diff = request.form["q2"];
    stress_self_fault = request.form["q3"];
    anger = request.form["e1"]
    sadness = request.form["e2"]
    fear = request.form["e3"]
    ashame = request.form["e4"]
    tiredness = request.form["e5"]
    effectiveness = request.form["f1"]
    comment = request.form["f2"]
    spreadsheet = open_gs()
    userlist = spreadsheet.worksheet("userlist")
    hash_list = userlist.row_values(1)
    idx = hash_list.index(session["username"])
    user_sheet = spreadsheet.worksheet("P"+str(idx))
    d = datetime.datetime.today()
    # YYYYMMDDHHMM
    date_str = str(d.year).zfill(4) + str(d.month).zfill(2) + str(d.day).zfill(2) + str(d.hour).zfill(2) + str(d.minute).zfill(2);
    user_sheet.append_row([date_str, 
                            session["disclosure"], 
                            session["fb_choice"], 
                            effectiveness, 
                            comment, 
                            stress_level, 
                            stress_diff, 
                            stress_self_fault, 
                            anger, sadness, fear, ashame, tiredness])
    return render_template("repeat_check.html", text = session["disclosure"])

if __name__ == "__main__":
    # print (app.url_map)
    app.run(debug=True, host='0.0.0.0', port=2000)