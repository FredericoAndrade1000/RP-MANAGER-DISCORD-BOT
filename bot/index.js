const Discord = require("discord.js"),
client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }),
config = require("./config.json")

client.on("ready", function(){
    console.log("Bot funcionando!")
    client.user.setActivity(`Calculando custos de lançamentos e recompensas`)
})

client.on("guildCreate", function(){
})
client.on("messageCreate", function(message){
    if(!message.author.bot && message.content.startsWith(config.prefix)){
        const a = message.content.slice(1).split(" "),
        c = a.shift().toLowerCase()
        if (c == "calcule-lançamento" || c == "calcule-lancamento"){
            if (checkArgs(a, 3) && a[0] > 0 && (a[2] <= 6 && a[2] > 0) && a[3] == undefined){
                var rec, reu = a[1], nvl = a[2], massa = a[0]
                if (reu.toLowerCase() == "s") {
                    rec = nvl*20000 - (massa*6)
                    reu = "Sim"
                }
                else if (reu.toLowerCase() == "n") {
                    rec = nvl*20000 - (massa*14)
                    reu = "Não"
                }
                print(`Pagamento do Lançamento Individual\n\n Nível: ${a[2]}\n Massa: ${massa} T\n Reutilizável: ${reu}\n Recompensa: ${rec}`)
            } else {
                print(`Argumento incorreto, faltando ou em demasia\n  use:\n  ${config.prefix}calcule-lançamento [massa] [reutilizável(s/n)] [dificuldade(1 a 6)]`)
            }
        }
        
        else if (c == "calcule-missão" || c == "calcule-missao"){
            if (checkArgs(a, 3) && a[0] > 0 && (a[2] <= 6 && a[2] > 0) && a[3] == undefined){
                var rec, reu = a[1], nvl = a[2], massa = a[0]
                if (reu == "s") {
                    rec = nvl*20000 - (massa*6)
                    reu = "Sim"
                }
                else if (reu == "n") {
                    rec = nvl*20000 - (massa*14)
                    reu = "Não"
                }
                print(`Pagamento da Missão\n\n Nível: ${a[2]}\n Massa: ${massa} T\n Reutilizável: ${reu}\n Recompensa: ${rec}`)
            } else {
                print(`Argumento incorreto, faltando ou em demasia\n  use:\n  ${config.prefix}calcule-missão [massa] [reutilizável(s/n)] [dificuldade(1 a 6)]`)
            }
        }
        
        else if (c == "calcule-criador"){
            if (checkArgs(a, 2) && a[0] > 0 && (a[1] <= 6 && a[1] > 0) && a[2] == undefined){
                rec = (a[1]*a[0]) * 10000
                print(`Pagamento do Criador\n\n Nível: ${a[1]}\n Número de concluintes: ${a[0]}\n Recompensa: ${rec}`)
            } else {
                print(`Argumento incorreto, faltando ou em demasia\n  use:\n  ${config.prefix}calcule-criador [número de concluíntes] [dificuldade(1 a 6)]`)
            }
        }
        
        else if (c == "help" || c == "ajuda" || c == "?" || c == ""){
            print(`Prefixo: ${config.prefix}\n calcule-lançamento: calcula o valor de recompensa de lançamentos individuais\n calcule-missão: calcula o valor de recompensa de cumprimento de missão\n calcule-criador: calcula o valor da recompensa dada aos criadores de missão`)
        }
        
        else {
            print(`Não reconheço esse comando\n  use:\n  ${config.prefix}ajuda para ver todos os comandos`)
        }
        } else{return;}
        function print(msg){
            m = message.channel.send("```" + msg + "```")
        }
    
})
    
function checkArgs(a, s){
    for(var i = 0; i < s; i++){
        if(a[i] == undefined){
            return false
        } else {return true}
    }
}
client.login(config.token)