import * as moment from 'moment';

export const currentDate = () => {
    return moment(new Date()).format('YYYY-MM-DD');
}
