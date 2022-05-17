import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { MessageEmbed } from "discord.js"
import callback from "../util/callback.js"
import formatValue from "../util/formatValue.js"
import mentionToId from "../util/mentionToId.js"
const servers = require("../servers.json")
const rpConfig = require("../rpConfig.json")

export default {
    setPrefix: function (server, args, member, command, message) {
        if (!args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        server.prefix = args[0]
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`O prefixo foi definido para ${args[0]} com sucesso.`, member.user)
            ],
        })
    },
    setManagerRole: function (server, args, member, command, message) {
        if (!args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let role = message.guild.roles.cache.find(role => role.id === mentionToId(args[0]))

        if (!role)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O cargo não pôde ser encontrado.`, member.user)
                ],
            })
        server.manageRoleID = mentionToId(args[0])
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`O cargo de gerenciador foi definido para ${role} com sucesso.`, member.user)
            ],
        })
    },
    setMissionsChannel: function (server, args, member, command, message) {
        if (!args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let channel = message.guild.channels.cache.find(channel => channel.id === mentionToId(args[0]))
        if (!channel)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O canal não pôde ser encontrado.`, member.user)
                ],
            })
        server.missionChannelId = mentionToId(args[0])
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`O canal de missões foi definido para ${args[0]} com sucesso.`, member.user)
            ],
        })
    },
    setLogsChannel: function (server, args, member, command, message) {
        if (!args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let channel = message.guild.channels.cache.find(channel => channel.id === mentionToId(args[0]))
        if (!channel)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O canal não pôde ser encontrado.`, member.user)
                ],
            })
        server.logChannelId = mentionToId(args[0])
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`O canal de registros foi definido para ${args[0]} com sucesso.`, member.user)
            ],
        })
    },
    addMission: function (server, args, member, command, message) {
        let elements = ["", "", "", "", "", "", ""]
        for (let i = 0, ii = 0, iii = 0; i < args.length; i++) {
            if (args[i] == "&") {
                elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
                ii++
            } else {
                elements[ii] += args[i] + " "
            }
            iii++
            if (iii == args.length) {
                elements[ii] = elements[ii].substring(0, elements[ii].length - 1)
            }
        }
        if (elements[0] == "" || elements[1] == "" || elements[2] == "" || isNaN(elements[3]) || elements[4] == "" || elements[6] == "")
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        if (!rpConfig.agency.levels[(elements[3] - 1)])
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse nível não existe.`, member.user)
                ],
            })

        if (elements[5] == "") elements[5] = "Cheats e Bugs."
        if (elements[4] == "") elements[4] = "Sem observações."

        if (server.missions) {
            server.missions.push({
                title: elements[0],
                description: elements[1],
                objective: elements[2],
                level: parseInt(elements[3]),
                notes: elements[4],
                prohibitions: elements[5],
                date: elements[6],
                author: member.user.tag
            })
        }
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Missão cadastrada com sucesso.`, member.user)
            ],
        })
    },
    showMissions: function (server, args, member, command, message) {
        if (args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        if (server.missions.length == 0)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não há missões cadastradas.`, member.user)
                ],
            })

        let embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setColor("#17b091")

        for (let i = 0; i < server.missions.length; i++) {
            let str = `Título: ${server.missions[i].title}\n\n Descrição: ${server.missions[i].description}\n\n Objetivo: ${server.missions[i].objective}\n\n Agência Mínima: Nível ${server.missions[i].level}\n\n Recompensa estimada: :dollar: RP$ ${rpConfig.agency.levels[server.missions[i].level - 1].missions - 500 * rpConfig.agency.levels[server.missions[i].level - 1].costPerTon}\n\n Nota: ${server.missions[i].notes}\n\n Proibido: ${server.missions[i].prohibitions}\n\n Prazo de entrega: ${server.missions[i].date}\n\n Criador: ${server.missions[i].author}\n\n`
            embed.addFields({ name: `Missão ${i + 1}`, value: str })

            if (i + 1 != server.missions.length)
                embed.addFields({ name: `\u200B`, value: `\u200B` })
        }
        return message.channel.send({
            embeds: [
                embed
            ],
        })
    },
    removeMission: function (server, args, member, command, message) {
        if (isNaN(args[0]) || args[1])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        if (!server.missions[(args[0] - 1)])
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Essa missão não existe.`, member.user)
                ],
            })

        server.missions.splice(args[0] - 1, 1)

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Missão apagada com sucesso`, member.user)
            ],
        })
    },
    postMission: function (server, args, member, command, message, client) {
        if (!args[0] || args[1])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        if (!server.missionChannelID || server.missionChannelID == "")
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O canal de postagem de missões ainda não foi definido, use \`${cmds.list[11].syntax}\` para definí-lo.`, member.user)
                ],
            })

        if (!server.missions[args[0] - 1])
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Essa missão não existe.`, member.user)
                ],
            })

        let mission = server.missions[args[0] - 1]

        try {
            client.channels.cache.get(server.missionChannelID).send({
                embeds: [
                    new MessageEmbed()
                        .setColor("17b091")
                        .setTitle("Missão: " + mission.title)
                        .setFields(
                            { name: ":beginner: História: ", value: `${mission.description}\n\u200B` },
                            { name: ":blue_book: Objetivo: ", value: `${mission.objective}\n\u200B` },
                            { name: ":gear: Agência Mínima: ", value: `Nível ${mission.level}\n\u200B` },
                            { name: ":dollar: Recompensa estimada: ", value: `RP$ ${rpConfig.agency.levels[mission.level - 1].missions - 500 * rpConfig.agency.levels[mission.level - 1].costPerTon}\n\u200B` },
                            { name: ":page_with_curl: Notas: ", value: `${mission.notes}\n\u200B` },
                            { name: ":no_entry_sign: Proibido: ", value: `${mission.prohibitions}\n\u200B` },
                            { name: ":watch: Prazo de entrega: ", value: `${mission.date}\n\u200B` },
                            { name: ":man_guard: Criador: ", value: `${mission.author}` }
                        )
                        .setTimestamp()
                ]
            })
        } catch (error) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O canal de postagem de missões não pôde ser encontrado, verifique se ele está definido corretamente.`, member.user)
                ],
            })
        }

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Missão postada com sucesso.`, member.user)
            ],
        })
    },
    showLevels: function (server, args, member, command, message) {
        if (args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let embed = new MessageEmbed()
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setColor("#17b091")
            .setFields(
                { name: "Níveis", value: `Os níveis definirão limites, custo e recompensa para cada agência. Ao atualizar, você pode liberar novos recursos que te auxiliarão em sua aventura.` }
            )

        for (let i = 0; i < rpConfig.agency.levels.length;) {
            let level = rpConfig.agency.levels[i]
            embed.addFields(
                { name: ":arrow_up: Nível: " + (i + 1), value: `\u200B` },
                { name: "Descrição: ", value: `${level.description}` },
                { name: "Remuneração: ", value: `(Ganhos brutos para cada área).` },
                { name: `Lançamento`, value: `:dollar: RP$ ${formatValue(level.launch)}`, inline: true },
                { name: `Missão`, value: `:dollar: RP$ ${formatValue(level.missions)}`, inline: true },
                { name: `Criador`, value: `:dollar: RP$ ${formatValue(level.creator)}`, inline: true },
                { name: `Custo de atualização:`, value: `:dollar: RP$ ${formatValue(level.upgradePrice)}\n :atom: ${formatValue(level.researchPoints)} pontos de pesquisa.\n\u200B`, inline: true }
            )
            i++
        }
        return message.channel.send({
            embeds: [
                embed
            ],
        })
    },
    top: function (server, args, member, command, message) {
        if (args[3])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let index = args[0]
        if (!index) index = 1
        if (!args[1]) args[1] = "usuários"
        if (!args[2]) args[2] = "dinheiro"
        else args[2] = args[2].toLowerCase()

        if (index <= 0 || isNaN(index))
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Insira uma página válida.`, member.user)
                ],
            })

        let list
        if (args[1] === "usuários" || args[1] === "usuarios") {
            list = server.users.map((user) => ({
                id: user.id,
                money: user.money
            }))
        }
        else if (args[1] === "agências" || args[1] === "agencias") {
            let agencies = []
            for (let i = 0; i < server.users.length; i++) {
                let user = server.users[i]
                if (user.agency) agencies.push({ id: user.id, name: user.agency.name, money: user.money, level: user.agency.level, research: user.agency.research })
            }
            list = agencies
        }
        else if (args[1] === "fazendas") {
            let farms = []
            for (let i = 0; i < server.users.length; i++) {
                let user = server.users[i]
                if (user.farm) farms.push({ id: user.id, name: user.farm.name, money: user.money, level: user.farm.level, space: user.farm.space.max })
            }
            list = farms
        } else
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não foi possível encontrar nenhuma entidade para esse atributo.`, member.user)
                ],
            })


        if (list.length < (args[0] - 1) * 10 + 1)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não há ${args[1]} para essa página.`, member.user)
                ],
            })

        let pfix
        if (args[2] === "dinheiro") {
            list = list.sort((a1, a2) => a1.money < a2.money ? 1 : -1)
            pfix = ":dollar: RP$"
        }
        else if (args[2] === "nível" || args[1] === "nivel") {
            list = list.sort((a1, a2) => a1.level < a2.level ? 1 : -1)
            pfix = ":arrow_up: Nível"
        }
        else if (args[2] === "pesquisa") {
            list = list.sort((a1, a2) => a1.research < a2.research ? 1 : -1)
            pfix = ":atom:"
        }
        else if (args[2] === "espaço" || args[2] === "espaco") {
            list = list.sort((a1, a2) => a1.space < a2.space ? 1 : -1)
            pfix = ":placard:"
        } else {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Insira um atributo válido.`, member.user)
                ],
            })
        }

        let str = ""
        for (let i = 0; i < 10; i++) {
            let entity = list[i + ((index - 1) * 10)]
            if (!entity) break

            let attribute
            if (args[2] === "dinheiro") attribute = entity.money
            else if (args[2] === "nível" || args[1] === "nivel") attribute = entity.level
            else if (args[2] === "pesquisa") attribute = entity.research
            else if (args[2] === "espaço" || args[2] === "espaco") attribute = entity.space

            if (isNaN(attribute))
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Não foi possível criar uma lista usando ${args[1]} com o atributo ${args[2]}.`, member.user)
                    ],
                })

            str += `${i + ((index - 1) * 10) + 1}- ${entity.name
                ? `${entity.name} (<@!${entity.id}>)`
                : `<@!${entity.id}>`}  - ${pfix} ${formatValue(attribute)}\n`
        }

        let page = `${index}/${Math.ceil(list.length / 10)}`
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("17b091")
                    .setDescription(str)
                    .setTitle(`Ranking de ${args[1]} por ${args[2]}`)
                    .setFooter(page)
            ],
        })
    },
    create: function (guild) {
        servers.push({
            id: guild.id,
            locale: guild.preferredLocale,
            permission: 1,
            prefix: "=",
            missionChannelID: "",
            manutentionRoleID: "",
            missions: [],
            users: [],
            queuedOps: []
        })
    }
}