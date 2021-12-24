import * as fs from 'fs';
import * as moment from 'moment';

export const CreateErrorLog = (errorData: any) => {
    console.log("Writing error log");
    if (errorData.response) { // https://stackoverflow.com/questions/49967779/axios-handling-errors
        errorData = {
            type: "HTTP Error",
            data: errorData.response.data,
            status: errorData.response.status,
            headers: errorData.response.headers,
        }
        errorData = JSON.stringify(errorData, null, 3);
    } else if (errorData instanceof Error) {
        errorData = errorData.toString();
    } else {
        errorData = String(errorData);
    }
    let fileName: string = moment().format();
    fileName = fileName.replace(/:\s*/g, ";"); // https://stackoverflow.com/questions/6524982/replacing-a-colon-using-string-replace-using-javascript-and-jquery
    fileName = fileName.replace(" ", "_");
    fs.writeFile(`./error-logs/${fileName}.txt`, errorData, (err: any) => {
        if (err) {
            return console.error(err);
        }
    });
}