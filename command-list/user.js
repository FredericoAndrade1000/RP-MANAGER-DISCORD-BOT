import { createRequire } from "module"
const require = createRequire(import.meta.url)

import callback from "../util/callback.js"
import formatValue from "../util/formatValue.js"
import mentionToId from "../util/mentionToId.js"
import timeToMiliseconds from "../util/timeToMiliseconds.js"
import milisecondsToTime from "../util/milisecondsToTime.js"
import payTax from "../util/payTax.js"
import { MessageEmbed } from "discord.js"

const rpConfig = require("../rpConfig.json")


const agencyLevels = rpConfig.agency.levels
const farmLevels = rpConfig.farm.companyConfig.levels
export default {
    payLaunch: function (server, args, member, command, message) {
        if (args.length != 4 || isNaN(args[1]) || isNaN(args[3]) || args[2].toLowerCase() != "s" && args[2].toLowerCase() != "n") {
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        }
        let agency, user, isReusable = "Não"
        for (let i = 0; i < server.users.length; i++) {
            if (mentionToId(args[0]) == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!agencyLevels[args[3] - 1]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O nível ${args[3]} ainda não foi definido.`, member.user)
                ],
            })
        }
        if (!agency) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O usuário ainda não possui uma agência.`, member.user)
                ],
            })
        }
        if (agency.level < args[3]) {
            message.channel.send({
                embeds: [
                    callback.defaultNote(`O usuário ainda não chegou ao nível ${args[3]}, por isso, será recompensado através de seu nível atual.`, member.user)
                ],
            })
            args[3] = agency.level
        }
        let reward, cost
        if (args[2] == "s") {
            cost = args[1] / 2 * agencyLevels[args[3] - 1].costPerTon
            reward = agencyLevels[args[3] - 1].launch - cost
            isReusable = "Sim"
        } else {
            cost = args[1] * agencyLevels[args[3] - 1].costPerTon
            reward = agencyLevels[args[3] - 1].launch - cost
        }
        let balanceResult = reward >= 0 ? "Recompensa" : "Prejuízo";
        user.money += parseInt(reward)

        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("17b091")
                    .setTitle("Pagamento de Lançamento Aprovado")
                    .setFields(
                        { name: `:arrow_up: Nível: ${args[3]}`, value: `\u200B` },
                        { name: `:oil: Massa: ${args[1]} T`, value: `\u200B`, inline: true },
                        { name: `Reutilizável: ${isReusable}`, value: `\u200B`, inline: true },
                        { name: "Agência: ", value: `${agency.name} (${args[0]})\n\u200B` },
                        { name: `:wrench: Custo do Foguete: `, value: `RP$ ${formatValue(cost)}`, inline: true },
                        { name: `:dollar: ${balanceResult} Total: `, value: `RP$ ${formatValue(reward)}`, inline: true }
                    )
            ],
        })
    },
    payMission: function (server, args, member, command, message) {
        if (args.length != 4 || isNaN(args[1]) || isNaN(args[3]) || args[2].toLowerCase() != "s" && args[2].toLowerCase() != "n") {
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        }
        let agency, user, isReusable = "Não"
        for (let i = 0; i < server.users.length; i++) {
            if (mentionToId(args[0]) == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!agencyLevels[args[3] - 1]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O nível ${args[3]} ainda não foi definido.`, member.user)
                ],
            })
        }
        if (!agency) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O usuário ainda não possui uma agência.`, member.user)
                ],
            })
        }
        if (agency.level < args[3]) {
            message.channel.send({
                embeds: [
                    callback.defaultNote(`O usuário ainda não chegou ao nível ${args[3]}, por isso, será recompensado através de seu nível atual.`, member.user)
                ],
            })
            args[3] = agency.level
        }
        let reward, cost
        if (args[2] == "s") {
            cost = args[1] / 2 * agencyLevels[args[3] - 1].costPerTon
            reward = agencyLevels[args[3] - 1].missions - args[1] / 2 * agencyLevels[args[3] - 1].costPerTon
            isReusable = "Sim"
        } else {
            cost = args[1] * agencyLevels[args[3] - 1].costPerTon
            reward = agencyLevels[args[3] - 1].missions - args[1] * agencyLevels[args[3] - 1].costPerTon
        }

        user.money += parseInt(reward)

        let balanceResult = reward >= 0 ? "Recompensa" : "Prejuízo";
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("17b091")
                    .setTitle("Pagamento de Missão Aprovado")
                    .setFields(
                        { name: `:arrow_up: Nível: ${args[3]}`, value: `\u200B` },
                        { name: `:oil: Massa: ${args[1]} T`, value: `\u200B`, inline: true },
                        { name: `Reutilizável: ${isReusable}`, value: `\u200B`, inline: true },
                        { name: "Agência: ", value: `${agency.name} (${args[0]})\n\u200B` },
                        { name: `:wrench: Custo do Foguete: `, value: `RP$ ${formatValue(cost)}`, inline: true },
                        { name: `:dollar: ${balanceResult} Total: `, value: `RP$ ${formatValue(reward)}`, inline: true }
                    )
            ],
        })
    },
    payCreator: function (server, args, member, command, message) {
        if (args.length != 3 || isNaN(args[1]) || isNaN(args[2])) {
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        }
        let agency, user, reward
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!agencyLevels[args[2] - 1]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O nível ${args[2]} ainda não foi definido.`, member.user)
                ],
            })
        }
        if (!agency) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`O usuário ainda não possui uma agência.`, member.user)
                ],
            })
        }
        reward = args[1] * agencyLevels[args[2] - 1].creator

        user.money += parseInt(reward)

        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("17b091")
                    .setTitle("Pagamento para Criador Aprovado")
                    .setFields(
                        { name: `:arrow_up: Nível: ${args[2]}`, value: `\u200B` },
                        { name: `Número de concluíntes: ${args[1]}`, value: `\u200B` },
                        { name: "Agência: ", value: `${agency.name} (${args[0]})\n\u200B` },
                        { name: ":dollar: Recompensa: ", value: `RP$ ${formatValue(reward)}`, inline: true },
                    )
            ],
        })
    },
    setAgency: function (server, args, member, command, message) {
        let elements = ["", ""]

        for (let i = 0, ii = 0; i < args.length; i++) {
            if (args[i] === "&")
                ii++
            else
                elements[ii] += args[i] + " "
        }
        if (elements[0] === "")
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        if (elements[1] === "") elements[1] = "Sem descrição."
        let agency, user
        for (let i = 0; i < server.users.length; i++)
            if (member.user.id == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }

        if (!user)
            server.users.push({
                id: member.user.id,
                money: 0,
                agency: {
                    name: elements[0],
                    description: elements[1],
                    research: 0,
                    level: 1
                }
            })
        else if (!agency)
            user["agency"] = {
                name: elements[0],
                description: elements[1],
                research: 0,
                level: 1
            }
        else {
            agency.name = elements[0]
            agency.description = elements[1]
        }
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Agência definida com sucesso.`, member.user)
            ],
        })
    },
    showAgency: function (server, args, member, command, message) {
        if (args.length > 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let userId, agency, user
        if (args[0]) userId = mentionToId(args[0])
        else userId = member.user.id

        for (let i = 0; i < server.users.length; i++) {
            if (userId == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }

        if (!agency && args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário tem uma agência registrada ou não existe.`, member.user)
                ],
            })
        } else if (!agency && !args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma agência registrada.`, member.user)
                ],
            })
        }
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor("17b091")
                    .setTitle("Agência: " + agency.name)
                    .setAuthor(member.user.tag, member.user.avatarURL())
                    .setFields(
                        { name: `:arrow_up: Nível: ${agency.level}`, value: `\u200B` },
                        { name: ":notepad_spiral: Descrição: ", value: `${agency.description}`, inline: true },
                        { name: ":dollar: Patrimônio: ", value: `RP$ ${formatValue(user.money)}`, inline: true },
                        { name: ":atom: Pontos de pesquisa: ", value: `${formatValue(agency.research)}/${formatValue(agencyLevels[agency.level - 1].maxResearchPoints)}`, inline: true },
                    )
                    .setTimestamp()
            ],
        })
    },
    transferMoney: function (server, args, member, command, message) {
        if (args.length != 2 || isNaN(args[1]) || args[1] < 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let user1, user2
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                user1 = server.users[i]
                break
            }
        }
        for (let i = 0; i < server.users.length; i++) {
            if (mentionToId(args[0]) == server.users[i].id) {
                user2 = server.users[i]
                break
            }
        }
        if (user1.money < args[1])
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem dinheiro suficiente para fazer esse pagamento.`, member.user)
                ],
            })

        if (!user2)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário ainda não está registrado.`, member.user)
                ],
            })

        if (!user1)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não está registrado.`, member.user)
                ],
            })
        
        let taxCost = rpConfig.economyConfig.transferTax/100 * parseInt(args[1])
        
        if (user1.money - (parseInt(args[1]) + taxCost) < 0)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem dinheiro suficiente para fazer esse pagamento, necessário: RP$ :dollar: ${user1.money + taxCost}.`, member.user)
                ],
            })
    
        user2.money += parseInt(args[1])
        user1.money -= parseInt(args[1]) + taxCost
        payTax(taxCost)
        
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`$RP ${formatValue(args[1])} transferido para ${args[0]} com sucesso. Foi paga uma taxa IOF (imposto sobre operações financeiras) de ${rpConfig.economyConfig.transferTax}% (RP$ :dollar: ${taxCost}).`, member.user)
            ],
        })
    },
    addMoney: function (server, args, member, command, message) {
        if (args.length != 2 || isNaN(args[1]) || args[1] < 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let agency, user
        for (let i = 0; i < server.users.length; i++) {
            if (mentionToId(args[0]) == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!user) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário ainda não está registrado.`, member.user)
                ],
            })
        }
        user.money += parseInt(args[1])

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`$RP ${formatValue(args[1])} adicionado de ${args[0]} com sucesso.`, member.user)
            ],
        })
    },
    removeMoney: function (server, args, member, command, message) {
        if (args.length != 2 || isNaN(args[1]) || args[1] < 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let agency, user
        for (let i = 0; i < server.users.length; i++) {
            if (mentionToId(args[0]) == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!user) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário ainda não está registrado.`, member.user)
                ],
            })
        }
        user.money -= parseInt(args[1])

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`$RP ${formatValue(args[1])} removido de ${args[0]} com sucesso.`, member.user)
            ],
        })
    },
    research: function (server, args, member, command, message) {
        if (args.length != 1 || isNaN(args[0]))
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let agency, user
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                agency = server.users[i].agency
                user = server.users[i]
                break
            }
        }
        if (!agency) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma agência registrada.`, member.user)
                ],
            })
        }
        let research = rpConfig.agency.research
        let cost = research.cost * args[0]
        if (agency.research >= rpConfig.agency.levels[agency.level - 1].maxResearchPoints) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você já tem o máximo de pontos de pesquisa.`, member.user)
                ],
            })
        }
        if (user.money >= cost) {
            user.money -= parseInt(cost)
        } else {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem dinheiro suficiente para fazer esse investimento. Custo: :dollar: RP$ ${formatValue(cost)}`, member.user)
                ],
            })
        }
        let points = 0

        for (let i = 0; i < args[0]; i++) {
            points += parseInt(Math.random() * (research.max - research.min) + research.min)
        }

        server.queuedOps.push({
            time: new Date().getTime() + 86400000,
            userId: member.user.id,
            op: "add-research",
            value: points
        })
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Investimento de :dollar: RP$ ${formatValue(cost)} em :package: ${args[0]} pacote(s) de pesquisa concluído. Espere 24 horas para ver o resultado.`, member.user)
            ],
        })
    },
    upgrade: function (server, args, member, command, message) {
        if (!args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let agency, farm, user, entity
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                agency = server.users[i].agency
                farm = server.users[i].farm
                user = server.users[i]
            }
        }
        args[0] = args[0].toLowerCase()
        if (args[0] === "agência" || args[0] === "agencia") {
            entity = agency
            args[0] = "agência"
        }
        else if (args[0] === "fazenda")
            entity = farm
        else
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Insira uma entidade válida.`, member.user)
                ],
            })

        if (!entity) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma ${args[0]} registrada.`, member.user)
                ],
            })
        }
        if (entity.level >= (args[0] === "fazenda" ? agencyLevels.length : farmLevels.length)) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Sua ${args[0]} já está no nível máximo.`, member.user)
                ],
            })
        }

        let cost

        let researchCost
        if (args[0] === "agência") {
            researchCost = agencyLevels[agency.level].researchPoints
            cost = parseInt(agencyLevels[agency.level].upgradePrice)
        }
        else cost = farmLevels[farm.level].upgradePrice

        if (user.money < cost && researchCost ? entity.research < researchCost : false)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem dinheiro ou pontos de pesquisa suficientes para fazer essa atualização. Necessário :dollar: RP$ ${formatValue(cost)}${researchCost ? ` e :atom: ${researchCost} pontos de pesquisa` : ""}.`, member.user)
                ],
            })

        user.money -= cost
        if (researchCost) entity.research -= parseInt(researchCost)
        entity.level++

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Parabéns! A atualização para nível ${entity.level} por :dollar: RP$ ${formatValue(cost)} ${researchCost ? `e :atom: ${researchCost} pontos de pesquisa` : ""} foi concluída.`, member.user)
            ],
        })
    },
    setFarm: function (server, args, member, command, message) {
        if (args.length < 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let user, farm
        for (let i = 0; i < server.users.length; i++)
            if (member.user.id == server.users[i].id) {
                user = server.users[i]
                farm = server.users[i].farm
                break
            }
        if (!user) {
            server.users.push({
                id: member.user.id,
                money: 600
            })
            user = server.users[server.users.length - 1]
        }
        else {
            user.money += 600
        }
        if (!farm)
            user["farm"] = {
                name: args.join(" "),
                level: 1,
                space: { current: 0, max: 3 },
            }
        else {
            farm.name = args.join(" ")
        }
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`Fazenda definida com sucesso.`, member.user)
            ],
        })
    },
    shop: function (server, args, member, command, message) {
        let user, agency, farm
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                user = server.users[i]
                agency = server.users[i].agency
                farm = server.users[i].farm
            }
        }
        let nextFarmLevel
        let nextAgencyLevel

        if (farm) {
            nextFarmLevel = rpConfig.farm.companyConfig.levels[farm.level]
        }
        if (agency) {
            nextAgencyLevel = rpConfig.agency.levels[agency.level]
        }
        const shop = { default: [] }
        if (agency) {
            shop["default"].push(
                {
                    name: `Agência (\`${server.prefix}loja agência\`)`,
                    description: `Use para ver a loja da agência.`,
                    display: true
                }
            )
            shop["agency"] = [
                {
                    name: `Pesquisar (\`${server.prefix}pesquisar\`)`,
                    description: `Investe em pacotes de pesquisa para sua agência - :dollar: RP$ ${formatValue(rpConfig.agency.research.cost)}`,
                    display: true
                },
                {
                    name: `Acelerador de Pesquisa (\`${server.prefix}comprar acelerador-de-pesquisas\`)`,
                    description: `Acelera suas pesquisas em ${rpConfig.agency.research.accelerator.range} vezes - :dollar: RP$ ${formatValue(rpConfig.agency.research.accelerator.cost)}`,
                    display: true
                },
            ]
            if (agency.level < rpConfig.agency.levels.length) {
                shop.agency.push(
                    {
                        name: `Atualizar (\`${server.prefix}atualizar agência\`)`,
                        description: `Atualiza sua agência para o nível ${agency.level + 1} - :dollar: RP$ ${nextAgencyLevel != undefined ? formatValue(nextAgencyLevel.upgradePrice) : undefined} e :atom: ${formatValue(nextAgencyLevel.researchPoints)}`,
                        display: agency.level < rpConfig.agency.levels.length ? true : false
                    }
                )
            }
        }
        if (farm) {
            shop["default"].push(
                {
                    name: `Fazenda (\`${server.prefix}loja fazenda\`)`,
                    description: `Use para ver a loja da fazenda.`,
                    display: true
                }
            )
            shop["farm"] = [
                {
                    name: `Atualizar (\`${server.prefix}atualizar fazenda\`)`,
                    description: `Atualiza sua fazenda para o nível ${farm.level + 1} - :dollar: RP$ ${nextFarmLevel != undefined ? formatValue(nextFarmLevel.upgradePrice) : undefined}`,
                    display: farm.level < rpConfig.farm.companyConfig.levels.length ? true : false
                },
                {
                    name: `Espaço (\`${server.prefix}comprar espaço\`)`,
                    description: `Compra mais espaço para sua fazenda - :dollar: RP$ ${formatValue(rpConfig.farm.companyConfig.levels[farm.level - 1].spaceCost)}`,
                    display: farm.space.max < rpConfig.farm.companyConfig.levels[farm.level - 1].maxSpace ? true : false
                },
            ]
            rpConfig.farm.plants.forEach(element => {
                shop.farm.push({
                    name: element.name + ` (\`${server.prefix}comprar ${element.name.toLowerCase()}\`)`,
                    description: `Semente pronta para ser plantada - Pode ser colhida em ${milisecondsToTime(timeToMiliseconds(element.timeNeeded))} - :dollar: ${formatValue(element.cost)}`,
                    display: true
                })
            })

        }
        if (!farm)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                ],
            })
        if (args[0] === "fazenda") {
            const embed = new MessageEmbed()
                .setTitle("Loja da Fazenda")
            for (let i = 0; i < shop.farm.length; i++) {
                const item = shop.farm[i];
                if (item.display)
                    embed.addFields({ name: `${item.name}`, value: `${item.description}` })
            }
            return message.channel.send({
                embeds: [embed],
            })
        }
        else if (args[0] === "agência" || args[0] === "agencia") {
            const embed = new MessageEmbed()
                .setTitle("Loja da Agência")
            for (let i = 0; i < shop.agency.length; i++) {
                const item = shop.agency[i];
                if (item.display)
                    embed.addFields({ name: `${item.name}`, value: `${item.description}` })
            }
            return message.channel.send({
                embeds: [embed],
            })
        }
        else {
            const embed = new MessageEmbed()
                .setTitle("Loja")
            for (let i = 0; i < shop.default.length; i++) {
                const item = shop.default[i];
                if (item.display)
                    embed.addFields({ name: `${item.name}`, value: `${item.description}` })
            }
            return message.channel.send({
                embeds: [embed],
            })
        }
    },
    buy: function (server, args, member, command, message) {
        let user, agency, farm
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                user = server.users[i]
                agency = server.users[i].agency
                farm = server.users[i].farm
            }
        }
        if (!args[1]) args[1] = 1
        if (args.length < 1 || args.length > 2 || isNaN(args[1]) || args[1] < 1 || !args[0]) {
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        }
        args[0] = args[0].toLowerCase()
        if (!args[1]) args[1] = 1

        if (args[0] === "acelerador-de-pesquisas") {
            if (!agency) {
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você ainda não tem uma agência registrada.`, member.user)
                    ],
                })
            }
            let cost = rpConfig.agency.research.accelerator.cost * args[1]
            let accelerator = rpConfig.agency.research.accelerator

            if (user.money < cost)
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você não tem dinheiro suficiente para fazer essa compra. Custo: :dollar: RP$ ${formatValue(cost)}`, member.user)
                    ],
                })
            user.money -= cost

            for (let i = 0; i < server.queuedOps.length; i++) {
                let operation = server.queuedOps[i]
                if (member.user.id === operation.userId) {
                    let time = new Date().getTime() - operation.time
                    time /= accelerator.range
                    operation.time = time + new Date().getTime()
                }
            }
            return message.channel.send({
                embeds: [
                    callback.defaultSuccess(`Suas pesquisas foram aceleradas em ${accelerator.range} por :dollar: RP$ ${formatValue(cost)}`, member.user)
                ],
            })
        }
        if (args[0] === "espaço") {
            if (!farm) {
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                    ],
                })
            }
            let farmLevel = rpConfig.farm.companyConfig.levels[farm.level - 1]
            let cost = farmLevel.spaceCost * args[1]

            if (user.money < cost)
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você não tem dinheiro suficiente para fazer essa compra. Custo: :dollar: RP$ ${formatValue(cost)}`, member.user)
                    ],
                })
            if (farm.space > farmLevel.maxSpace) {
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você já tem o máximo de espaço para seu nível de fazenda.`, member.user)
                    ],
                })
            }
            if (farm.space + args[1] > farmLevel.maxSpace) {
                return message.channel.send({
                    embeds: [
                        callback.defaultError(`Você não pode comprar essa quantidade de espaço, pois passaria do máximo do seu nível de fazenda.`, member.user)
                    ],
                })
            }
            user.money -= cost

            farm.space.max += parseInt(args[1])
            return message.channel.send({
                embeds: [
                    callback.defaultSuccess(`Você comprou :placard: ${args[1]} m² por :dollar: RP$ ${formatValue(cost)}`, member.user)
                ],
            })
        }
        if (!farm)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                ],
            })
        let plant, cost
        for (let i = 0; i < rpConfig.farm.plants.length; i++) {
            const _plant = rpConfig.farm.plants[i]
            if (_plant.name.toLowerCase() === args[0]) {
                plant = rpConfig.farm.plants[i]
                cost = plant.cost * args[1]
            }
        }
        if (!cost)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não foi possível encontrar esse item na loja.`, member.user)
                ],
            })

        let earn = parseInt(Math.random() * (plant.maxEarn - plant.minEarn) + plant.minEarn)
        if (user.money < cost)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem dinheiro suficiente para fazer essa compra. Custo: :dollar: RP$ ${formatValue(cost)}`, member.user)
                ],
            })

        if (plant.levelNeeded > farm.level)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Sua fazenda precisa estar no nível ${plant.levelNeeded} para comprar essa semente.`, member.user)
                ],
            })

        if (farm.space.max - farm.space.current < plant.spaceNeeded * args[1])
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você não tem espaço suficiente para plantar ${args[1] > 1 ? "essas sementes" : "essa semente"}. Necessário: :placard: ${formatValue(plant.spaceNeeded) * args[1]} m²`, member.user)
                ],
            })

        farm.space.current += plant.spaceNeeded * args[1]
        user.money -= cost

        if (!farm.plants) farm["plants"] = []

        for (let i = 0; i < args[1]; i++)
            farm["plants"].push({
                name: plant.name,
                ready: false,
                timeToHarvest: timeToMiliseconds(plant.timeNeeded) + new Date().getTime(),
                space: plant.spaceNeeded,
                earn: earn,
                status: "Crescendo"
            })

        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`${args[1] > 1 ? `${args[1]} sementes ` : "Semente"} de ${plant.name} ${args[1] > 1 ? `plantadas ` : "plantada"} com sucesso por :dollar: RP$ ${formatValue(cost)}.`, member.user)
            ],
        })
    },
    showFarm: function (server, args, member, command, message) {
        if (args.length > 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let userId, farm, user
        if (args[0]) userId = mentionToId(args[0])
        else userId = member.user.id

        for (let i = 0; i < server.users.length; i++) {
            if (userId == server.users[i].id) {
                farm = server.users[i].farm
                user = server.users[i]
                break
            }
        }

        if (!farm && args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário tem uma fazenda registrada ou não existe.`, member.user)
                ],
            })
        } else if (!farm && !args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                ],
            })
        }
        let embed = new MessageEmbed()
            .setColor("17b091")
            .setTitle("Fazenda: " + farm.name)
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setTimestamp()
            .setFields(
                { name: `:arrow_up: Nível: ${farm.level}`, value: `\u200B` },
                { name: ":dollar: Patrimônio: ", value: `RP$ ${formatValue(user.money)}`, inline: true },
                { name: `:placard: Espaço:`, value: `${farm.space.current}/${farm.space.max} m²`, inline: true },
                { name: `Dono:`, value: `<@!${user.id}>` },
            )
        return message.channel.send({
            embeds: [embed],
        })
    },
    showPlants: function (server, args, member, command, message) {
        if (args.length > 1)
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })

        let userId, farm, user
        if (args[0]) userId = mentionToId(args[0])
        else userId = member.user.id

        for (let i = 0; i < server.users.length; i++) {
            if (userId == server.users[i].id) {
                farm = server.users[i].farm
                user = server.users[i]
                break
            }
        }

        if (!farm && args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Esse usuário tem uma fazenda registrada ou não existe.`, member.user)
                ],
            })
        } else if (!farm && !args[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                ],
            })
        }
        if (!farm.plants || !farm.plants[0]) {
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem plantas em sua fazenda.`, member.user)
                ],
            })
        }
        let embed = new MessageEmbed()
            .setColor("17b091")
            .setTitle("Plantas:")
            .setAuthor(member.user.tag, member.user.avatarURL())

        /*let farmPlants = []
        farm.plants.forEach(plant => {
            farmPlants.push(
                {
                    name: plant.name,
                    description:
                        `:level_slider: Estado: ${plant.status}\n` +
                            `:placard: Espaço ocupado: ${plant.space} m²\n` +
                            plant.timeToHarvest - new Date().getTime() > 0
                            ? `:watch: Tempo restante para colheita: ${milisecondsToTime(plant.timeToHarvest - new Date().getTime())}`
                            : ""
                    ,
                    quantity: 1
                }
            )
        })

        for (let i = 0; i < farmPlants.length; i++) {
            const plant = farmPlants[i];
            embed.addFields(
                {
                    name: `${i + 1} - ${plant.name} ${plant.quantity > 1 ? `(x${plant.quantity})` : ""}`,
                    value: plant.description
                },
            )
        }*/

        for (let i = 0; i < farm.plants.length; i++) {
            const plant = farm.plants[i]
            embed.addFields(
                {
                    name: `${i + 1} - ${plant.name}`, value: `
                ${plant.timeToHarvest - new Date().getTime() > 0
                            ? `:watch: Tempo restante para colheita: ${milisecondsToTime(plant.timeToHarvest - new Date().getTime())}`
                            : ""
                        }
                :placard: Espaço ocupado: ${plant.space} m²
                :level_slider: Estado: ${plant.status}
                ` },
            )
        }

        return message.channel.send({
            embeds: [embed],
        })
    },
    harvest: function (server, args, member, command, message) {
        if (args[0])
            return message.channel.send({
                embeds: [
                    callback.syntaxError(member.user, command)
                ],
            })
        let user, farm
        for (let i = 0; i < server.users.length; i++) {
            if (member.user.id == server.users[i].id) {
                farm = server.users[i].farm
                user = server.users[i]
                break
            }
        }

        if (!farm)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Você ainda não tem uma fazenda registrada.`, member.user)
                ],
            })
        
        if (!farm.plants)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não há plantas em sua fazenda.`, member.user)
                ],
            })
        
        let earn = 0, index = 0
        for (let i = 0; i < farm.plants.length; i++) {
            const plant = farm.plants[i]
            if (plant.ready) {
                earn += plant.earn
                index++
                farm.plants.splice(i, 1)
                farm.space.current -= plant.space
                i--
            }
        }

        if (index < 1)
            return message.channel.send({
                embeds: [
                    callback.defaultError(`Não há plantas para serem colhidas em sua fazenda.`, member.user)
                ],
            })
        user.money += earn
        return message.channel.send({
            embeds: [
                callback.defaultSuccess(`${index} ${index === 1 ? "planta colhida" : "plantas colhidas"}. Ganho: :dollar: R$ ${formatValue(earn)}.`, member.user)
            ],
        })
    },
    sow: function (server, args, member, command, message) {

    }
}