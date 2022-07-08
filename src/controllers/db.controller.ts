import {exec} from "child_process";
import dbConfig from "../dbconfig/db.config";
import fs from 'fs';
import path from 'path';
import moment from "moment";
import {ParamsStatus} from "../models/parameters.model";

interface DBControllerAttributes {
    getFileName(): string;

    get(req: Request, res: Response): Promise<void>;

    backUp(req: Request, res: Response): Promise<void>;

    restore(req: Request, res: Response): Promise<void>;
}


class DBController implements DBControllerAttributes{

    public getFileName(date?:string) {
        let targetDate;
        if (date) {
            targetDate = date;
        } else {
            targetDate = moment().format('YYYY-MM-DD_HH.mm.ss');
        }

        console.log(targetDate);

        const directoryPath = path.join(__dirname, '../../../backups');
        console.log(directoryPath);
        const fileName = `db-backup-${targetDate}.sql`;

        return `${directoryPath}\\${fileName}`;
    }

    public async get(req,res) {
        const directoryPath = path.join(__dirname, '../../../backups');

        fs.readdir(directoryPath, function (err, files) {
            //handling error
            if (err) {
                res.status(500).send({message: 'Unable to scan directory: ' + err});
            }
            res.status(200).send(files);
        });
    }

    public async backUp(req, res) {
        console.log('Backup started');
        const fileName = this.getFileName();
        console.log(fileName);
            exec(
                `pg_dump -U ${dbConfig.USER} --dbname=postgresql://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:5432/${dbConfig.DB} -f ${fileName}`,
            (error, stdout, stderr) => {
                    if (error) {
                        res.status(500).send();
                    } else {
                        setTimeout(() => res.status(200).send('Back up created successfully'), 3000);
                    }
            })
    }

    public async restore(req,res) {
        console.log('restore')
        const date = req.body.date;
        const fileName = this.getFileName(date);

        console.log('Restoring started')
        exec(
            `psql -U ${dbConfig.USER} --dbname=postgresql://${dbConfig.USER}:${dbConfig.PASSWORD}@${dbConfig.HOST}:5432/${dbConfig.DB} < E:\\Study\\3_course\\2_sem\\apz\\labs\\Room-greenery\\backups\\db-backup-2022-07-07_20.00.53.sql`,
            (error, stdout, stderr) => {
                if (error) {
                    res.status(500).send({
                        message: error
                    });
                } else {
                    setTimeout(() => res.status(200).send('Back up restored successfully'), 3000);
                }
            })
    }
}

export {DBController};
