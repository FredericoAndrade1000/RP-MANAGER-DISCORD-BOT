import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { Permissions } from "discord.js"

const Discord = require("discord.js")

export default function (server, member){
    let permission = 0
    if (member.roles.cache.some(r => r.id === server.manageRoleID)) {
        permission = 1
    }
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        permission = 2
    }
    return permission
}