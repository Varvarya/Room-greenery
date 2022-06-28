import {History, HistoryTime} from "../models";
import moment from "moment-timezone";
import {Op} from "sequelize";

class HistoryController {

    public async get(req, res) {
        const timezone =  Intl.DateTimeFormat().resolvedOptions().timeZone;
        const deviceId = req.params.id;
        const from = req.body.from || moment.tz('2022-06-20 11:00',timezone).format();
        const till = req.body.till || moment.tz(timezone).format();


        await History.findAll({
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
                }
            }],
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
