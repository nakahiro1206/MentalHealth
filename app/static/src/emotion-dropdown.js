// https://www.centervention.com/list-of-emotions-135-words-that-express-feelings/
const EMOTION ={
    "Anger":{
        "Disgust": ["Contempt", "Disgust", "Revulsion"], 
        "Envy": ["Envy", "Jealousy"], 
        "Exasperation": ["Exasperation", "Frustration"], 
        "Irritation": ["Aggravation", "Agitation", "Annoyance", "Grouchiness", "Grumpiness", "Irritation"], 
        "Rage": ["Anger", "Bitterness", "Dislike", "Ferocity", "Fury", "Hate", "Hostility", "Loathing", "Outrage", "Rage", "Resentment", "Scorn", "Spite", "Vengefulness", "Wrath"], 
        "Torment": ["Torment"]
    }, 
    "Fear": {
        "Horror": ["Alarm", "Fear", "Fright", "Horror", "Hysteria", "Mortification", "Panic", "Shock", "Terror"], 
        "Nervousness": ["Anxiety", "Apprehension", "Distress", "Dread", "Nervousness", "Tenseness", "Uneasiness", "Worry"]
    }, 
    "Joy": {
        "Cheerfulness": ["Amusement", "Bliss", "Cheerfulness", "Delight", "Ecstasy", "Elation", "Enjoyment", "Euphoria", "Gaiety", "Gladness", "Glee", "Happiness", "Jolliness", "Joviality", "Joy", "Jubilation", "Satisfaction"], 
        "Contentment": ["Contentment", "Pleasure"], 
        "Enthrallment": ["Enthrallment", "Rapture"], 
        "Optimism": ["Eagerness", "Hope", "Optimism"], 
        "Pride": ["Pride", "Triumph"], 
        "Relief": ["Relief"], 
        "Zest": ["Enthusiasm", "Excitement", "Exhilaration", "Thrill", "Zeal", "Zest"]
    }, 
    "Love": {
        "Affection": ["Adoration", "Affection", "Attraction", "Caring", "Compassion", "Fondness", "Liking", "Love", "Sentimentality", "Tenderness"], 
        "Longing": ["Longing"], 
        "Lust": ["Arousal", "Desire", "Infatuation", "Lust", "Passion"]
    }, 
    "Sadness": {
        "Disappointment": ["Disappointment", "Dismay", "Displeasure"], 
        "Neglect": ["Alienation", "Defeat", "Dejection", "Embarrassment", "Homesickness", "Humiliation", "Insecurity", "Isolation", "Insult", "Loneliness", "Neglect", "Rejection"], 
        "Sadness": ["Depression", "Despair", "Gloom", "Glumness", "Grief", "Hopelessness", "Melancholy", "Misery", "Sadness", "Sorrow", "Unhappiness", "Woe"], 
        "Shame": ["Guilt", "Regret", "Remorse", "Shame"], 
        "Suffering": ["Agony", "Anguish", "Hurt", "Suffering"], 
        "Sympathy": ["Pity", "Sympathy"]
    }, 
    "Surprise": {
        "Surprise": ["Amazement", "Astonishment", "Surprise"]
    }
};

const EMOTION3 ={
    // https://7esl.com/emotions/#List_of_Emotions_by_Different_Types
    "Happiness": ["Joyful", "Delighted", "Ecstatic", "Thrilled", "Content", "Pleased", "Elated", "Jubilant", "Gleeful", "Euphoric", "Overjoyed", "Grateful", "Merry", "Blissful", "Radiant", "Cheerful", "Happy", "Exhilarated", "Excited", "Enthusiastic"],
    "Sadness": ["Sad","Gloomy","Miserable","Despondent","Melancholic","Dejected","Disheartened","Depressed","Sorrowful","Grief-stricken","Heartbroken","Despairing","Wistful","Blue","Somber","Lonesome","Dismal","Downcast","Morose","Weary"],
    "Fear": ["Scared","Terrified","Petrified","Panicked","Anxious","Nervous","Uneasy","Worried","Apprehensive","Dreadful","Hesitant","Jittery","Frightened","Intimidated","Paralyzed","Trembling","Shaken","Horrified","Startled","Alarmed"],
    "Disgust": ["Disgusted","Revolted","Repulsed","Sickened","Nauseated","Abhorred","Loathed","Hated","Detested","Displeased","Offended","Appalled","Grossed out","Irritated","Annoyed","Bitter","Hateful","Hostile","Resentful","Repelled"],
    "Anger": ["Angry","Furious","Enraged","Irate","Resentful","Wrathful","Infuriated","Annoyed","Aggravated","Irritated","Hostile","Hateful","Incensed","Provoked","Livid","Outraged","Frustrated","Vengeful","Bitter","Mad"],
    "Surprise": ["Surprised","Shocked","Astonished","Amazed","Stunned","Bewildered","Dumbfounded","Flabbergasted","Startled","Jolted","Speechless","Overwhelmed","Awestruck","Disbelieving","Unprepared","Nonplussed","Thunderstruck","Taken aback","Impressed","Blown away"]
}

const EMOTION2 ={
    // https://nvc-japan.net/data/Feeling&Needs+intention.pdf
    "恐怖":["危惧する", "不安な（感じ）", "嫌な予感がある", "恐れている", "不信感のある", "パニック", "茫然自失の", "こわい", "疑心暗鬼の", "おびえた", "用心深い", "心配で"],
    "イライラ": ["むかつく", "不愉快", "不機嫌", "しゃくにさわる", "いら立つ", "欲求不満な", "もどかしい", "憤慨する", "腹が立つ", "不快感のある"],
    "怒り": ["怒っている", "激怒している", "怒り狂う", "いきり立つ", "憤然とした", "怒りに駆られる", "恨み"],
    "反感": ["敵意のある", "憎悪のある", "悪意のある", "恨みに思う", "愕然とする", "軽蔑した", "嫌いな", "大っ嫌いな", "ぞっとする", "鳥肌が立つ", "嫌悪感", "うんざりした", "混乱した", "あやふやな", "途方に暮れる", "困惑する", "ぼんやりした", "ボーっとする", "当惑する", "ためらい", "まごついた", "こまった", "悩まされる", "複雑な"], 
    "離別": ["疎外感", "打ち解けない", "冷淡な", "無感動な", "退屈な", "冷たい", "孤立した", "離れた", "取り乱した", "無関心な", "無感覚の", "引っ込み思案の"], 
    "動揺": ["たきつけられる", "危機感", "混乱した", "どぎまぎした", "かき乱された", "不安", "慌てた", "落ち着かない", "ショックを受ける", "ぎょっとする", "ギクッとする", "ハッとする", "ドキッとする", "動揺した", "不穏な", "居心地が悪い", "心配な", "神経さわる", "不安定な", "恥ずかしい", "肩身が狭い", "歯がゆい思い", "おろおろする", "屈辱的な", "無念な", "自意識が強い", "打ちのめされる"], 
    "疲労": ["燃え尽き感", "へとへと", "だるい", "やる気がでない", "眠い", "疲れた", "うんざり", "飽き飽きした", "くたくた"], 
    "痛み": ["苦悩のある", "打ちひしがれる", "打ちのめされる", "深く悲しむ", "胸がつぶれる思い", "失恋（のような）", "傷ついた", "寂しい", "惨めな", "後悔した"], 
    "悲しみ": ["落ち込んだ", "意気消沈した", "絶望感", "しょげ返った", "ふさぎこむ", "やる気を失う", "失望した", "くじけた", "がっかりした", "心が暗い", "心が重い", "哀れな", "憂鬱な", "不幸な", "惨めな", "緊張している", "心配している", "気難しい", "虫の居所が悪い", "行き詰まって", "心がかき乱された", "ぎりぎり", "落ち着かない", "神経をすり減らした", "イライラした", "びくびくした", "ぴりぴりした", "神経質な", "圧倒された/参った", "集中できない", "ストレスにやられた"], 
    "弱さ": ["もろい", "防衛的な", "無力感", "不安な", "疑い深い", "遠慮がち", "不安定な"], 
    "あこがれ": ["うらやましい", "ねたましい", "切望する", "感傷的な", "懐かしい", "身を焦がす", "切ない"]
}

const primary = document.getElementById("primary-emotion");
const secondary = document.getElementById("secondary-emotion");
const tertiary = document.getElementById("tertiary-emotion");

const primary2 = document.getElementById("primary-emotion2");
const secondary2 = document.getElementById("secondary-emotion2");

function CreateTertiaryCategory(){
    const primaryCategory = primary.value;
    const secondaryCategory = secondary.value;
    let content = '<option value="tertiary emotion" selected disabled>tertiary emotion</option>';
    EMOTION[primaryCategory][secondaryCategory].forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    tertiary.innerHTML = content;
    tertiary.style.display ="block";
}

function CreateSecondaryCategory(){
    const primaryCategory = primary.value;
    let content = '<option value="secondary emotion" selected disabled>secondary emotion</option>';
    Object.keys(EMOTION[primaryCategory]).forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    secondary.innerHTML = content;
    secondary.style.display ="block";
    secondary.addEventListener('change',CreateTertiaryCategory)
}
function CreateSecondaryCategory2(){
    const primaryCategory = primary2.value;
    let content = '<option value="secondary emotion" selected disabled>二次的な詳しい感情</option>';
    EMOTION2[primaryCategory].forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    secondary2.innerHTML = content;
    secondary2.style.display ="block";
}

function CreatePrimaryCategory(){
    let content = '<option value="primary emotion" selected disabled>primary emotion</option>';
    Object.keys(EMOTION).forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    primary.innerHTML = content;
    primary.style.display ="block";
    primary.addEventListener('change',CreateSecondaryCategory);
}
function CreatePrimaryCategory2(){
    let content = '<option value="primary emotion" selected disabled>主な感情</option>';
    Object.keys(EMOTION2).forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    primary2.innerHTML = content;
    primary2.style.display ="block";
    primary2.addEventListener('change',CreateSecondaryCategory2);
}

window.addEventListener('DOMContentLoaded', function(){
    CreatePrimaryCategory();
    CreatePrimaryCategory2();
});