import {Op} from 'sequelize';
import {User} from "../models";

class UserController {

    // public async get(req, res) {
    //     const title = req.params.title;
    //     const condition = title ? {title: {[Op.iLike]: `%${title}%`}} : null;
    //
    //     await User.findAll({where: condition})
    //         .then(data => {
    //             res.send(data).status(200);
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message:
    //                     err.message || "Some error occurred while getting organizations"
    //             });
    //         });
    // }

    // public async create(req, res) {
    //     if (!req.body.title) {
    //         res.status(400).send({
    //             message: "Content can not be empty!"
    //         });
    //         return;
    //     }
    //
    //     const org = {
    //         title: req.body.title,
    //     };
    //
    //     await Organization.create(org)
    //         .then(data => {
    //             res.send(data).status(200);
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message:
    //                     err.message || "Some error occurred while creating the Tutorial."
    //             });
    //         });
    // }
    //
    // public async update(req, res) {
    //     const id = req.params.id;
    //     const title = req.body.title;
    //
    //     Organization.update({title: title}, {
    //         where: { id: id }
    //     })
    //         .then(data => {
    //             if (data) {
    //                 res.send({
    //                     message: "Organization was updated successfully."
    //                 });
    //             } else {
    //                 res.send({
    //                     message: `Cannot update Organization with id=${id}.`
    //                 });
    //             }
    //         })
    //         .catch(err => {
    //             res.status(500).send({
    //                 message: err.message || "Error updating Organization with id=" + id
    //             });
    //         });
    // }

    public allAccess (req, res) {
        res.status(200).send("Public Content.");
    };

    public userBoard (req, res) {
        res.status(200).send("User Content.");
    };

    public adminBoard (req, res) {
        res.status(200).send("Admin Content.");
    };
}

export {UserController};