import { AddHistoryTime } from './history';
import server from './server';
import {DBController} from "./controllers/db.controller";

const port = parseInt(process.env.PORT || '3000');

const starter = new server().start(port)
    .then(port => {
        const s = new DBController
        console.log( s.getFileName())
        console.log(`Running on port ${port}`);
    })
    .catch(error => {
        console.log(error)
    });

export default starter;
