import { createRequire } from "module"
const require = createRequire(import.meta.url)

const rpConfig = require("../rpConfig.json")
const servers = require("../servers.json")
import formatValue from "./formatValue.js"
import getDate from "./getDate.js"
import save from "./save.js"

export default function (client) {
    for (let i = 0; i < servers.length; i++) {
        let server = servers[i]
        for (let j = 0; j < server.queuedOps.length; j++) {
            let operation = server.queuedOps[j]
            let date = getDate({formatedHour: true, formatedDate: true, totalMilliseconds: true})

            if (operation.time > date.totalMilliseconds) break
            if (operation.op == "add-research") {
                let agency, user
                for (let i = 0; i < server.users.length; i++) {
                    if (operation.userId == server.users[i].id) {
                        agency = server.users[i].agency
                        user = server.users[i]
                        break
                    }
                }

                let state
                agency.research + operation.value <= rpConfig.agency.levels[agency.level - 1].maxResearchPoints
                    ? state = `Pesquisa concluída, você conseguiu :atom: ${formatValue(operation.value)} ponto(s) de pesquisa.`
                    : state = "Pesquisa concluída, você agora tem a quantidade máxima de pontos de pesquisa."

                state += ` ${date.formatedHour} - ${date.formatedDate}.`

                if (agency.research + operation.value <= rpConfig.agency.levels[agency.level - 1].maxResearchPoints) 
                    agency.research += operation.value
                else 
                    agency.research = rpConfig.agency.levels[agency.level - 1].maxResearchPoints

                try {
                    client.channels.cache.get(server.logChannelID).send({content: `<@!${user.id}>\n${state}`})
                } catch (error) {
                }
                server.queuedOps.splice(j, 1)

            }
        }
    }
    save(servers)
}