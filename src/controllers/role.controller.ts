import {Role} from "../models";

class RoleController {
public async getAll(req, res) {
    await Role.findAll()
        .then(data => res.send(data).status(200))
        .catch(err =>
            res.status(500).send({
                message: err.message || "Some error occurred while getting Role"}
))
};


    public async get(req, res) {
        const title = req.params.role;
        const condition = (title) ? {
            where: {
                title: title
            }
        } : null;

        await Role.findAll(condition)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting Role"
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

        const role = {
            title: req.body.title,
            id: 4,
        };

        await Role.create(role)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the Role."
                });
            });
    }

    public async update(req, res) {
        const id = req.params.id;
        const title = req.body.title;

        Role.update({title: title}, {
            where: {id: id}
        })
            .then(data => {
                if (data) {
                    res.send({
                        message: "Role was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Role with id=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error updating Role with id=" + id
                });
            });
    }

    public async deleteById(req, res) {
        const id = req.params.id;

        await Role.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Role was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Role"
            });
        });
    }

    public async deleteByName(req, res) {
        const title = req.params.role;

        await Role.destroy({
            where: {
                title: title
            }
        }).then(() => {
            return res.send('Role was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Role"
            });
        });
    }
}

export default RoleController;
