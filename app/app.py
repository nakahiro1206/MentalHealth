from flask import Flask, render_template,redirect,request,Blueprint,jsonify,url_for
from flask_cors import CORS
import os
import subprocess
import json

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
        data_dict=json.loads(data.decode('utf-8'))
        with open('./static/data.txt', 'a') as f:
            f.write(
                str(data_dict["name"])+" "+
                str(data_dict["trust"])+" "+
                str(data_dict["effectiveness"])+" "+
                str(data_dict["WillingnessFriends"])+" "+
                str(data_dict["WillingnessPublic"])+" "+
                str(data_dict["user_id"])+"\n")
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