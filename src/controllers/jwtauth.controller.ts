import {Role, User} from '../models';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import secret from "../authconfig/auth.config";

class JwtAuthController {
    public async signUp(req, res) {
        // Save User to Database
        if (req.body.role) {
            Role.findOne({
                where: {
                    title: req.body.role
                }
            }).then(role => {
                User.create({
                    name: req.body.name,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, 8),
                    role_id: role.id,
                }).then(() => {
                    return res.send({message: "User was registered successfully!"});
                });
            }).catch(err => {
                return res.status(500).send({message: err.message});
            })
        }
    }

    public async signIn(req, res) {
        User.findOne({
            where: {
                name: req.body.name,
                surname: req.body.surname
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(404).send({message: "User Not found."});
                }

                const passwordIsValid = bcrypt.compareSync(
                    req.body.password,
                    user.password
                );

                if (!passwordIsValid) {
                    return res.status(401).send({
                        accessToken: null,
                        message: "Invalid Password!"
                    });
                }

                const token = jwt.sign({id: user.id}, secret.secret, {
                    expiresIn: 86400 // 24 hours
                });

                return res.status(200).send({
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    role_id: user.role_id,
                    accessToken: token
                });
            })
            .catch(err => {
                return res.status(500).send({message: err.message});
            });
    };
};

export default JwtAuthController;
