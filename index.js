const Discord = require("discord.js"),
    client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }),
    config = require("./config.json"),
    fs = require("fs"),
    cmds = require("./commands-br.json")

let server = require("./server.json")
client.on("ready", function () {
    console.log("Bot funcionando!")
    client.user.setActivity(`(Cite-me para saber meu prefixo) Calculando custos de lançamentos e recompensas.`)
    setInterval(function () { queuedOps() }, 2500)
})

client.on("guildCreate", function (guild) {
    for (let i = 0; i < server.list.length; i++) {
        if (guild.id == server.list[i].id) {
            return
        }
        else {
            server.list.push({
                id: message.guild.id,
                locale: guild.preferredLocale,
                permission: 1,
                prefix: "=",
                missionChannelID: "",
                manutentionRoleID: "",
                missions: [],
                blueprints: {
                    private: {
                        cost: 150000,
                        dailyTax: 5000
                    },
                    public: {
                        cost: 450000,
                        dailyTax: 15000,
                        useTax: 0.2
                    }
                },
                levels: [{
                    description: "É possível fazer órbitas na Terra e na Lua. Pode fazer pousos na superfície da Lua e ter até três blueprints.",
                    launch: 20000,
                    missions: 40000,
                    creator: 8000,
                    costPerTon: 20,
                    upgradePrice: 0,
                    maxResearchPoints: 300,
                    researchPoints: 0,
                    maxBlueprints: 3
                },
                {
                    description: "Pode fazer órbitas ou pousar em Marte e em Vênus. Tem o valor máximo de cinco blueprints.",
                    launch: 25000,
                    missions: 50000,
                    creator: 10000,
                    costPerTon: 20,
                    upgradePrice: 1000000,
                    maxResearchPoints: 700,
                    researchPoints: 500,
                    maxBlueprints: 5
                },
                {
                    description: "Pode ir a qualquer outro planeta ou Lua do sistema solar. Tem o valor máximo de dez blueprints.",
                    launch: 30000,
                    missions: 60000,
                    creator: 12000,
                    costPerTon: 20,
                    upgradePrice: 10000000,
                    maxResearchPoints: 1000,
                    researchPoints: 2000,
                    maxBlueprints: 10
                }],
                agencies: [{}],
                queuedOps: []
            })
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
        }
    }
})
client.on("messageCreate", async function (message) {
    try {
        if (message.author.bot) { return }
        let serv
        for (let i = 0; i < server.list.length; i++) {
            if (message.guild.id == server.list[i].id) {
                serv = i
                break
            }
            if (i + 1 == server.list.length) {
                server.list.push({
                    id: message.guild.id,
                    locale: guild.preferredLocale,
                    permission: 1,
                    prefix: "=",
                    missionChannelID: "",
                    manutentionRoleID: "",
                    missions: [],
                    blueprints: {
                        private: {
                            cost: 150000,
                            dailyTax: 5000
                        },
                        public: {
                            cost: 450000,
                            dailyTax: 15000,
                            useTax: 0.2
                        }
                    },
                    levels: [{
                        description: "É possível fazer órbitas na Terra e na Lua. Pode fazer pousos na superfície da Lua e ter até três blueprints.",
                        launch: 20000,
                        missions: 40000,
                        creator: 8000,
                        costPerTon: 20,
                        upgradePrice: 0,
                        researchPoints: 0
                    },
                    {
                        description: "Pode fazer órbitas ou pousar em Marte e em Vênus. Tem o valor máximo de cinco blueprints.",
                        launch: 25000,
                        missions: 50000,
                        creator: 10000,
                        costPerTon: 20,
                        upgradePrice: 1000000,
                        researchPoints: 500
                    },
                    {
                        description: "Pode ir a qualquer outro planeta ou Lua do sistema solar. Tem o valor máximo de dez blueprints.",
                        launch: 30000,
                        missions: 60000,
                        creator: 12000,
                        costPerTon: 20,
                        upgradePrice: 10000000,
                        researchPoints: 2000
                    }],
                    agencies: [{}],
                    queuedOps: []
                })
                fs.writeFile("server.json", JSON.stringify(server), function (error) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        }
        if (server.list[serv].permission < 1) {
            message.channel.send({ embeds: [setEmbed(message, `:frowning2: Esse servidor foi banido.`, "", "", "", "ef5250")] })
            return
        }
        if (!message.content.includes("@here") && !message.content.includes("@everyone") && message.mentions.has(client.user.id)) {
            message.channel.send({ embeds: [setEmbed(message, `Meu prefixo é \`${server.list[serv].prefix}\`\n\n use \`ajuda\` para ver os comandos disponíveis.`)] })
            return
        }
        if (!message.content.startsWith(server.list[serv].prefix)) { return }
        const a = message.content.slice(1).trim().split(" ")
        let c = a.shift()
        c = c.toLowerCase()
        //Nível 1
        //pagar-lançamento
        if (c == cmds.list[0].command[0] || c == cmds.list[0].command[1] || c == cmds.list[0].command[2]) {
            if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (a.length != 4 || isNaN(a[1]) || isNaN(a[3]) || a[2].toLowerCase() != "s" && a[2].toLowerCase() != "n") { syntaxError(message, 0); return }

            if (!server.list[serv].levels[a[3] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O nível ${a[3]} ainda não foi definido.`, "", "", "", "ef5250")] })
                return
            }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
            }
            if (server.list[serv].agencies[agencyI].level > server.list[serv].levels[a[3] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O usuário ainda não possui o nível ${a[2]}.`, "", "", "", "ef5250")] })
                return
            }
            let reward, balanceResult, isReusable = "Não"
            if (a[2] == "s") {
                reward = server.list[serv].levels[a[3] - 1].launch - a[1] / 2 * server.list[serv].levels[a[3] - 1].costPerTon
                isReusable = "Sim"
            } else {
                reward = server.list[serv].levels[a[3] - 1].launch - a[1] * server.list[serv].levels[a[3] - 1].costPerTon
            }
            balanceResult = reward > 0 ? "Recompensa" : "Prejuízo";
            server.list[serv].agencies[agencyI].money += parseInt(reward)
            let embed = new Discord.MessageEmbed()
                .setTitle("Pagamento de Lançamento Aprovado")
                .setColor("#17b091")
                .setFields(
                    { name: `:level_slider: Nível: ${a[3]}`, value: `\u200B` },
                    { name: `:oil: Massa: ${a[1]} T`, value: `\u200B`, inline: true },
                    { name: `Reutilizável: ${isReusable}`, value: `\u200B`, inline: true },
                    { name: "Agência: ", value: `${server.list[serv].agencies[agencyI].name} (${a[0]})\n\u200B`},
                    { name: ":dollar: Recompensa: ", value: `RP$ ${formatValue(reward)}`, inline: true },
                )
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            let date = getNow()
            server.list[serv].agencies[agencyI].statement.push(`Pagamento de lançamento no valor de :dollar: RP$ ${formatValue(reward)}. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //pagar-missão
        else if (c == cmds.list[1].command[0] || c == cmds.list[1].command[1] || c == cmds.list[1].command[2]) {
             if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (a.length != 4 || isNaN(a[1]) || isNaN(a[3]) || a[2].toLowerCase() != "s" && a[2].toLowerCase() != "n") { syntaxError(message, 1); return }

            if (!server.list[serv].levels[a[3] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O nível ${a[3]} ainda não foi definido.`, "", "", "", "ef5250")] })
                return
            }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
            }
            if (server.list[serv].agencies[agencyI].level > server.list[serv].levels[a[3] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O usuário ainda não possui o nível ${a[2]}.`, "", "", "", "ef5250")] })
                return
            }
            let reward, balanceResult, isReusable = "Não"
            if (a[2] == "s") {
                reward = server.list[serv].levels[a[3] - 1].missions - a[1] / 2 * server.list[serv].levels[a[3] - 1].costPerTon
                isReusable = "Sim"
            } else {
                reward = server.list[serv].levels[a[3] - 1].missions - a[1] * server.list[serv].levels[a[3] - 1].costPerTon
            }
            let date = getNow()
            balanceResult = reward > 0 ? "Recompensa" : "Prejuízo";
            server.list[serv].agencies[agencyI].money += parseInt(reward)
            let embed = new Discord.MessageEmbed()
                .setTitle("Pagamento de Missão Aprovado")
                .setColor("#17b091")
                .setFields(
                    { name: `:level_slider: Nível: ${a[3]}`, value: `\u200B` },
                    { name: `:oil: Massa: ${a[1]} T`, value: `\u200B`, inline: true },
                    { name: `Reutilizável: ${isReusable}`, value: `\u200B`, inline: true },
                    { name: "Agência: ", value: `${server.list[serv].agencies[agencyI].name} (${a[0]})\n\u200B`},
                    { name: ":dollar: Recompensa: ", value: `RP$ ${formatValue(reward)}`, inline: true },
                )
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            server.list[serv].agencies[agencyI].statement.push(`Pagamento de missão no valor de :dollar: RP$ ${formatValue(reward)}. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //pagar-criador
        else if (c == cmds.list[2].command[0] || c == cmds.list[2].command[1]) {
            if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (a.length != 3 || isNaN(a[1]) || isNaN(a[2])) { syntaxError(message, 2); return }

            if (!server.list[serv].levels[a[2] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O nível ${a[2]} ainda não foi definido.`, "", "", "", "ef5250")] })
                return
            }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
            }
            if (server.list[serv].agencies[agencyI].level > server.list[serv].levels[a[2] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O usuário ainda não possui o nível ${a[2]}.`, "", "", "", "ef5250")] })
                return
            }
            let reward = a[1] * server.list[serv].levels[a[2] - 1].missions
            let date = getNow()
            server.list[serv].agencies[agencyI].money += parseInt(reward)
            let embed = new Discord.MessageEmbed()
                .setTitle("Pagamento para Criador Aprovado")
                .setColor("#17b091")
                .setFields(
                    { name: `:level_slider: Nível: ${a[2]}`, value: `\u200B` },
                    { name: `Número de concluíntes: ${a[1]}`, value: `\u200B` },
                    { name: "Agência: ", value: `${server.list[serv].agencies[agencyI].name} (${a[0]})\n\u200B`},
                    { name: ":dollar: Recompensa: ", value: `RP$ ${formatValue(reward)}`, inline: true },
                )
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })

            server.list[serv].agencies[agencyI].statement.push(`Recompensa de criador adicionada no valor de :dollar: RP$ ${formatValue(reward)}. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            return
        }
        //definir-nível
        else if (c == cmds.list[3].command[0] || c == cmds.list[3].command[1] || c == cmds.list[3].command[2]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (Number.isInteger(a[0]) || a[0] <= 0 || isNaN(a[1]) || isNaN(a[2]) || isNaN(a[3] || isNaN(a[4]))) { syntaxError(message, 3); return }
            if (a[0] > 1 && !server.list[serv].levels[a[0] - 2]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Defina o nível ${a[0] - 1} antes`, "", "", "", "ef5250")] })
                return
            }
            if (server.list[serv].levels[a[0] - 1]) {
                server.list[serv].levels[a[0] - 1].description = a[1]
                server.list[serv].levels[a[0] - 1].launch = parseFloat(a[2])
                server.list[serv].levels[a[0] - 1].missions = parseFloat(a[3])
                server.list[serv].levels[a[0] - 1].creator = parseFloat(a[4])
                server.list[serv].levels[a[0] - 1].costPerTon = parseFloat(a[5])
                server.list[serv].levels[a[0] - 1].upgradePrice = parseFloat(a[6])
                server.list[serv].levels[a[0] - 1].researchPoints = parseFloat(a[6])
            } else {
                server.list[serv].levels.push({
                    description: a[1],
                    launch: parseFloat(a[2]),
                    mission: parseFloat(a[3]),
                    creator: parseFloat(a[4]),
                    costPerTon: parseFloat(a[5]),
                    upgradePrice: parseFloat(a[6]),
                    researchPoints: parseFloat(a[6])
                })
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O nível ${a[0]} foi definido com sucesso.\n\n Suas quantias são: ${a[1]} de recompensa por lançamento, ${a[2]} de recompensa por missão, ${a[3]} de recompensa para criadores e ${a[4]} de custo por tonelada.`, "", "", "", "1baf22")] })
            return
        }
        //mostrar-níveis
        else if (c == cmds.list[4].command[0] || c == cmds.list[4].command[1] || c == cmds.list[4].command[2]) {
            if (a[0]) { syntaxError(message, 4); return }
            if (!server.list[serv].levels[0]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Não há níveis definidos.`, "", "", "", "ef5250")] })
                return
            }
            let embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor(message.author.tag, message.author.avatarURL())
                .addFields(
                    { name: "Níveis", value: `Os níveis definirão limites, custo e recompensa para cada agência. Ao atualizar, você pode liberar novos recursos que te auxiliarão em sua aventura.` },
                )
            for (let i = 0, ii = 0; i < server.list[serv].levels.length;) {
                if (ii == 3) {
                    message.channel.send({ embeds: [embed] })
                    let embed = new Discord.MessageEmbed()
                        .setColor("#17b091")
                    ii = 0
                }
                ii++
                embed.addFields(
                    { name: ":level_slider: Nível: " + (i + 1), value: `\u200B` },
                    { name: "Descrição: ", value: `${server.list[serv].levels[i].description}\n\u200B` },
                    { name: "Remuneração: ", value: `(Ganhos brutos para cada área).` },
                    { name: `Lançamento`, value: `:dollar: RP$ ${formatValue(server.list[serv].levels[i].launch)}`, inline: true },
                    { name: `Missão`, value: `:dollar: RP$ ${formatValue(server.list[serv].levels[i].missions)}`, inline: true },
                    { name: `Criador`, value: `:dollar: RP$ ${formatValue(server.list[serv].levels[i].creator)}\n\u200B`, inline: true },
                    { name: `Custo de atualização:`, value: `:dollar: RP$ ${formatValue(server.list[serv].levels[i].upgradePrice)}\n :atom: ${formatValue(server.list[serv].levels[i].researchPoints)} pontos de pesquisa.\n\u200B`, inline: true }                    
                )
                i++
                if (i == server.list[serv].levels.length) {
                    message.channel.send({ embeds: [embed] })
                }
            }
            return
        }
        //remover-nível
        else if (c == cmds.list[5].command[0] || c == cmds.list[5].command[1] || c == cmds.list[5].command[2]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (Number.isInteger(a[0]) || a[1]) { syntaxError(message, 5); return }
            if (!server.list[serv].levels[(a[0] - 1)]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Esse nível não existe.`, "", "", "", "ef5250")] })
                return
            }
            if (server.list[serv].levels.length == 1) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não pode remover todos os níveis.`, "", "", "", "ef5250")] })
                return
            }
            server.list[serv].levels.splice(a[0] - 1, 1)
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Nível apagado com sucesso`, "", "", "", "1baf22")] })
            return
        }
        //defir-prefixo
        else if (c == cmds.list[6].command[0] || c == cmds.list[6].command[1] || c == cmds.list[6].command[2]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (!a[0] || a[1]) { syntaxError(message, 6); return }
            server.list[serv].prefix = [a[0]]

            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O prefixo foi definido para ${server.list[serv].syntax} com sucesso.`, "", "", "", "1baf22")] })
            return
        }
        //ajuda
        else if (c == "help" || c == "ajuda" || c == "?" || c == "comandos") {
            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setLabel('Ver Comandos')
                        .setURL("https://rp-manager.ml/comandos/")
                        .setStyle('LINK'),
                )
            message.channel.send({ embeds: [setEmbed(message, `Vá a nosso site para ver a lista de comandos.\n\nNível ${server.list[serv].permission}/5 de permissão de servidor.`, "Ajuda", "Desenvolvido por Frederico Andrade")], components: [row] })
            return
        }
        //Nível 2
        if (server.list[serv].permission < 2) { return }
        //adicionar-missão
        else if (c == cmds.list[7].command[0] || c == cmds.list[7].command[1]) {
            if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            let elements = ["", "", "", "", "", "", ""]
            for (let i = 0, ii = 0, iii = 0; i < a.length; i++) {
                if (a[i] == "&") {
                    elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
                    ii++
                } else {
                    elements[ii] += a[i] + " "
                }
                iii++
                if (iii == a.length) {
                    elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
                }
            }
            if (!server.list[serv].levels[(elements[3] - 1)]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Esse nível não existe.`, "", "", "", "ef5250")] })
                return
            }
            if (elements[0] == "" || elements[1] == "" || elements[2] == "" || isNaN(elements[3]) || elements[4] == "" || elements[5] == "" || elements[6] == "") { syntaxError(message, 7); return }
            if (server.list[serv].missions) {
                server.list[serv].missions.push([elements[0], elements[1], elements[2], parseInt(elements[3]), elements[4], elements[5], elements[6], message.author.tag])
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão cadastrada com sucesso`)] })
            return
        }
        //mostar-missões
        else if (c == cmds.list[8].command[0] || c == cmds.list[8].command[1] || c == cmds.list[8].command[2]) {
            if (a[0]) { syntaxError(message, 8); return }

            if (server.list[serv].missions.length == 0) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Não há missões cadastradas.`, "", "", "", "ef5250")] })
                return
            }
            let str = ""
            const embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor(message.author.tag, message.author.avatarURL())

            for (let i = 0; i < server.list[serv].missions.length; i++) {
                str += `\`Missão ${i + 1}\`\n \`Título:\` ${server.list[serv].missions[i][0]}\n \`Descrição:\` ${server.list[serv].missions[i][1]}\n \`Objetivo:\` ${server.list[serv].missions[i][2]}\n \`Dificuldade:\` ${server.list[serv].missions[i][3]}\n \`Recompensa estimada:\` ${server.list[serv].levels[server.list[serv].missions[i][3] -1].missions - 500 * server.list[serv].levels[server.list[serv].missions[i][3] -1].costPerTon}\n \`Nota:\` ${server.list[serv].missions[i][4]}\n \`Proibido:\` ${server.list[serv].missions[i][5]}\n \`Prazo de entrega:\` ${server.list[serv].missions[i][6]}\n \`Criador:\` ${server.list[serv].missions[i][7]}\n\n`
            }
            embed.setDescription(str)
            message.channel.send({ embeds: [embed] })
            return
        }
        //remover-missão
        else if (c == cmds.list[9].command[0] || c == cmds.list[9].command[1] || c == cmds.list[9].command[2]) {
            if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (isNaN(a[0]) || a[1]) { syntaxError(message, 9); return }
            if (!server.list[serv].missions[(a[0] - 1)]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Essa missão não existe.`, "", "", "", "ef5250")] })
                return
            }
            server.list[serv].missions.splice(a[0] - 1, 1)
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão apagada com sucesso.`, "", "", "", "1baf22")] })
            return
        }
        //postar-missão
        else if (c == cmds.list[10].command[0] || c == cmds.list[10].command[1] || c == cmds.list[10].command[2]) {
            if (!message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID) && !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (!server.list[serv].missionChannelID || server.list[serv].missionChannelID == "") {
                message.channel.send({ embeds: [setEmbed(message, `:x: O canal de postagem de missões ainda não foi definido, use \`${cmds.list[11].syntax}\` para definí-lo.`, "", "", "", "ef5250")] })
                return
            }
            if (!a[0] || a[1]) { syntaxError(message, 10); return }

            if (!server.list[serv].missions[a[0] - 1]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Essa missão não existe.`, "", "", "", "ef5250")] })
                return
            }
            let i = a[0] - 1
            embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor("")
                .setTitle("Missão: " + server.list[serv].missions[i][0])
                .setFields(
                    { name: "História: ", value: `${server.list[serv].missions[i][1]}\n\u200B` },
                    { name: "Objetivo: ", value: `${server.list[serv].missions[i][2]}\n\u200B` },
                    { name: "Agência Mínima: ", value: `Nível ${server.list[serv].missions[i][3]}\n\u200B` },
                    { name: "Recompensa estimada: ", value: `${server.list[serv].levels[server.list[serv].missions[i][3] - 1].missions - 500 * server.list[serv].levels[server.list[serv].missions[i][3]].costPerTon}\n\u200B` },
                    { name: "Notas: ", value: `${server.list[serv].missions[i][4]}\n\u200B` },
                    { name: "Proibido: ", value: `${server.list[serv].missions[i][5]}\n\u200B` },
                    { name: "Prazo de entrega: ", value: `${server.list[serv].missions[i][6]}\n\u200B` },
                    { name: "Criador: ", value: `${server.list[serv].missions[i][7]}` }
                )
                .setTimestamp()
            try {
                client.channels.cache.get(server.list[serv].missionChannelID).send({ embeds: [embed] })
                message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Missão postada com sucesso`, "", "", "", "1baf22")] })
            } catch (error) {
                message.channel.send({ embeds: [setEmbed(message, `:x: O canal de postagem de missões não pôde ser reconhecido, use \`definir-canal-missões [id do canal]\` para definí-lo.`, "", "", "", "ef5250")] })
            }
            return
        }
        //definir-canal-missões
        else if (c == cmds.list[11].command[0] || c == cmds.list[11].command[1] || c == cmds.list[11].command[2]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (!a[0]) { syntaxError(message, 11); return }
            server.list[serv].missionChannelID = mentionToId(a[0])
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O id do canal de missões foi definido com sucesso para ${server.list[serv].missionChannelID}.`, "", "", "", "1baf22")] })
            return
        }
        //definir-cargo-gerenciador
        else if (c == cmds.list[12].command[0] || c == cmds.list[12].command[1]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (!a[0] || a[1]) { syntaxError(message, 12); return }

            server.list[serv].manutentionRoleID = mentionToId(a[0])
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: O id cargo de gerenciador foi definido com sucesso para ${server.list[serv].manutentionRoleID}.`, "", "", "", "1baf22")] })
            return
        }
        //registrar-agência
        else if (c == cmds.list[13].command[0] || c == cmds.list[13].command[1]) {
            let elements = ["", ""]
            for (let i = 0, ii = 0; i < a.length; i++) {
                if (a[i] == "&") {
                    ii++
                } else {
                    elements[ii] += a[i] + " "
                }
            }
            if (elements[0] == "" || elements[1] == "") { syntaxError(message, 13); return }
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    server.list[serv].agencies[i].name = elements[0]
                    server.list[serv].agencies[i].description = elements[1]
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    server.list[serv].agencies.push(
                        {
                            userId: message.author.id,
                            name: elements[0],
                            description: elements[1],
                            level: 1,
                            research: 0,
                            blueprints: [],
                            money: 0,
                            statement: []
                        }
                    )
                    break
                }
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: A agência ${elements[0]} foi definida com sucesso.`, "", "", "", "1baf22")] })
            return
        }
        //agência
        else if (c == cmds.list[14].command[0] || c == cmds.list[14].command[1] || c == cmds.list[14].command[2]) {
            if (a[0]) { 
                let agencyI
                for (let i = 0; i < server.list[serv].agencies.length; i++) {
                    if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                        agencyI = i
                        break
                    }
                    if (i == server.list[serv].agencies.length - 1) {
                        message.channel.send({ embeds: [setEmbed(message, `:x: Esse usuários não existe ou não tem uma agência registrada.`, "", "", "", "ef5250")] })
                        return
                    }
                }
                let embed = new Discord.MessageEmbed()
                    .setColor("#17b091")
                    .setTitle("Agência: " + server.list[serv].agencies[agencyI].name)
                    .setFields(
                        { name: `:level_slider: Nível: ${server.list[serv].agencies[agencyI].level}`, value: `\u200B` },
                        { name: ":notepad_spiral: Descrição: ", value: `${server.list[serv].agencies[agencyI].description}`, inline: true },
                        { name: ":dollar: Patrimônio: ", value: `RP$ ${formatValue(server.list[serv].agencies[agencyI].money)}`, inline: true },
                        { name: ":atom: Pontos de pesquisa: ", value: `${formatValue(server.list[serv].agencies[agencyI].research)}/${formatValue(server.list[serv].levels[server.list[serv].agencies[agencyI].level].researchPoints)}`, inline: true }
                    )
                    .setTimestamp()
                message.channel.send({ embeds: [embed] })
                return
            }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            let embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setTitle("Agência: " + server.list[serv].agencies[agencyI].name)
                .setFields(
                    { name: `:level_slider: Nível: ${server.list[serv].agencies[agencyI].level}`, value: `\u200B` },
                    { name: ":notepad_spiral: Descrição: ", value: `${server.list[serv].agencies[agencyI].description}`, inline: true },
                    { name: ":dollar: Patrimônio: ", value: `RP$ ${formatValue(server.list[serv].agencies[agencyI].money)}`, inline: true },
                    { name: ":atom: Pontos de pesquisa: ", value: `${formatValue(server.list[serv].agencies[agencyI].research)}/${formatValue(server.list[serv].levels[server.list[serv].agencies[agencyI].level -1].maxResearchPoints)}`, inline: true }
                )
                .setTimestamp()
            message.channel.send({ embeds: [embed] })
            return
        }
        //remover-agência
        else if (c == cmds.list[15].command[0] || c == cmds.list[15].command[1]) {
            if (a[0] != "confirmar" || a[1] != "remoção") { syntaxError(message, 15); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            server.list[serv].agencies.splice(agencyI, 1)
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Agência removida com sucesso.`, "", "", "", "1baf22")] })
            return
        }
        //registros
        else if (c == cmds.list[16].command[0] || c == cmds.list[16].command[1]) {
            if (a[0]) { syntaxError(message, 16); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            if (server.list[serv].agencies[agencyI].statement.length == 0) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não possui extratos.`, "", "", "", "ef5250")] })
                return
            }
            let embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor(message.author.tag, message.author.avatarURL())
                .setTitle("Registros")
            let str = ""
            for (let i = 0; i < server.list[serv].agencies[agencyI].statement.length; i++) {
                str += `:page_with_curl: - ${server.list[serv].agencies[agencyI].statement[i]} \n\n`
            }
            embed.setDescription(str)
            message.channel.send({ embeds: [embed] })
            return
        }
        //pesquisar
        else if (c == cmds.list[17].command[0] || c == cmds.list[17].command[1]) {
            if (Number.isInteger(a[0]) || a[1] || !a[0] || isNaN(a[0]) || a[0] < 1) { syntaxError(message, 17); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            let cost = server.list[serv].research.cost * a[0]
            if (server.list[serv].agencies[agencyI].money >= cost) {
                server.list[serv].agencies[agencyI].money -= parseInt(cost)
            } else {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem dinheiro suficiente para fazer esse investimento. Custo: :dollar: RP$ ${formatValue(cost)}.`, "", "", "", "ef5250")] })
                return
            }
            let date = getNow()
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Investimento de :dollar: RP$ ${formatValue(cost)} em :package: ${a[0]} pacote(s) de pesquisa concluído. Espere 24 horas para ver o resultado.`, "", "", "", "1baf22")] })
            server.list[serv].agencies[agencyI].statement.push(`Investimento de :dollar: RP$ ${formatValue(cost)} em :package: ${a[0]} pacote(s) de pesquisa. ${date}.`)
            let points = parseInt(Math.random() * (server.list[serv].research.max - server.list[serv].research.min) + server.list[serv].research.min) * a[0]

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            server.list[serv].queuedOps.push({
                time: new Date().getTime() + 86400000,
                userId: message.author.id,
                op: "add-research",
                value: points
            })
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //atualizar
        else if (c == cmds.list[18].command[0] || c == cmds.list[18].command[1]) {
            if (a[0]) { syntaxError(message, 18); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }

            let cost = server.list[serv].levels[server.list[serv].agencies[agencyI].level].upgradePrice,
            researchCost = server.list[serv].levels[server.list[serv].agencies[agencyI].level].researchPoints

            if (server.list[serv].agencies[agencyI].money < cost) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem dinheiro suficiente para fazer essa atualização. Necessário: :dollar: RP$ ${formatValue(cost)}.`, "", "", "", "ef5250")] })
                return
            }
            if (server.list[serv].agencies[agencyI].research < researchCost) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem pontos de pesquisa suficientes para fazer essa atualização. Necessário: :atom: ${formatValue(researchCost)}.`, "", "", "", "ef5250")] })
                return
            }
            server.list[serv].agencies[agencyI].money -= parseInt(cost)
            server.list[serv].agencies[agencyI].research -= parseInt(researchCost)
            server.list[serv].agencies[agencyI].level++

            let date = getNow()
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Parabéns! A atualização para nível ${server.list[serv].agencies[agencyI].level} por :dollar: RP$ ${formatValue(cost)} e :atom: ${formatValue(researchCost)} pontos de pesquisa foi concluída.`, "", "", "", "1baf22")] })
            server.list[serv].agencies[agencyI].statement.push(`Atualização para nível ${server.list[serv].agencies[agencyI].level + 1} por :dollar: RP$ ${formatValue(cost)} e :atom: ${formatValue(researchCost)} pontos de pesquisa. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //remover-dinheiro
        else if (c == cmds.list[19].command[0] || c == cmds.list[19].command[1]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (a.length != 2 || isNaN(a[1]) ) { syntaxError(message, 19); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Esse usuário não existe ou ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            let date = getNow()
            server.list[serv].agencies[agencyI].money -= parseInt(a[1])
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: $RP ${formatValue(a[1])} adicionado de ${server.list[serv].agencies[serv].name} com sucesso.`, "", "", "", "1baf22")] })
            server.list[serv].agencies[agencyI].statement.push(`:dollar: RP$ ${formatValue(a[1])} adicionado. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //adicionar-dinheiro
        else if (c == cmds.list[20].command[0] || c == cmds.list[20].command[1]) {
            if (!message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR) && !message.member.roles.cache.some(r => r.id == server.list[serv].manutentionRoleID)) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem permissão para usar esse comando.`, "", "", "", "ef5250")] })
                return
            }
            if (a.length != 2 || isNaN(a[1]) ) { syntaxError(message, 19); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (mentionToId(a[0]) == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Esse usuário não existe ou ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            let date = getNow()
            server.list[serv].agencies[agencyI].money += parseInt(a[1])
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            server.list[serv].agencies[agencyI].statement.push(`:dollar: RP$ ${formatValue(a[1])} removido. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: $RP ${formatValue(a[1])} adicionado à agência ${server.list[serv].agencies[serv].name} com sucesso.`, "", "", "", "1baf22")] })
            return
        }
        //Nível 3
        if (server.list[serv].permission < 3) { return }
        //executar-lançamento
        else if (c == cmds.list[18].command[0] || c == cmds.list[18].command[1] || c == cmds.list[18].command[2]) {
        }
        //adicionar-blueprint
        else if (c == cmds.list[16].command[0] || c == cmds.list[16].command[1]) {
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            if (server.list[serv].agencies[agencyI].blueprints.length >= server.list[serv].levels[server.list[serv].agencies[agencyI].level - 1].maxBlueprints) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você já tem o número máximo de blueprints registradas.`, "", "", "", "ef5250")] })
                return
            }
            let elements = ["", "", "", "", "", "", ""]
            for (let i = 0, ii = 0, iii = 0; i < a.length; i++) {
                if (a[i] == "&") {
                    elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
                    ii++
                } else {
                    elements[ii] += a[i] + " "
                }
                iii++
                if (iii == a.length) {
                    elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
                }
            }
            if (elements[3].toLowerCase() == "s") {
                elements[3] = true
            } else if (elements[3].toLowerCase() == "n") {
                elements[3] = false
            }
            if (elements[0] == "" || elements[1] == "" || isNaN(elements[2]) || (elements[3] != true && elements[3] != false)) { syntaxError(message, 16); return }

            if (elements[5].substr(0, 8) != "https://" || (elements[5].substr(-4) != ".png" && elements[5].substr(-4) != ".jpg")) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Verifique o link da imagem da sua blueprint.`, "", "", "", "ef5250")] })
                return
            }
            if (elements[6].substr(0, 8) != "https://" || (elements[6].substr(-4) != ".zip" && elements[6].substr(-4) != ".rar")) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Verifique o link do arquivo da sua blueprint.`, "", "", "", "ef5250")] })
                return
            }
            let type, cost, tax
            if (elements[4].toLowerCase() == "pública" || elements[4].toLowerCase() == "publica") {
                type = "public"
                cost = server.list[serv].levels[0].mission
                tax = server.list[serv].blueprints.public.dailyTax
            } else if (elements[4].toLowerCase() == "privada") {
                type = "private"
                cost = server.list[serv].levels[0].launch
                tax = server.list[serv].blueprints.private.dailyTax
            } else {
                message.channel.send({ embeds: [setEmbed(message, `:x: Especifique corretamente se sua blueprint é pública ou privada.`, "", "", "", "ef5250")] })
                return
            }
            if (server.list[serv].agencies[agencyI].money >= cost) {
                server.list[serv].agencies[agencyI].money -= parseInt(cost)
            } else {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem dinheiro suficiente para registrar sua blueprint. Custo: :dollar: RP$ ${formatValue(cost)}.`, "", "", "", "ef5250")] })
                return
            }
            server.list[serv].agencies[agencyI].blueprints.push(
                {
                    name: elements[0],
                    description: elements[1],
                    weight: parseInt(elements[2]),
                    reusable: elements[3],
                    type: type,
                    launches: 0,
                    image: elements[5],
                    file: elements[6],
                    author: message.author.tag,
                    state: "active"
                }
            )
            let date = getNow()
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: A blueprint ${elements[0]} foi registrada com sucesso por :dollar: RP$ ${formatValue(cost)}. Mantenha a taxa diária de :dollar: RP$ ${formatValue(tax)} em dia para evitar que sua blueprint seja cancelada.`, "", "", "", "1baf22")] })

            server.list[serv].agencies[agencyI].statement.push(`Registro da blueprint "${elements[0]}" no valor de :dollar: RP$ ${formatValue(cost)}. ${date}.`)

            if (server.list[serv].agencies[agencyI].statement.length > 10) {
                server.list[serv].agencies[agencyI].statement.shift()
            }
            server.list[serv].queuedOps.push({
                time: new Date().getTime() + 86400000,
                userId: message.author.id,
                description: elements[0],
                op: "pay-bp-tax",
                value: tax
            })
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            return
        }
        //minhas-blueprints
        else if (c == cmds.list[17].command[0] || c == cmds.list[17].command[1]) {
            if (a[0]) { syntaxError(message, 17); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            if (server.list[serv].agencies[agencyI].blueprints.length == 0) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Você não tem blueprints registradas.`, "", "", "", "ef5250")] })
                return
            }
            const embed = new Discord.MessageEmbed()
                .setColor("#17b091")
                .setAuthor(message.author.tag, message.author.avatarURL())

            for (let i = 0; i < server.list[serv].agencies[agencyI].blueprints.length; i++) {
                let cost, reu, type, state
                if (server.list[serv].agencies[agencyI].blueprints[i].reusable) {
                    cost = server.list[serv].agencies[agencyI].blueprints[i].weight / 2 * server.list[serv].levels[0].costPerTon
                    reu = "Sim"
                }
                else if (!server.list[serv].agencies[agencyI].blueprints[i].reusable) {
                    cost = server.list[serv].agencies[agencyI].blueprints[i].weight * server.list[serv].levels[0].costPerTon
                    reu = "Não"
                }
                if (server.list[serv].agencies[agencyI].blueprints[i].type == "private") {
                    type = "Privada"
                }
                else if (server.list[serv].agencies[agencyI].blueprints[i].type == "public") {
                    type = "Pública"
                }
                if (server.list[serv].agencies[agencyI].blueprints[i].state == "active") {
                    state = ":white_check_mark: Ativa"
                } else if (server.list[serv].agencies[agencyI].blueprints[i].state == "expired") { state = ":exclamation: Expirada" }
                embed.setTitle(i + 1 + " - Blueprint: " + server.list[serv].agencies[agencyI].blueprints[i].name)
                    .setFields(
                        { name: ":notepad_spiral: Descrição: ", value: `${server.list[serv].agencies[agencyI].blueprints[i].description}`, inline: true },
                        { name: `:oil: Peso:`, value: ` ${server.list[serv].agencies[agencyI].blueprints[i].weight} T`, inline: true },
                        { name: `Reutilizável:`, value: ` ${reu}`, inline: true },
                        { name: `Lançamentos totais:`, value: ` ${server.list[serv].agencies[agencyI].blueprints[i].launches}`, inline: true },
                        { name: `:wrench: Custo de Lançamento:`, value: `:dollar: RP$ ${formatValue(cost)}` },
                        { name: `Tipo:`, value: `${type}`, inline: true },
                        { name: `Estado:`, value: `${state}`, inline: true }
                    )
                embed.setThumbnail(server.list[serv].agencies[agencyI].blueprints[i].image)
                message.channel.send({ embeds: [embed] })
            }
            return
        }
        //remover-blueprint
        else if (c == cmds.list[18].command[0] || c == cmds.list[18].command[1]) {
            if (!a[0] || a[1]) { syntaxError(message, 18); return }
            let agencyI
            for (let i = 0; i < server.list[serv].agencies.length; i++) {
                if (message.author.id == server.list[serv].agencies[i].userId) {
                    agencyI = i
                    break
                }
                if (i == server.list[serv].agencies.length - 1) {
                    message.channel.send({ embeds: [setEmbed(message, `:x: Você ainda não tem uma agência registrada.`, "", "", "", "ef5250")] })
                    return
                }
            }
            if (server.list[serv].agencies[agencyI].blueprints.length == 0) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Não há blueprints registradas.`, "", "", "", "ef5250")] })
                return
            }
            if (!server.list[serv].agencies[agencyI].blueprints[(a[0] - 1)]) {
                message.channel.send({ embeds: [setEmbed(message, `:x: Essa blueprint não existe.`, "", "", "", "ef5250")] })
                return
            }
            server.list[serv].agencies[agencyI].blueprints.splice(a[0] - 1, 1)
            fs.writeFile("server.json", JSON.stringify(server), function (error) {
                if (error) {
                    console.log(error);
                }
            })
            message.channel.send({ embeds: [setEmbed(message, `:white_check_mark: Blueprint removida com sucesso.`, "", "", "", "1baf22")] })
            return
        }
    } catch (error) {
        console.log(error)
        message.channel.send({ embeds: [setEmbed(message, `:frowning2: Algo de muito errado aconteceu! Chame o Frederico Andrade para ver se ele pode ajudar.`, "", "", "", "ef5250")] })
    }
})
function setEmbed(message, description, title, footer, showTime = false, color = "3e8100") {
    const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(description)
    if (title) {
        embed.setTitle(title)
    }
    if (footer) {
        embed.setFooter(footer)
    }
    if (showTime) {
        embed.setTimestamp()
    }
    if (color) {
        embed.setColor(color)
    }
    return embed
}
function syntaxError(m, i) {
    const embed = new Discord.MessageEmbed()
        .setTitle("Erro de sintaxe")
        .setAuthor(m.author.tag, m.author.avatarURL())
        .setDescription(`Argumento incorreto, faltando ou em demasia.\n use:\n \`${cmds.list[i].syntax}\`\n\n Descrição: ${cmds.list[i].description}`)
        .setColor("ef5250")
    m.channel.send({ embeds: [embed] })
}
function getNow() {
    let d = new Date(),
        months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    return `Dia ${d.getDate()} de ${months[d.getMonth() - 1]} de ${d.getFullYear()}, às ${d.getHours()} hora(s) e ${d.getMinutes()} minuto(s)`
}
function formatValue(n) {
    let pf = ["k", "mi", "bi", "tri"], i = 0
    for (; n / 1000 >= 1; i++, n /= 1000);
    n = parseInt(n * 100) / 100;
    return i ? n + " " + pf[i - 1] : n;
}
function queuedOps() {
    for (let i = 0; i < server.list.length; i++) {
        let serv = server.list[i]
        for (let queI = 0; queI < serv.queuedOps.length; queI++) {
            let date = getNow()
            if (serv.queuedOps[0].time > new Date().getTime()) { return }

            if (serv.queuedOps[0].op == "pay-bp-tax") {
                let agencyI, bpI
                for (let i = 0; i < serv.agencies.length; i++) {
                    if (serv.queuedOps[0].userId == serv.agencies[i].userId) {
                        agencyI = i
                        break
                    }
                }
                for (let i = 0; i < serv.agencies[agencyI].blueprints.length; i++) {
                    if (serv.queuedOps[0].description == serv.agencies[agencyI].blueprints[i].name) {
                        bpI = i
                        break
                    }
                }
                if (bpI == undefined) {
                    serv.queuedOps.shift()
                    fs.writeFile("server.json", JSON.stringify(server), function (error) {
                        if (error) {
                            console.log(error);
                        }
                    })
                    continue
                }
                if (serv.agencies[agencyI].blueprints[bpI].state == "expired"){
                    continue
                }
                if (serv.agencies[agencyI].money >= serv.queuedOps[0].value) {
                    serv.agencies[agencyI].money -= serv.queuedOps[0].value

                } else {
                    serv.agencies[agencyI].blueprints[bpI].state = "expired"
                    serv.queuedOps.shift()
                    serv.agencies[agencyI].statement.push(`Blueprint "${serv.queuedOps[0].description}" cancelada por falta de pagamento (${formatValue(serv.queuedOps[0].value)}). ${date}.`)
                    if (serv.agencies[agencyI].statement.length > 10) {
                        serv.agencies[agencyI].statement.shift()
                    }
                    fs.writeFile("server.json", JSON.stringify(server), function (error) {
                        if (error) {
                            console.log(error);
                        }
                    })
                    continue
                }

                serv.agencies[agencyI].statement.push(`Taxa de blueprint "${serv.queuedOps[0].description}" no valor de :dollar: RP$ ${formatValue(serv.queuedOps[0].value)}. ${date}.`)

                if (serv.agencies[agencyI].statement.length > 10) {
                    serv.agencies[agencyI].statement.shift()
                }
                serv.queuedOps.push({
                    time: new Date().getTime() + 86400000,
                    userId: serv.queuedOps[0].userId,
                    description: serv.queuedOps[0].description,
                    op: "pay-bp-tax",
                    value: serv.queuedOps[0].value
                })
                serv.queuedOps.shift()
                fs.writeFile("server.json", JSON.stringify(server), function (error) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
            else if (serv.queuedOps[0].op == "add-research") {
                let agencyI
                for (let i = 0; i < serv.agencies.length; i++) {
                    if (serv.queuedOps[0].userId == serv.agencies[i].userId) {
                        agencyI = i
                        break
                    }
                }
                if (serv.queuedOps[0].value + serv.agencies[agencyI].research <= serv.levels[serv.agencies[agencyI].level-1].maxResearchPoints) {
                    serv.agencies[agencyI].research += serv.queuedOps[0].value
                } else {
                    serv.agencies[agencyI].research = serv.levels[serv.agencies[agencyI].level -1].maxResearchPoints
                    serv.agencies[agencyI].statement.push(`Pesquisa concluída, você agora tem a quantidade máxima de pontos de pesquisa. ${date}.`)
                    serv.queuedOps.shift()
                    fs.writeFile("server.json", JSON.stringify(server), function (error) {
                        if (error) {
                            console.log(error);
                        }
                    })
                    break
                }
                serv.agencies[agencyI].statement.push(`Pesquisa concluída, você conseguiu :atom: ${formatValue(serv.queuedOps[0].value)} ponto(s) de pesquisa. ${date}.`)
                if (serv.agencies[agencyI].statement.length > 10) {
                    serv.agencies[agencyI].statement.shift()
                }
                serv.queuedOps.shift()
                fs.writeFile("server.json", JSON.stringify(server), function (error) {
                    if (error) {
                        console.log(error);
                    }
                })
            }
        }
    }
}
function mentionToId (c){
    return c.replace("<","").replace(">","").replace("!","").replace("@","").replace("#","")
}
client.login(config.token)