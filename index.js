import { createRequire } from "module"
const require = createRequire(import.meta.url)

import guildCommands from "./command-list/guild.js"
import commanderVerificator from "./util/commanderVerificator.js"
import scheduleOperations from "./util/scheduleOperations.js"
import save from "./util/save.js"
import plantsLogic from "./util/plantsLogic.js"
try {
const Discord = require("discord.js"),
    client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] }),
    config = require("./config.json"),
    fs = require("fs")

const servers = require("./servers.json")
client.on("ready", function () {
    console.log("Bot funcionando!")
    client.user.setActivity(`=help`)
    setInterval(function () { scheduleOperations(client) }, 10000)
    setInterval(function () { plantsLogic(client) }, 10000)
    setInterval(function () { backup() }, 1200000)
    setInterval(function () { backup2() }, 21600000)
})

client.on("guildCreate", function (guild) {
    for (let i = 0; i < servers.length; i++) {
        if (guild.id == servers[i].id) {
            return
        }
        else {
            guildCommands.create(guild)
            save(servers)
        }
    }
})

    client.on("messageCreate", async function (message) {
        if (message.author.bot) return
        let server
        for (let i = 0; i < servers.length; i++)
            if (message.guild.id == servers[i].id) {
                server = servers[i]
                break
            }

        if (!server) {
            guildCommands.create(message.guild)
            server = servers[servers.length - 1]
            save(servers)
        }
        if (server.permission < 1) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor("ef5250")
                .setDescription(`:frowning2: Esse servidor foi banido.`)
            return message.channel.send({ embeds: [embed] })
        }
        if (!message.content.includes("@here") && !message.content.includes("@everyone") && message.mentions.has(client.user.id)) {
            let embed = new Discord.MessageEmbed()
                .setAuthor(message.member.user.tag, message.member.user.avatarURL())
                .setColor("17b091")
                .setDescription(`Meu prefixo é \`${server.prefix}\`\n\n Use \`ajuda\` para ver os comandos disponíveis.`)
            return message.channel.send({ embeds: [embed] })
        }
        if (!message.content.startsWith(server.prefix)) return

        let a = message.content.slice(1).trim().split(" ")
        let c = a.shift()
        c = c.toLowerCase()

        for (let i = 0; i < a.length; i++) {
            if (a[i] === "") a.splice(i, 1)
            a[i].trim()
        }
        try {
            commanderVerificator(c, server, a, message.member, message, client)
        } catch (error) {
            console.log(error)
        }

        save(servers)
        return
    }
    )

function backup() {
    fs.writeFile("backup.json", JSON.stringify(servers), function (error) {
        if (error) console.log(error);
    })
}
function backup2() {
    fs.writeFile("backup2.json", JSON.stringify(servers), function (error) {
        if (error) console.log(error);
    })
}
client.login(config.token)

} catch (error) {
    console.log(error)
}