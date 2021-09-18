const Discord = require("discord.js"),
client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }),
config = require("./config.json"),
fs = require("fs"),
cmds = require("./commands-br.json")
var server = require("./server.json")

client.on("ready", function(){
    console.log("Bot funcionando!")
    client.user.setActivity(`(Cite-me para saber meu prefixo) Calculando custos de lançamentos e recompensas.`)
})

client.on("guildCreate", function(guild){
    for (var i = 0; i < server.list.length; i++){
        if (guild.id == server.list[i].id){
            break
        } 
        else{
            server.list.push({
                id: guild.id,
                locale: guild.preferredLocale,
                permission: 1,
                prefix: "=",
                missionChannelID: "",
                manutentionRoleName: "",
                missions: [],
                levels: [[20000,40000,8000,20],[25000,50000,10000,20],[30000,60000,12000,20],[35000,70000,14000,20],[40000,80000,16000,20],[45000,90000,18000,20]]
            })
            fs.writeFile("server.json", JSON.stringify(server), function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    }
})
client.on("messageCreate", async function(message){
    try {
    if (message.author.bot){return}
    var serv
    for (var i = 0; i < server.list.length; i++){
        if (message.guild.id == server.list[i].id){
            serv = i
            break
        }
        if (i+1 == server.list.length){
            server.list.push({
                id: message.guild.id,
                locale: guild.preferredLocale,
                permission: 1,
                prefix: "=",
                missionChannelID: "",
                manutentionRoleName: "",
                missions: [],
                levels: [[20000,40000,8000,20],[25000,50000,10000,20],[30000,60000,12000,20],[35000,70000,14000,20],[40000,80000,16000,20],[45000,90000,18000,20]]
            })
            fs.writeFile("server.json", JSON.stringify(server), function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    }
    if (server.list[serv].permission < 1){
        message.channel.send({ embeds: [setEmbed(message,`:frowning2: Esse servidor foi banido.`, "", "", "", "ef5250")] })
        return
    }
    if (!message.content.includes("@here") && !message.content.includes("@everyone") && message.mentions.has(client.user.id)){
        message.channel.send({ embeds: [setEmbed(message,`Meu prefixo é \`${server.list[serv].prefix}\`\n\n use \`ajuda\` para ver os comandos disponíveis.`)] })
        return
    }
    if(!message.content.startsWith(server.list[serv].prefix)){return}
    const a = message.content.toLowerCase().slice(1).trim().split(" ")
    const c = a.shift()
    //Nível 1
    //calcule-lançamento
    if (c == cmds.list[0].command[0] || c == cmds.list[0].command[1] || c == cmds.list[0].command[2]){
        if (isNaN(a[0]) || isNaN(a[2]) || a[1] == undefined || a[3] != undefined || a[1] != "s" && a[1] != "n"){syntaxError(message, 0); return}
        if (server.list[serv].levels[a[2]-1] == undefined){
            message.channel.send({ embeds: [setEmbed(message,`:x: O nível ${a[2]} ainda não foi definido.`, "", "", "", "ef5250")] })
            return
        }
        var rec = 0, reu = a[1], massa = a[0], isReq = "Recompensa"
        if (reu == "s") {
            rec = server.list[serv].levels[a[2]-1][0] - massa/2*server.list[serv].levels[a[2]-1][3]
            reu = "Sim"
        }
        else if (reu == "n") {
            rec = server.list[serv].levels[a[2]-1][0] - massa*server.list[serv].levels[a[2]-1][3]
            reu = "Não"
        }
        if (rec < 0){
            isReq = "Prejuízo" 
        }
        message.channel.send({ embeds: [setEmbed(message,`Nível: ${a[2]}\nMassa: ${massa} T\nReutilizável: ${reu}\n${isReq}: ${rec.toFixed(0)}`, "Pagamento do Lançamento Individual:",`Recibo`, true)] })
        return
    }
    //calcule-missão
    else if (c == cmds.list[1].command[0] || c == cmds.list[1].command[1] || c == cmds.list[1].command[2]){
        if (isNaN(a[0]) || isNaN(a[2]) || a[1] == undefined || a[3] != undefined || a[1] != "s" && a[1] != "n"){syntaxError(message, 1); return}
        if (server.list[serv].levels[a[2]-1] == undefined){
            message.channel.send({ embeds: [setEmbed(message,`:x: O nível ${a[2]} ainda não foi definido.`, "", "", "", "ef5250")] })
            return
        }
        var rec, reu = a[1], massa = a[0], isReq = "Recompensa"
        if (reu == "s") {
            rec = server.list[serv].levels[a[2]-1][1] - massa/2*server.list[serv].levels[a[2]-1][3]
            reu = "Sim"
        }
        else if (reu == "n") {
            rec = server.list[serv].levels[a[2]-1][1] - massa*server.list[serv].levels[a[2]-1][3]
            reu = "Não"
        }
        if (rec < 0){
            isReq = "Prejuízo" 
        }
        message.channel.send({ embeds: [setEmbed(message,`Nível: ${a[2]}\nMassa: ${massa} T\nReutilizável: ${reu}\n${isReq}: ${rec.toFixed(0)}`,"Pagamento da Missão:",`Recibo`, true)] })
        return
    }
    //calcule-criador
    else if (c == cmds.list[2].command[0] || c == cmds.list[2].command[1]){
        if (isNaN(a[0]) || isNaN(a[1]) || a[2] != undefined){syntaxError(message, 2); return}
        if (server.list[serv].levels[a[1]-1] == undefined){
            message.channel.send({ embeds: [setEmbed(message,`:x: O nível ${a[1]} ainda não foi definido.`, "", "", "", "ef5250")] })
            return
        }
        var rec = a[0] * server.list[serv].levels[a[1]-1][2]
        message.channel.send({ embeds: [setEmbed(message,`Nível: ${a[1]}\nNúmero de concluintes: ${a[0]}\nRecompensa: ${rec.toFixed(0)}`,"Pagamento do Criador:",`Recibo`, true)] })
        return
    }
    //definir-nível
    else if (c == cmds.list[3].command[0] || c == cmds.list[3].command[1] || c == cmds.list[3].command[2]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if (Number.isInteger(a[0]) || a[0] <= 0 || isNaN(a[1]) || isNaN(a[2]) || isNaN(a[3] || isNaN(a[4]))){syntaxError(message, 3); return}
        if (a[0] > 1 && server.list[serv].levels[a[0]-2] == undefined){
            message.channel.send({ embeds: [setEmbed(message,`:x: Defina o nível ${a[0]-1} antes`, "", "", "", "ef5250")] })
            return
        }
        if (server.list[serv].levels[a[0]-1] != undefined){
            server.list[serv].levels[a[0]-1][0] = parseFloat(a[1])
            server.list[serv].levels[a[0]-1][1] = parseFloat(a[2])
            server.list[serv].levels[a[0]-1][2] = parseFloat(a[3])
            server.list[serv].levels[a[0]-1][3] = parseFloat(a[4])
        } else {
            server.list[serv].levels.push([parseFloat(a[1]),parseFloat(a[2]),parseFloat(a[3]),parseFloat(a[4])])
        }
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O nível ${a[0]} foi definido com sucesso.\n\n Suas quantias são: ${a[1]} de recompensa por lançamento, ${a[2]} de recompensa por missão, ${a[3]} de recompensa para criadores e ${a[4]} de custo por tonelada.`, "", "", "", "1baf22")] })
        return
    }
    //mostrar-níveis
    else if (c == cmds.list[4].command[0] || c == cmds.list[4].command[1] || c == cmds.list[4].command[2]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if (a[1] != undefined){syntaxError(message, 4); return}
        if (server.list[serv].levels[0] == undefined){
            message.channel.send({ embeds: [setEmbed(message, `:x: Não há níveis definidos.`, "", "", "", "ef5250")] })
            return
        }
        var str = "\`Nível | lançamento | missão | criador | custo/T\`\n\n"
        const embed = new Discord.MessageEmbed()

        for (var i = 0; i < server.list[serv].levels.length; i++){
            str += `${i+1} - ${server.list[serv].levels[i][0]} | ${server.list[serv].levels[i][1]} | ${server.list[serv].levels[i][2]} | ${server.list[serv].levels[i][3]}\n`
        }
        embed.setDescription(str)
        .setColor("#17b091")
        .setAuthor(message.author.tag, message.author.avatarURL())
        message.channel.send({ embeds: [embed] })
        return
    }
    //remover-nível
    else if (c == cmds.list[5].command[0] || c == cmds.list[5].command[1] || c == cmds.list[5].command[2]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if (Number.isInteger(a[0]) || a[1] != undefined){syntaxError(message, 5); return}
        if (server.list[serv].levels[(a[0]-1)] == undefined){
            message.channel.send({ embeds: [setEmbed(message, `:x: Esse nível não existe.`, "", "", "", "ef5250")] })
            return
        }
        server.list[serv].levels.splice(a[0]-1, 1)
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Nível apagado com sucesso`, "", "", "", "1baf22")] })
        return
    }
    //defir-prefixo
    else if (c == cmds.list[6].command[0] || c == cmds.list[6].command[1] || c == cmds.list[6].command[2]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if(a[0] == undefined || a[1] != undefined){syntaxError(message, 6); return}
        server.list[serv].prefix = [a[0]]

        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O prefixo foi definido para ${server.list[serv].syntax} com sucesso.`, "", "", "", "1baf22")] })
        return
    }
    //ajuda
    else if (c == "help" || c == "ajuda" || c == "?" || c == "comandos"){
        var str = ""
        for (var i = 0; i < cmds.list.length; i++){
            if (cmds.list[i].nvlPermission <= server.list[serv].permission){
                str += `\`${cmds.list[i].syntax}\`\n`
                str += `${cmds.list[i].description}\n\n`
            }
        }
        message.channel.send({ embeds: [setEmbed(message,`Prefixo: \`${server.list[serv].prefix}\`\n\n ${str} Nível ${server.list[serv].permission}/5 de permissão de servidor.`, "Ajuda", "Desenvolvido por Frederico Andrade")] })
        return
    }
    //Nível 2
    if (server.list[serv].permission < 2){return}
    //adicionar-missão
    else if (c == cmds.list[7].command[0] || c == cmds.list[7].command[1]){
        if(!message.member.roles.cache.some(r => r.name == server.list[serv].manutentionRoleName) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        var elements = ["","","","","","",""]
        for (var i = 0, ii = 0; i < a.length; i++){
            if (a[i] == "&"){
                ii++
            } else{
                elements[ii] += a[i] + " "
            }
        }
        if (elements[0] == "" || elements[1] == "" || elements[2] == "" || isNaN(elements[3]) || elements[4] == "" || elements[5] == "" || elements[6] == ""){syntaxError(message, 7); return}
        if (server.list[serv].missions != undefined){
            server.list[serv].missions.push([elements[0], elements[1], elements[2], parseInt(elements[3]), elements[4], elements[5], elements[6], message.author.tag])
        }
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão cadastrada com sucesso`)] })
        return
    }
    //mostar-missões
    else if (c == cmds.list[8].command[0] || c == cmds.list[8].command[1] || c == cmds.list[8].command[2]){
        if (a[1] != undefined){syntaxError(message, 8); return}

        if (server.list[serv].missions.length == 0){
            message.channel.send({ embeds: [setEmbed(message, `:x: Não há missões cadastradas.`, "", "", "", "ef5250")] })
            return
        }
        var str = ""
        const embed = new Discord.MessageEmbed()
        .setColor("#17b091")
        .setAuthor(message.author.tag, message.author.avatarURL())

        for (var i = 0; i < server.list[serv].missions.length; i++){
            str += `\`Missão ${i+1}\`\n \`Título:\` ${server.list[serv].missions[i][0]}\n \`Descrição:\` ${server.list[serv].missions[i][1]}\n \`Objetivo:\` ${server.list[serv].missions[i][2]}\n \`Dificuldade:\` ${server.list[serv].missions[i][3]}\n \`Recompensa estimada:\` ${server.list[serv].levels[server.list[serv].missions[i][3]][1] - 500*server.list[serv].levels[server.list[serv].missions[i][3]][3]}\n \`Nota:\` ${server.list[serv].missions[i][4]}\n \`Proibido:\` ${server.list[serv].missions[i][5]}\n \`Prazo de entrega:\` ${server.list[serv].missions[i][6]}\n \`Criador:\` ${server.list[serv].missions[i][7]}\n\n`
        }
        embed.setDescription(str)
        message.channel.send({ embeds: [embed] })
        return
    }
    //remover-missão
    else if (c == cmds.list[9].command[0] || c == cmds.list[9].command[1] || c == cmds.list[9].command[2]){
        if(!message.member.roles.cache.some(r => r.name == server.list[serv].manutentionRoleName) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if (isNaN(a[0]) || a[1] != undefined){syntaxError(message, 9); return}
        if (server.list[serv].missions[(a[0]-1)] == undefined){
            message.channel.send({ embeds: [setEmbed(message, `:x: Essa missão não existe.`, "", "", "", "ef5250")] })
            return
        }
        server.list[serv].missions.splice(a[0]-1, 1)
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão apagada com sucesso`, "", "", "", "1baf22")] })
        return
    }
    //postar-missão
    else if (c == cmds.list[10].command[0] || c == cmds.list[10].command[1] || c == cmds.list[10].command[2]){
        if(!message.member.roles.cache.some(r => r.name == server.list[serv].manutentionRoleName) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if (server.list[serv].missionChannelID == undefined || server.list[serv].missionChannelID == ""){
            message.channel.send({ embeds: [setEmbed(message,`:x: O canal de postagem de missões ainda não foi definido, use \`${cmds.list[11].syntax}\` para definí-lo.`, "", "", "", "ef5250")] })
            return
        }
        if (a[0] == undefined || a[1] != undefined){syntaxError(message, 10); return}
        
        if (server.list[serv].missions[a[0]-1] == undefined){
                message.channel.send({ embeds: [setEmbed(message, `:x: Essa missão não existe.`, "", "", "", "ef5250")] })
                return
        }
        var i = a[0] - 1
        embed = new Discord.MessageEmbed()
        .setColor("#17b091")
        .setAuthor("")
        .setTitle("Missão: " + server.list[serv].missions[i][0])
        .setFields(
            {name: "História: ", value: `${server.list[serv].missions[i][1]}\n\u200B`},
            {name: "Objetivo: ", value: `${server.list[serv].missions[i][2]}\n\u200B`},
            {name: "Agência Mínima: ", value: `Nível ${server.list[serv].missions[i][3]}\n\u200B`},
            {name: "Recompensa estimada: ", value: `${server.list[serv].levels[server.list[serv].missions[i][3]-1][1] - 500*server.list[serv].levels[server.list[serv].missions[i][3]][3]}\n\u200B`},
            {name: "Notas: ", value: `${server.list[serv].missions[i][4]}\n\u200B`},
            {name: "Proibido: ", value: `${server.list[serv].missions[i][5]}\n\u200B`},
            {name: "Prazo de entrega: ", value: `${server.list[serv].missions[i][6]}\n\u200B`},
            {name: "Criador: ", value: `${server.list[serv].missions[i][7]}`}
        )
        .setTimestamp()
        try {
            client.channels.cache.get(server.list[serv].missionChannelID).send({ embeds: [embed] })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão postada com sucesso`, "", "", "", "1baf22")] })
        } catch (error) {
            message.channel.send({ embeds: [setEmbed(message,`:x: O canal de postagem de missões não pôde ser reconhecido, use \`definir-canal-missões [id do canal]\` para definí-lo.`, "", "", "", "ef5250")] })
        }
        return
    }
    //definir-canal-missões
    else if (c == cmds.list[11].command[0] || c == cmds.list[11].command[1] || c == cmds.list[11].command[2]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !message.member.roles.cache.some(r => r.name == server.list[serv].manutentionRoleName)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if(a[0] == undefined){syntaxError(message, 11); return}
        server.list[serv].missionChannelID = a[0]
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O id do canal de missões foi definido com sucesso para ${server.list[serv].missionChannelID}.`, "", "", "", "1baf22")] })
        return
    }
    //definir-cargo-gerenciador
    else if (c == cmds.list[12].command[0] || c == cmds.list[12].command[1]){
        if(!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)){
            message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
            return
        }
        if(a[0] == undefined || a[1] != undefined){syntaxError(message, 12); return}

        server.list[serv].manutentionRoleName = a[0]
        fs.writeFile("server.json", JSON.stringify(server), function(error){
            if(error){
                console.log(error);
            }
        })
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O cargo de gerenciador foi definido com sucesso para ${server.list[serv].manutentionRoleName}.`, "", "", "", "1baf22")] })
        return
    }
    //registrar-agência
    else if(c == cmds.list[13].command[0] || c == cmds.list[13].command[1]){
        if(a[0] == undefined || a[1] != undefined){syntaxError(message, 13); return}
        server.list[serv].agencies.push(
            {
                userId: message.author.id,
                name: a[0],
                level: 1,
                launches: 0,
                money: 0
            }
        )
        message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: A agência ${a[0]} foi definida com sucesso.`, "", "", "", "1baf22")] })
    }
    //editar-agência
    else if(c == cmds.list[14].command[0] || c == cmds.list[14].command[1]){
        if(a[0] == undefined || a[1] != undefined){syntaxError(message, 14); return}
        for (var i = 0; i < server.list[serv].agencies[i].userId; i++){
            if (message.author.id == server.list[serv].agencies[i].userId){
            }
        }
        message.channel.send({ embeds: [setEmbed(message,`:x: Você não tem uma agência registrada.`, "", "", "", "ef5250")] })
        return
    }
    //Nível 3
    if (server.list[serv].permission < 3){return}
    //executar-lançamento
    else if(c == cmds.list[15].command[0] || c == cmds.list[15].command[1]){}
    } catch (error) {
        console.log(error)
        message.channel.send({ embeds: [setEmbed(message,`:frowning2: Algo de muito errado aconteceu! Chame o Frederico Andrade para ver se ele pode ajudar.`, "", "", "", "ef5250")] })
    }
})
function setEmbed(message, description, title, footer, showTime = false, color = "3e8100"){
    const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.avatarURL())
    .setDescription(description)
    if (title != undefined){
        embed.setTitle(title)
    }
    if (footer != undefined){
        embed.setFooter(footer)
    }
    if (showTime){
        embed.setTimestamp()
    }
    if (color != undefined){
        embed.setColor(color)
    }
    return embed
}
function syntaxError(m, i){
    const embed = new Discord.MessageEmbed()
    .setTitle("Erro de sintaxe")
    .setAuthor(m.author.tag, m.author.avatarURL())
    .setDescription(`Argumento incorreto, faltando ou em demasia.\n use:\n \`${cmds.list[i].syntax}\``)
    .setColor("ef5250")
    m.channel.send({embeds: [embed]})
}
client.login(config.token)