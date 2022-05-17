export default function (importedTime) {
    if (!importedTime || importedTime.length < 2) return
    let values = [
        { pfix: "s", time: 1000},
        { pfix: "m", time: 60000},
        { pfix: "h", time: 3600000},
        { pfix: "d", time: 86400000}
    ]
    let exportedTime
    for (let i = 0; i < values.length; i++) {
        if (importedTime[importedTime.length - 1] === values[i].pfix) {
            exportedTime = values[i].time
            importedTime = importedTime.substr(0, importedTime.length - 1)
            break
        }
    }
    if (!exportedTime) return
    exportedTime *= importedTime
    return exportedTime
}