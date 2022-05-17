export default function (config, time) {
    if (!time) time = new Date();

    if (!config) {
        config = {
            totalMilliseconds: true,
            day: true,
            month: true,
            year: true,
            hour: true,
            minute: true,
        }
    }

    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return {
        totalMilliseconds: config.totalMilliseconds ? time.getTime() : undefined,
        day: config.day ? time.getDate() : undefined,
        month: config.month ? months[time.getMonth()] : undefined,
        year: config.year ? time.getFullYear() : undefined,
        hour: config.hour ? time.getHours() : undefined,
        minute: config.minute ? time.getMinutes() : undefined,
        formatedHour: config.formatedHour ?
            (() => {
                let hour = time.getHours().toString(), minute = time.getMinutes().toString();
                if (hour.length < 2) {
                    hour = "0" + hour;
                }
                if (minute.length < 2) {
                    minute = "0" + minute;
                }
                return `${hour}:${minute}`;
            })() : undefined,

        formatedDate: config.formatedDate ?
            (() => {
                let day = time.getDate().toString(), month = (time.getMonth() + 1).toString();
                if (day.length < 2) {
                    day = "0" + day;
                }
                if (month.length < 2) {
                    month = "0" + month;
                }
                return `${day}/${month}/${time.getFullYear()}`;
            })() : undefined
    }
}