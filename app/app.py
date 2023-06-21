from flask import Flask, render_template,redirect,request,Blueprint,jsonify,url_for
from flask_cors import CORS
import json
from google.oauth2.service_account import Credentials
import gspread

app = Flask(__name__, static_folder="static")
CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

# @app.route('/static/<path:filename>')
# def serve_static(filename):
#     with open(url_for('static',filename='data.txt'), 'w') as f:
#         f.write("AAAAAA")
#     return 0

@app.route('/',methods=['GET','POST'])
def index():
    if request.method == "POST":
        """let request = {
            name: $("#optionTitle")[0].innerHTML,
            trust: null,
            effectiveness: null,
            WillingnessFriends: null,
            WillingnessPublic: null,
            // meta: createMeta(),
            user_id: userId
        };"""
        data=request.get_data()
        data_dict=json.loads(data.decode('utf-8')) # null is converted to None.
        # with open('./static/data.txt', 'a') as f:
        #     f.write(
        #         str(data_dict["name"])+" "+
        #         str(data_dict["trust"])+" "+
        #         str(data_dict["effectiveness"])+" "+
        #         str(data_dict["WillingnessFriends"])+" "+
        #         str(data_dict["WillingnessPublic"])+" "+
        #         str(data_dict["user_id"])+"\n")
        scopes = [
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]

        credentials = Credentials.from_service_account_file(
            "./static/awesome-advice-328201-fd45bb3e869e.json",
            scopes=scopes
        )

        gc = gspread.authorize(credentials)
        # # 実行ファイルのディレクトリパスの取得
        # dir_path = os.path.dirname(__file__)

        # # OAuthキーの利用
        # gc = gspread.oauth(
        #     credentials_filename=os.path.join(dir_path, "client_secret.json"),
        #     authorized_user_filename=os.path.join(dir_path, "authorized_user.json")
        # )

        spreadsheet_url = "https://docs.google.com/spreadsheets/d/1dXK8ix7_0_988-hzUX_BQbJd6mJeLiS5Ccd_81Ohndk"

        spreadsheet = gc.open_by_url(spreadsheet_url)
        # spreadsheet.worksheet('name')
        datalist=spreadsheet.sheet1.get_all_values()
        print(spreadsheet.sheet1.get_all_values())
        data_list=([
            str(data_dict["name"]), str(data_dict["trust"]),
            str(data_dict["effectiveness"]), str(data_dict["WillingnessFriends"]), 
            str(data_dict["WillingnessPublic"]), str(data_dict["user_id"])
            ])
        print(data_list)
        spreadsheet.sheet1.append_row(data_list)
        return data 

    # page = request.args.get('page',1,type=int)
    # blog_posts = BlogPost.query.order_by(BlogPost.date.desc()).paginate(page=page,per_page=5)
    # return render_template('index.html',blog_posts=blog_posts)

    # with open('./static/data.txt', 'a') as f:
    #     f.write("done")
    return render_template('index.html')

if __name__ == "__main__":
    print (app.url_map)
    app.run()