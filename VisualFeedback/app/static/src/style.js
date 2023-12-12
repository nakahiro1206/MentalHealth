document.querySelector(".borderFrame").style.minHeight = window.innerHeight*0.95 + "px";
try{
    document.querySelector("#disclosure").style.minHeight = window.innerHeight*0.65 + "px";
}
catch(e){console.log("#disclosure");}
try{
    document.querySelector("#wrapper").style.minHeight = window.innerHeight*0.65 + "px";
}
catch(e){console.log("#wrapper");}
try{
    document.querySelector(".scroll-container").style.height = window.innerHeight*0.75 + "px";
}
catch(e){console.log("#scroll-container");}