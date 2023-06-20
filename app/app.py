from flask import Flask, render_template,redirect,request,Blueprint,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.after_request
def after_request(response):
  response.headers.add('Access-Control-Allow-Origin', '*')
  response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response

@app.route('/',methods=['GET','POST'])
def index():
    if request.method == "POST":
        # let request = {
        #     name: $("#optionTitle")[0].innerHTML,
        #     trust: null,
        #     effectiveness: null,
        #     WillingnessFriends: null,
        #     WillingnessPublic: null,
        #     // meta: createMeta(),
        #     user_id: userId
        # };
        data=request.get_data()
        with open('./static/data.txt', 'a') as f:
            f.write("done")
            # f.write(
            #     str(data.name)+" "+
            #     str(data.trust)+" "+
            #     str(data.effectiveness)+" "+
            #     str(data.WillingnessFriends)+" "+
            #     str(data.WillingnessPublic)+" "+
            #     str(data.user_id)+"\n")
        return data 

    # page = request.args.get('page',1,type=int)
    # blog_posts = BlogPost.query.order_by(BlogPost.date.desc()).paginate(page=page,per_page=5)
    # return render_template('index.html',blog_posts=blog_posts)
    with open('./static/Message.txt', 'r') as f:
        pass
    return render_template('index.html')

if __name__ == "__main__":
    app.run()