import {Op} from 'sequelize';
import {Organization} from "../models";

class OrganizationController {

    public async get(req, res) {
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

        Organization.update({title: title}, {
            where: { id: id }
        })
            .then(data => {
                if (data) {
                    res.send({
                        message: "Organization was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Organization with id=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error updating Organization with id=" + id
                });
            });
    }
}

export default OrganizationController;
