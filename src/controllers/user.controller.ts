import {Op} from 'sequelize';
import {Organization, User} from "../models";
import bcrypt from "bcryptjs";

class UserController {
    public async getAll (req, res) {
        await User.findAndCountAll()
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting user"
                });
            });
    }

    public async get(req, res) {
        const name = req.body.name;
        const surname = req.body.surname;
        const condition = {
            name: name ? {
                [Op.or]: {
                    [Op.iLike]: `%${name}%`,
                    [Op.iLike]: `%${surname}%`,
                }
            } : null,
            surname: surname ? {
                [Op.or]: {
                    [Op.iLike]: `%${name}%`,
                    [Op.iLike]: `%${surname}%`,
                }
            } : null
        };

        await User.findAll({where: condition})
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

    public async getById(req, res) {
        const id = (req.params.id)?(req.params.id):req.userId;

        await User.findByPk(req.userId,
            {
                attributes: {exclude: ['password', 'role_id']}
            })
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting user"
                });
            });
    }

    public async getMe(req, res) {
        await User.findByPk(req.userId,
            {
                attributes: {exclude: ['password', 'role_id']}
            })
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting user"
                });
            });
    }

    public async update(req, res) {
        const id = req.params.userId;
        const {name, surname, email, password, newPassword} = req.body;

        await User.findByPk(id).then(user => {
            if (user) {
                if (name) user.set({name: name});
                if (surname) user.set({surname: surname});

                if (email) user.set({email: email});

                const passwordIsValid = bcrypt.compareSync(
                    password,
                    user.password
                );

                if (passwordIsValid && newPassword) user.set({password: bcrypt.hashSync(newPassword, 8)});

                user.save();
                return res.send('User was successfully updated').status(200);
            } else {
                res.status(500).send({
                    message:
                        "Some error occurred while updating users"
                });
            }
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while updating users"
            });
        });
    }

    public async deleteByName(req, res) {
        const name = req.body.name;
        const surname = req.body.surname;
        let organization = null;

        if (req.body.organization) {
            organization = await Organization.findOne({
                where: {
                    title: req.body.organization
                }
            });
        }

        const condition = {
            name: name ? {
                [Op.in]: [name, surname]
            } : null,
            surname: surname ? {
                [Op.in]: [name, surname]
            } : null,
            organization_id: organization ? {
                [Op.like]: `%${organization}%`,
            } : null
        };

        await User.destroy({where: condition})
            .then(() => {
                res.send('User was successfully deleted').status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while deleting users"
                });
            });
    }

    public async deleteById(req, res) {
        const id = req.params.userId;

        await User.destroy({
            where: {
                id: id
            }
        }).then(() => {
            res.send('User was successfully deleted').status(200);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting users"
            });
        });
    }

    public allAccess(req, res) {
        res.status(200).send("Public Content.");
    };

    public userBoard(req, res) {
        res.status(200).send("User Content.");
    };

    public moderatorBoard(req, res) {
        res.status(200).send("Moderator Content.");
    };

    public adminBoard(req, res) {
        res.status(200).send("Admin Content.");
    };
}

export {UserController};