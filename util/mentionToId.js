export default function (mention){
    return mention.replace("<","").replace(">","").replace("!","").replace("@","").replace("#","").replace("&","")
}