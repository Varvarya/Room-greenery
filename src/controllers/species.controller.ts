import Sequelize from "sequelize";
import {Params, Plant, Species} from "../models";

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

        Species.create(species)
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
        const species_id = req.params.id;
        const title = req.body.title;

        const current = await Species.findOne({
            where: {id: species_id},
        });

        current.name = req.body.title;
        current.save()
            .then(() => {
                res.send({
                    message: "Species was updated successfully."
                })
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Error updating Species with id=" + species_id
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

    public async defaultParamsForSpecies(req, res) {
        const species = await Species.findOne({
            where: {
                name: req.params.name
            }
        });

        const averages = await Params.findAll({
            attributes: {
                exclude: [
                    "id",
                    "co2_level",
                    "ground_humidity",
                    "air_humidity",
                    "air_temperature",
                    "light_level",
                ],
                include: [
                    [Sequelize.fn("AVG", Sequelize.col("Parameters.co2_level")), "co2_level_average"],
                    [Sequelize.fn("AVG", Sequelize.col("Parameters.ground_humidity")), "ground_humidity_average"],
                    [Sequelize.fn("AVG", Sequelize.col("Parameters.air_humidity")), "air_humidity_average"],
                    [Sequelize.fn("AVG", Sequelize.col("Parameters.air_temperature")), "air_temperature_average"],
                    [Sequelize.fn("AVG", Sequelize.col("Parameters.light_level")), "light_level_average"],
                ]
            },
            include: [{
                model: Plant,
                where: {
                    species_id: species.id
                },
                attributes: []
            }],
            group: ['"Parameters"."id"']
        });

        return res.send(averages).status(200);
    }
}

export default SpeciesController;
