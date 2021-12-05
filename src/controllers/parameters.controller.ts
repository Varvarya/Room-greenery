import {Params} from "../models";

enum ParamsStatus {
    Critical,
    Bad,
    Normal,
    Good,
    Excellent,
    Perfect
}

interface ParamsControllerAttributes {
    status: ParamsStatus;

    get(req: Request, res: Response) : Promise<void>;
    update(req: Request, res: Response) : Promise<void>;
    deleteById(req: Request, res: Response) : Promise<void>;
    check(current: string, goal: string) : Promise<string>;
}

class ParamsController implements ParamsControllerAttributes{
    status = ParamsStatus.Normal;

    public async get(req, res) {
        const id = req.body.id;

        await Params.findByPk(id)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting users"
                });
            });
    }

    public async update(req, res) {
        const id = req.params.id;
        const {CO2_level, ground_humidity, air_humidity, air_temperature, light_level} = req.body;

        await Params.findByPk(id).then(data => {
            if (data) {
                if (CO2_level) data.set({CO2_level: CO2_level});

                if (ground_humidity) data.set({ground_humidity: ground_humidity});

                if (air_humidity) data.set({air_humidity: air_humidity});

                if (air_temperature) data.set({air_temperature: air_temperature});

                if (light_level) data.set({light_level: light_level});

                data.save();

                return res.send('Params was successfully updated').status(200);
            } else {
                res.status(500).send({
                    message:
                        "Some error occurred while updating params"
                });
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
            res.send('Params was successfully deleted').status(200);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting params"
            });
        });
    }

    public async check(current: string, goal: string) {
        const currentParams = await Params.findByPk(current);
        const goalParams = await Params.findByPk(goal);

        let points = 0;

        for (const [key, value] of Object.entries(currentParams)) {
            points += +((Math.abs(value - goalParams[key]) / value) < Params[key]);
        };

        return ParamsStatus[points];
    }
}

export {ParamsController};