import {Species} from "../models";

class SpeciesController {

    public async get(req, res) {
        const name = req.params.name;
        const condition = (name) ? {
            where: {
                name: name
            }
        } : null;

        await Species.findAll(condition)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while getting species"
                });
            });
    }

    public async create(req, res) {
        if (!req.body.name) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }

        const species = {
            name: req.body.name,
        };

        await Species.create(species)
            .then(data => {
                res.send(data).status(200);
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while creating the species."
                });
            });
    }

    public async update(req, res) {
        const id = req.params.id;
        const name = req.body.title;

        Species.update({name: name}, {
            where: {id: id}
        })
            .then(data => {
                if (data) {
                    res.send({
                        message: "Species was updated successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot update Species with id=${id}.`
                    });
                }
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error updating Species with id=" + id
                });
            });
    }

    public async deleteById(req, res) {
        const id = req.params.id;

        await Species.destroy({
            where: {
                id: id
            }
        }).then(() => {
            return res.send('Species was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Species"
            });
        });
    }

    public async deleteByName(req, res) {
        const name = req.params.species;

        await Species.destroy({
            where: {
                name: name
            }
        }).then(() => {
            return res.send('Species was successfully deleted').status(200);
        }).catch(err => {
            return res.status(500).send({
                message:
                    err.message || "Some error occurred while deleting Species"
            });
        });
    }
}

export default SpeciesController;
