import {Params, History, HistoryTime, Device } from "../models";
import Sequelize from "sequelize";

const AddHistoryTime = async () => {
    const newHistoryTime = await HistoryTime.create();

    const deviceParamsList = await Device.findAll({
        raw: true,
        nest: true,
            include: [{
                model: Params,
                required: true
            }],
            order: [
                ['id', 'ASC'],
            ],
            attributes: {
                include: [
                    [Sequelize.col('Device.id'), 'device_id'],
                    [Sequelize.col('Parameter.co2_level'), 'co2_level'],
                    [Sequelize.col('Parameter.ground_humidity'), 'ground_humidity'],
                    [Sequelize.col('Parameter.air_humidity'), 'air_humidity'],
                    [Sequelize.col('Parameter.air_temperature'), 'air_temperature'],
                    [Sequelize.col('Parameter.light_level'), 'light_level']
                ],
                exclude: ['id', 'organization_id', 'current_params_id', 'plant_id', 'is_working', 'co2_level', 'ground_humidity', 'air_humidity', 'air_temperature', 'light_level']
            },
        }
    );

    for (let i = 0; i < deviceParamsList.length; i++){
        const record = deviceParamsList[i];
        await History.create({
            history_time_id: newHistoryTime.id,
            ...record
        });
    }
};

export {AddHistoryTime}