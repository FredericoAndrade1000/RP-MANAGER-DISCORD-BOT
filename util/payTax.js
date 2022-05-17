import { createRequire } from "module"
const require = createRequire(import.meta.url)

const servers = require("../servers.json")

export default function (amount){
    for (let i = 0; i < servers.length; i++) {
        const server = servers[i];
        if (server.id === "470962283627937792"){
            for (let j = 0; j < server.users.length; j++) {
                const user = server.users[j];
                if (user.id === "470960699863072768"){
                    user.money += amount
                }
            }
        }
    }
}