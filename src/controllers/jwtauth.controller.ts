import {Organization, Role, User} from '../models';
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
            }).then(async role => {
                let org;
                if (req.body.organization) {
                    await Organization.findOrCreate({
                        where: {
                            title: req.body.organization
                        }
                    }).then((data) => org = data[0].id);
                } else {
                    org = null;
                }

                    User.create({
                        name: req.body.name,
                        surname: req.body.surname,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, 8),
                        role_id: role.id,
                        organization_id: org,
                    }).then(() => {
                        return res.send({message: "User was registered successfully!"});
                    }).catch(err => {
                        return res.status(500).send({message: err.message});
                    })
            }).catch(err => {
                return res.status(500).send({message: err.message});
            })
        }
        else {
            res.status(500).send({message: 'Please, provide all required fields'})
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
                    organization_id: user.organization_id,
                    access_token: token
                });
            })
            .catch(err => {
                return res.status(500).send({message: err.message});
            });
    };
};

export default JwtAuthController;
