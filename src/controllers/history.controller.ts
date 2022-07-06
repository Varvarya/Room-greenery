import {History, HistoryTime} from "../models";
import moment from "moment-timezone";
import Sequelize, {Op} from "sequelize";

class HistoryController {

    public async get(req, res) {
        const timezone =  Intl.DateTimeFormat().resolvedOptions().timeZone;
        const deviceId = req.params.id;
        const from = req.body.from || moment.tz('2022-06-20 11:00',timezone).format();
        const till = req.body.till || moment.tz(timezone).format();


        await History.findAll({
            raw: true,
            nest: true,
            where: {
                device_id: deviceId,
            },
            include: [{
                model: HistoryTime,
                required: true,
                where: {
                    date_time: {
                        [Op.between]: [from, till]
                    }
                },
                attributes:{
                    exclude: ['id', 'dateTime'],
                }
            }],
            attributes: {
                include: [
                    [Sequelize.col('date_time'), 'date_time'],
                ],
                exclude: ['device_id', 'history_time_id']
            },
        })
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting statistics"
                });
            });
    }
}

export default HistoryController;
