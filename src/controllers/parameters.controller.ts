import {Device, Params, Plant, History, HistoryTime} from "../models";
import {ParamsStatus} from "../models/parameters.model";

interface ParamsControllerAttributes {
    status: ParamsStatus | string;

    get(req: Request, res: Response): Promise<void>;

    update(req: Request, res: Response): Promise<void>;

    deleteById(req: Request, res: Response): Promise<void>;

    check(current: string, goal: string): Promise<string>;
}

class ParamsController implements ParamsControllerAttributes {
    status = ParamsStatus.Normal;

    public async get(req, res) {
        const id = req.params.id;

        await Params.findByPk(id)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting parameters"
                });
            });
    }

    public async findPlantTargetParamsId(paramsId: string) {
        await Device.findOne({
            where: {
                current_params_id: paramsId
            }
        }).then(async device => {
            if (device.plant_id) {
                await Plant.findByPk(device.plant_id)
                    .then((data) => {
                        if (data) return data.target_params_id;
                    }).catch(() => {
                            return null;
                        }
                    )
            }
        })

        return null;
    }

    public async check(current: string, goal: string) {
        const currentParams = await Params.findByPk(current);
        const goalParams = await Params.findByPk(goal);

        let points = 0;

        if (goalParams)
            for (const [key, value] of Object.entries(currentParams)) {
                if (key != "id")
                    points += +((Math.abs(value - goalParams[key]) / value) < Params[key]);
            }

        return ParamsStatus[points];
    }

    public async update(req, res) {
        const id = req.params.id;

        await Params.findByPk(id).then(async (data) => {
            if (data) {
                let newParam = {
                    co2_level: undefined,
                    ground_humidity: undefined,
                    air_humidity: undefined,
                    air_temperature: undefined,
                    light_level: undefined
                };

                newParam.co2_level = (req.body.co2_level) ? (req.body.co2_level) : data.co2_level;
                newParam.ground_humidity = (req.body.ground_humidity) ? (req.body.ground_humidity) : data.ground_humidity;
                newParam.air_humidity = (req.body.air_humidity) ? (req.body.air_humidity) : data.air_humidity;
                newParam.air_temperature = (req.body.air_temperature) ? (req.body.air_temperature) : data.air_temperature;
                newParam.light_level = (req.body.light_level) ? (req.body.light_level) : data.light_level;

                await Params.update(newParam,
                    {
                        where: {
                            id: req.params.id,
                        }
                    }).then(async () => {
                    const target = await this.findPlantTargetParamsId(id);

                    let status = ParamsStatus[2].toString();

                    if (target !== null) {
                        status = await this.check(id, target);
                    }

                    return res.send(`Params was successfully updated. Parameters are in ${status} condition`).status(200);
                }).catch(err =>
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while updating params"
                    }));
            }
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while updating params"
            });
        });
    }

    public async deleteById(req, res) {
        const id = req.params.id;

        await Params.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Params was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting params"
            });
        });
    }
}

export {ParamsController};