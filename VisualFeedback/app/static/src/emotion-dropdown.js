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

const primary = document.getElementById("primary-emotion");
const secondary = document.getElementById("secondary-emotion");
const tertiary = document.getElementById("tertiary-emotion");

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

function CreateSecondaryCategory(category){
    const primaryCategory = primary.value;
    let content = '<option value="secondary emotion" selected disabled>secondary emotion</option>';
    Object.keys(EMOTION[primaryCategory]).forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    secondary.innerHTML = content;
    secondary.style.display ="block";
    secondary.addEventListener('change',CreateTertiaryCategory)
}

window.addEventListener('DOMContentLoaded', function(){
    let content = '<option value="primary emotion" selected disabled>primary emotion</option>';
    Object.keys(EMOTION).forEach((value)=>{
        content += `<option value="${value}">${value}</option>`;
    });
    primary.innerHTML = content;
    primary.style.display ="block";
    primary.addEventListener('change',CreateSecondaryCategory)
});