import {Role, User} from '../models';

const checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Username
    const name = req.body.name || null;
    const surname = req.body.surname || null


    User.findOne({
        where: {
            name: name,
            surname: surname,
        }
    }).then(user => {
        if (user) {
            return res.status(400).send({
                message: "Failed! User with this name and surname is already in use!"
            });
        } else {
            // Email
            User.findOne({
                where: {
                    email: req.body.email
                }
            }).then(user => {
                if (user) {
                    return res.status(400).json({
                        error: "Failed! Email is already in use!"
                    });
                } else {
                    next();
                }
            });
        }
    })
};

const checkRoleExisted = (req, res, next) => {
    if (req.body.role) {
        Role.findOne({
            where: {
                title: req.body.role
            }
        }).then(
            role => {
                if (role === null) {
                    return res.status(400).json({
                        error: `Failed! There is no role ${req.body.role}!"`
                    });
                } else {
                    next();
                }
            });
    }
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail,
    checkRoleExisted
};

export default verifySignUp;