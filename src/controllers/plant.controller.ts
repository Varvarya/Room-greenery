import {Device, Params, Plant, sequelize, Species, User} from "../models";
import {Op} from "sequelize";

interface PlantControllerAttributes {
    get(req: Request, res: Response): Promise<void>;

    update(req: Request, res: Response): Promise<void>;

    deleteById(req: Request, res: Response): Promise<void>;
}

class PlantController implements PlantControllerAttributes {
    public async get(req, res) {
        const id = req.params.id;

        await Plant.findByPk(id)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting plant"
                });
            });
    }

    public async getAllInOrganization(req, res) {
        let organizationId = (req.params.id) ? (req.params.id) : null;

        if (!organizationId) {
            await User.findByPk(req.userId).then(data => {
                if (data) organizationId = data.organization_id
            })
        }

        const devices = await Device.findAll({
            where: {
                organization_id: organizationId,
            }
        });

        const devices_ids = devices.map(e => e.plant_id);

        await Plant.findAll({
            where: {
                id: {[Op.in]: devices_ids}
            }
        })
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting plant"
                });
            });
    }

    public async create(req, res) {
        await sequelize.transaction(async (transaction) => {
            const p = await Params.create({});

            const [s, exist] = await Species.findOrCreate({
                where: {
                    name: req.body.species
                }
            })

            const plant = await Plant.create({
                target_params_id: p.id,
                species_id: s.id,
            });

            return plant;
        }).then(data => {
            res.send(data).status(200);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating plant"
            });
        });
    }

    public async update(req, res) {
        const id = req.params.id;
        const [species, exist] = await Species.findOrCreate({
            where: {
                name: req.body.species
            }
        });

        await Plant.update({
                species_id: species.id
            },
            {
                where: {
                    id: id
                }
            }).then(() => {
            res.send(`Plant with ${id} was successfully updated`).status(200);
        })
            .catch((err) => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while updating params"
                });
            })
    };

    public async deleteById(req, res) {
        const id = req.params.id;

        await Plant.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Plant was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Plant"
            });
        });
    }
}

export {PlantController};