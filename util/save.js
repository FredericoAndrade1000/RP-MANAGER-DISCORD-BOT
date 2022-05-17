import { createRequire } from "module"
const require = createRequire(import.meta.url)

const fs = require("fs")

export default function (servers) {
    fs.writeFile("servers.json", JSON.stringify(servers), function (error) {
        if (error) console.log(error);
    })
}