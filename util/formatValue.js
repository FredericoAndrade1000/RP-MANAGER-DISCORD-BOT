export default function (number) {
    let pf = ["mil", "mi", "bi", "tri", "qua"], i = 0
    for (; number / 1000 >= 1; i++, number /= 1000);
    number = parseInt(number * 100) / 100;
    return i ? number + " " + pf[i - 1] : number;
}