import * as fs from 'fs';
import * as moment from 'moment';

export const CreateErrorLog = (errorData: any) => {
    fs.writeFile(`../error-logs/${moment().format()}`, errorData, (err: any) => {
        if (err) {
            return console.error(err);
        }
    });
}