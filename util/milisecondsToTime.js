export default function (time) {
    let values = [
        { pfix: "segundo", div: 1000 },
        { pfix: "minuto", div: 60 },
        { pfix: "hora", div: 60 },
        { pfix: "dia", div: 24 }
    ]
    for (var i = 0; i < values.length && time / values[i].div >= 1; i++) time /= values[i].div

    if (time > 1) values[i - 1].pfix += "s"

    return Math.floor(time*10)/10 + " " + values[i - 1].pfix
}