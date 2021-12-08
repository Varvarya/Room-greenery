import {Op} from "sequelize";
import {Device, Params, sequelize, User} from "../models";

class DeviceController {

    public async get(req, res) {
        const id = req.params.id;

        await Device.findByPk(id)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting device"
                });
            });
    }

    public async getAllOfOrganization(req, res) {
        let organizationId = req.params.id;

        if (!organizationId) {
            await User.findByPk(req.userId).then(data => {
                if (data) organizationId = data.organization_id
            })
        }

        const taken = await Device.findAll({
                where: {
                    organization_id: organizationId,
                    plant_id: {[Op.not]: null}
                }
            }).catch(err =>
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting device"
                }))
        ;

        const available = await Device.findAll({
                where: {
                    organization_id: organizationId,
                    plant_id: {[Op.is]: null}
                }
            }).catch(err =>
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting device"
                }));

        return await res.send({taken: taken, available: available}).status(200);
    }

    public async getAllBroken(req, res) {
        let organizationId = (req.params.id) ? req.params.id : undefined;

        if (!organizationId) {
            await User.findByPk(req.userId).then(data => {
                if (data) organizationId = data.organization_id
            })
        }

        const condition =
            organizationId ? {
                where: {
                    is_working: false,
                    organization_id: organizationId,
                }
            } : {
                where: {
                    is_working: false,
                }
            }


        await Device.findAll(condition).then((data) => {
            res.send(data).status(200);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting broken devices"
                });
            });
    }


    public async create(req, res) {
        const id = req.body.id;
        const org_id = (await User.findByPk(req.userId)).organization_id;
        const plant_id = req.body.plantId || null;

        await sequelize.transaction(async (t) => {
            const device = await Device.create({
                organization_id: org_id,
                plant_id: plant_id,
            }, {transaction: t});

            const p = await Params.create({}, {transaction: t});

            await device.set({
                current_params_id: p.id,
            });

            await device.save({transaction: t});

            return device;
        }).then(data => {
            res.send(data).status(200);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting device"
                });
            });
    }

    public async update(req, res) {
        const id = req.params.id;
        const org_id = (await User.findByPk(req.userId)).organization_id;
        const plant_id = req.body.plantId || null;
        const is_working = req.body.is_working;

        await Device.update({
            organization_id: org_id,
            plant_id: plant_id,
            is_working: is_working
        }, {
            where: {
                id: id
            }
        }).then(data => {
            res.send(data).status(200);
        })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting device"
                });
            });
        ;
    }

    public async deleteById(req, res) {
        const id = req.params.id;

        await Device.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Device was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting device"
            });
        });
    }

}

export {DeviceController};