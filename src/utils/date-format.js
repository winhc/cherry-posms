import * as moment from 'moment';

export const currentDate = () => {
    return moment(new Date()).format('YYYY-MM-DD');
}

export const formatYearMonthDay = (date) => {
    return moment(new Date(date)).format('YYYY-MM-DD');
}

export const formatMonthDay = (date) => {
    return moment(new Date(date)).format('MMM DD');
}
