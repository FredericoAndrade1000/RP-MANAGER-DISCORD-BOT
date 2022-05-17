import { MessageEmbed } from "discord.js"

export default {
    defaultError: function (message, user) {
        return new MessageEmbed()
            .setColor("ef5250")
            .setDescription(":x: " + message + '\n\n')
            .setTitle("Erro")
            .setAuthor(user.tag, user.avatarURL())
    },
    defaultSuccess: function (message, user) {
        return new MessageEmbed()
            .setColor("1baf22")
            .setDescription(":white_check_mark: " + message + '\n\n')
            .setTitle("Sucesso")
            .setAuthor(user.tag, user.avatarURL())
    },
    permissionError: function (message, user) {
        return new MessageEmbed()
            .setTitle("Erro de permissão")
            .setAuthor(user.tag, user.avatarURL())
            .setDescription(":x: " + message + '\n\n')
            .setColor("ef5250")
    },
    syntaxError: function (user, command) {
        return new MessageEmbed()
            .setTitle("Erro de sintaxe")
            .setAuthor(user.tag, user.avatarURL())
            .setDescription(`Argumento incorreto, faltando ou em demasia.\n use:\n \`${command.use}\`\n\n Descrição: ${command.description}`)
            .setColor("ef5250")
    },
    defaultNote: function (message, user) {
        return new MessageEmbed()
            .setTitle("Nota")
            .setAuthor(user.tag, user.avatarURL())
            .setDescription(":exclamation: " + message + '\n\n')
            .setColor("fcf803")
    },
    systemError: function (message, user) {
        return new MessageEmbed()
            .setColor("ef5250")
            .setDescription(":frowning2: " + message + '\n\n')
            .setTitle("Erro de sistema")
            .setAuthor(user.tag, user.avatarURL())
    }
}