const problems = ["1:問題を綿密に検討しないで実行に移すことが多い。", "2: どちらかというと怠惰な方です。", "3: 他の人と比べると話し好きです。", "4: どちらかというと地味でめだたない方です。", "5: 思いやりがある方です。", "6: 親しい仲間でも本当に信用することはできません。", "7: 将来のことを見通すことができる方です。", "8: どうでもいいことを気に病む傾向があります。", "9: 疲れやすくはありません。", "10: 軽率に物事を決めたり行動してしまいます。", "11: どちらかというとにぎやかな性格です。", "12: 仕事や勉強には精力的に取り組みます。", "13: 自分で悩む必要のないことまで心配してしまうのは確かです。", "14: 人前で話すのは苦手です。", "15: 誰にでも親切にするように心がけています。", "16: あまり心配症ではありません。", "17: 他の人と同様に神経質ではないと信じています。", "18: どちらかというと気持ちが動揺しやすい。", "19: 積極的に人と付き合う方です。", "20: 特に人前を気にする方ではありません。", "21: どちらかというと徹底的にやる方です。", "22: 難しい問題にぶつかると頭が混乱することが多い。", "23: どちらかというと引っ込み思案です。", "24: 他の人と比べるとあれこれ悩んだり思いわずらったりする方です。", "25: みんなで決めたことはできるだけ協力しようと思います。", "26: 物事を難しく考えがちです。", "27: どちらかというと飽きっぽい方です。", "28: 物事がうまくいかないとすぐに投げ出したくなります。", "29: いつも何か気がかりです。", "30: いろいろな分野の言葉をたくさん知っています。", "31: 人から親切にされると何か下心がありそうで警戒しがちです。", "32: 問題を分析するのは苦手な方です。", "33: 自分にはそれをするカがないと思ってあきらめてしまったことが何回かあります。", "34: 機会さえあれば大いに世の中に役立つことができるのにと思います。", "35: どちらかというとおとなしい性格です。", "36: 何かに取り組んでも中途半端でやめてしまうことが多い。", "37: あまり自分の意見を主張しない方です。", "38: 他の人と同じようにすぐに友達ができる方です。", "39: 私はたしかに自信に欠けています。", "40: いろいろな問題や事柄から共通した性質を見つけだすのは他の人より得意です。", "41: 機会さえ与えられれば皆のよいリーダーになれると思います。", "42: 私は重要人物です。", "43: ほとんどの知人から好かれています。", "44: いつも気がかりなことがあって落ちつきません。", "45: みんなで決めたことでも自分に不利になる場合は協力したくありません。", "46: ひろく物事を知っている方です。", "47: いつもと違ったやり方をなかなか思いっきません。", "48: どちらかというと人情があつい方です。", "49: 誠実に仕事をしてもあまり得にはなりません。", "50: 自信に満ちあふれています。", "51: 筋道を立てて物事を考える方です。", "52: すぐにまごまごします。", "53: 他の人と比べると活発に行動する方です。", "54: 大抵の人が動揺するような時でも落ちついて対処することができます。", "55: はっきりとした目標を持って適切なやり方で取り組みます。", "56: くよくよ考え込みます。", "57: 元気がよいと人に言われます。", "58: 学校ではクラスの人達の前で話すのがひどく苦手でした(です)。", "59: 他の人より洗練された考え方をする方です。", "60: どちらかというと無口です。", "61: 他の人と比べると物事の本質が見抜ける方です。", "62: こまごまとしたことまで気になってしまいます。", "63: 人の言葉には裏があるのでそのまま信じない方がよいと思います。", "64: どちらかというと三日坊主で根気がない方です。", "65: いつも人の立場になって考えるように心がけています。", "66: 緊張してイライラすることがよくあります。", "67: 旅行などではあらかじめ細かく計画を立てることが多い。", "68: 入助けのためならやっかいなことでもやります。", "69: 初対面の人と話をするのは骨が折れるものです。", "70: 子供や老人の世話をするのが好きです。", ];
const wrapper = document.getElementById("wrapper");
let state = -1;

function changeView(idToHidden){
    state++; // state indicates what index of the problems list to populate.
    window.setTimeout(()=>{
        if(document.getElementById(`q${state}`)==null){
            const afterDiv = document.createElement("div");
            afterDiv.classList.add("mt-3");afterDiv.setAttribute("id", `q${state}`);
            afterDiv.innerHTML=`<label class="form-label w-100 mt-3">
                                    <h5>${problems[state]}</h5>
                                    <div class="row mt-3">
                                        <span class ="col fw-light">全くそう思わない</span>
                                        <span class ="col fw-light text-end">とてもそう思う</span>
                                    </div>
                                </label >
                                <div class="input-group">
                                    <div class="w-100 d-flex justify-content-between mb-3">
                                        <span><input class="form-check-input" type="radio" name=q${state} value="1""></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="2"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="3"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="4"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="5"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="6"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="7"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="8"></span>
                                        <span><input class="form-check-input" type="radio" name=q${state} value="9"></span>
                                    </div>
                                </div>`;
            afterDiv.addEventListener("change",()=>{changeView(`q${state}`)});
            afterDiv.classList.add("fadeIn");
            wrapper.appendChild(afterDiv);
        }
        else{
            const afterDiv = document.getElementById(`q${state}`);
            afterDiv.classList.remove("hidden");
        }

        const beforeDiv = document.getElementById(idToHidden);
        beforeDiv.classList.add("hidden");
        if(state==1){
            const backButton = document.getElementById("backButton");
            backButton.classList.remove("hidden");
            backButton.classList.add("fadeIn");
        }
    },200);
}

function back(){
    state--;
    window.setTimeout(()=>{
        if(state==0){
            const backButton = document.getElementById("backButton");
            backButton.classList.add("hidden");
        }
        const afterDiv = document.getElementById(`q${state+1}`);
        const beforeDiv = document.getElementById(`q${state}`);
        afterDiv.classList.add("hidden");
        beforeDiv.classList.remove("hidden");
    },200);
}