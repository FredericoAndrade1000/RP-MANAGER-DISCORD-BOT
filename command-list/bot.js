import { MessageButton, MessageEmbed, MessageActionRow } from "discord.js"

export default {
    help: function (server, args, member, command, message) {
        let embed = new MessageEmbed()
            .setColor("1baf22")
            .setDescription(`Vá a nosso site para ver a lista de comandos.\n\nNível ${server.permission}/5 de permissão de servidor.`)
            .setTitle("Ajuda")
            .setAuthor(member.user.tag, member.user.avatarURL())
            .setFooter("Desenvolvido por Frederico Andrade")

        let row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel("Ver Comandos")
                .setURL("https://rp-manager.ml/comandos/")
                .setStyle("LINK")
        )

        return message.channel.send({embeds:[embed], components:[row]})
        
    }
}