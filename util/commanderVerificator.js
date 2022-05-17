import commands from "./commands.js";
import callback from "./callback.js";
import hasPermission from "./hasPermission.js";

export default function(command, server, args, member, message, client){
    try {
        for (let i = 0; i < commands.length; i++){
            for (let j = 0; j < commands[i].syntax.length; j++){
                if (command === commands[i].syntax[j]){
                    if (hasPermission(server, member) < commands[i].userLevelPermission){
                        return message.channel.send({
                            embeds: [
                                callback.defaultError(`Você não tem permissão para usar esse comando.`, member.user)
                            ],
                        })
                    }
                    return commands[i].execute(server, args, member, commands[i], message, client)
                }
            }
        }
    } catch (error) {
        console.log(error)
        return message.channel.send({
            embeds: [
                callback.systemError(`Algo de muito errado aconteceu! Chame o Frederico Andrade para ver se ele pode ajudar.`, member.user)
            ],
        })
    }
}