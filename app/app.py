from flask import Flask, render_template,redirect,request,Blueprint,jsonify

app = Flask(__name__)

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
        # json_ratings: jsonEncoded,
        # meta: createMeta(),
        # user_id: userId};
        return request.get_data()

    # page = request.args.get('page',1,type=int)
    # blog_posts = BlogPost.query.order_by(BlogPost.date.desc()).paginate(page=page,per_page=5)
    # return render_template('index.html',blog_posts=blog_posts)
    return render_template('index.html')

if __name__ == "__main__":
    app.run()