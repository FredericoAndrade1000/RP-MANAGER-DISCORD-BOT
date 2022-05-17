import { createRequire } from "module"
const require = createRequire(import.meta.url)

const servers = require("../servers.json")

export default function (client) {
    for (let i = 0; i < servers.length; i++) {
        const server = servers[i]
        for (let j = 0; j < server.users.length; j++) {
            const user = server.users[j]
            if (!user.farm || !user.farm.plants) continue
            for (let c = 0; c < user.farm.plants.length; c++) {
                const plant = user.farm.plants[c]
                if (plant.timeToHarvest < new Date().getTime() && !plant.ready) {
                    try {
                        client.channels.cache.get(server.logChannelID).send({ content: `<@!${user.id}>\nUma de suas plantas (${plant.name}) está pronta para ser colhida.` })
                    } catch (error) { console.log(error) }
                    plant.ready = true
                    plant.status = "Pronta para ser colhida"
                }
            }
        }
    }
}