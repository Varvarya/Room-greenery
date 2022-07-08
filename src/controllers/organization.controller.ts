import {Op} from 'sequelize';
import {Organization, Role} from "../models";

class OrganizationController {

    public async getList(req, res) {
        await Organization.findAll()
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting organizations"
                });
            });
    }

    public async getById(req, res) {
        const id = req.params.id;
        const condition = id ? {id: id} : null;

        await Organization.findAll({where: {id: req.params.id}})
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting organizations"
                });
            });
    }

    public async getByTitle(req, res) {
        const title = req.params.title;
        const condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;

        await Organization.findAll({where: condition})
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting organizations"
                });
            });
    }

    public async create(req, res) {
        if (!req.body.title) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const org = {
            title: req.body.title,
        };

        await Organization.create(org)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Tutorial."
                });
            });
    }

    public async update(req, res) {
        const id = req.params.id;
        const title = req.body.title;

        console.log(id);

        Organization.findByPk(id).then((organization) => {
                if (organization) {
                    console.log(organization);
                    if (title) organization.set({title: title});

                    organization.save();
                    return res.send({
                        message: "Organization was updated successfully."
                    });
                } else {
                    return res.send({
                        message: `Cannot update Organization with id=${id}.`
                    });
                }
            }
        )
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while updating users"
                });
            })
    }

    public async deleteById(req, res) {
        const id = req.params.id;

        await Organization.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Organization was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Organization"
            });
        });
    }

    public async deleteByName(req, res) {
        const title = req.params.title;

        await Organization.destroy({
            where: {
                title: title
            }
        }).then(() => {
            return res.send('Organization was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Organization"
            });
        });
    }
}

export default OrganizationController;
