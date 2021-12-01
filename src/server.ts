import express from 'express';
import bodyParser from 'body-parser';
import organizationsRouter from './routers/organization.router';
import {sequelize} from './models';
import JWTAuthRouter from "./routers/JWTAuth.router";
import userRouter from './routers/user.routes';

class Server {
    private app;

    constructor() {
        this.app = express();
        this.config();
        this.routerConfig();
        this.dbConnect();
    }

    private config() {
        this.app.use(bodyParser.urlencoded({ extended:true }));
        this.app.use(bodyParser.json()); // 100kb default
    }

    private dbConnect() {
        sequelize.authenticate()
            .then(() => console.log("connected to db"))
            .catch(() => {
                throw "error";
            });
    }

    private routerConfig() {
        this.app.use((req, res, next) => {
            res.header(
                "Access-Control-Allow-Headers",
                "x-access-token, Origin, Content-Type, Accept"
            );
            next();
        });
        this.app.use('/organizations', organizationsRouter);
        this.app.use('/auth', JWTAuthRouter);
        this.app.use('/users', userRouter);
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: Object) => reject(err));
        });
    }
}

export default Server;
