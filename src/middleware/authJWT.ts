import jwt from 'jsonwebtoken';
import config from "../authconfig/auth.config";
import {Role, User } from "../models";

const verifyToken = (req, res, next) => {
    const token = req.headers["Authorization"] || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.userId = decoded.id;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        Role.findByPk(user.role_id).then(role => {
            if (role.title !== 'admin') {
                return res.status(403).send({
                    message: "Require Admin Role!"
                });
            } else {
                next();
            }
        });
    });
};

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
};

export default authJwt;