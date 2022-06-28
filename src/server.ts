import express from 'express';
import {execute} from "@getvim/execute";
import bodyParser from 'body-parser';
import organizationsRouter from './routers/organization.router';
import {sequelize} from './models';
import JWTAuthRouter from "./routers/JWTAuth.router";
import userRouter from './routers/user.routes';
import deviceRouter from './routers/device.router';
import paramsRouter from './routers/parameters.routers';
import plantRouter from './routers/plant.router';
import roleRouter from './routers/role.router';
import speciesRouter from './routers/species.router';
import statisticsRouter from './routers/history.router'
import dbConfig from "./dbconfig/db.config";
import compress from 'gzipme';
import fs from 'fs';
import cron from 'node-cron';
import {AddHistoryTime} from "./history";

class Server {
    private app;
    date = new Date();
    currentDate = `${this.date.getFullYear()}.${this.date.getMonth() + 1}.${this.date.getDate()}.${this.date.getHours()}.${this.date.getMinutes()}`;
    fileName = `database-backup-${this.currentDate}.tar`;
    fileNameGzip = `${this.fileName}.tar.gz`;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json()); // 100kb default
    }

    private dbConnect() {
        sequelize.sync()
            .then(() => {
                console.log("db synchronized");
            })
            .then(() => this.schedulesInit())
            .catch((error) => {
                console.log(error);
                throw "error";
            });
        sequelize.authenticate()
            .then(() => console.log("connected to db"))
            .catch((error) => {
                console.log(error);
                throw "error";
            });
    }

    private dbBackup() {
        execute(
            `pg_dump -U ${dbConfig.USER} -d ${dbConfig.DB} -f ${this.fileName} -F t`,
        ).then(async () => {
            await compress(this.fileName);
            fs.unlinkSync(this.fileName);
            console.log("Finito");
        }).catch(err => {
            console.log(err);
        })
    }

    private schedulesInit() {
        this.historyInsert();
    }

    private dbRestore() {
        execute(`pg_restore -cC -d ${dbConfig.DB} ${this.fileNameGzip}`)
            .then(async () => {
                console.log("Restored");
            }).catch(err => {
            console.log(err);
        })
    }

    private startSchedule() {
        cron.schedule('* * * * *', () => {
            this.dbBackup();
        }, {});
    }

    private historyInsert() {
        cron.schedule('0 * * * *', () => {
            AddHistoryTime();
        }, {});
    }

    private routerConfig() {
        this.app.use((req, res, next) => {
            res.header(
                "Access-Control-Allow-Headers",
                "x-access-token, Origin, Content-Type, Accept"
            );
            next();
        });
        this.app.use('/api/organizations', organizationsRouter);
        this.app.use('/api/auth', JWTAuthRouter);
        this.app.use('/api/users', userRouter);
        this.app.use('/api/species', speciesRouter);
        this.app.use('/api/devices', deviceRouter);
        this.app.use('/api/parameters', paramsRouter);
        this.app.use('/api/plants', plantRouter);
        this.app.use('/api/roles', roleRouter);
        this.app.use('/api/statistics', statisticsRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => {
                console.log(err);
                reject(err)
            });
        });
    }
}

export default Server;
