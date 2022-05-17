import { createRequire } from "module"
const require = createRequire(import.meta.url)

const servers = require("./servers.json")
const fs = require("fs")

for (let i = 0; i < servers.length; i++) {
    const server = servers[i];
    server["users"] = []
    if (!server.logChannelID) server["logChannelID"] = ""
    for (let j = 0; j < server.agencies.length; j++) {
        const agency = server.agencies[j];
        server.users.push({
            id: agency.userId,
            money: agency.money / 10,
            agency: {
                name: agency.name,
                description: agency.description,
                research: agency.research,
                level: agency.level
            }
        })
    }
    delete server["agencies"]
    delete server["blueprints"]
    delete server["research"]
    delete server["levels"]
    delete server["banks"]
}

fs.writeFile("./servers.json", JSON.stringify(servers), function (error) {
    if (error) console.log(error);
})
