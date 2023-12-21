const urls = require("./../constants/urls");
const axios = require("axios");

const saveDataByModel = async (modelName, data, token) => {
    const domainModelBaseUrl = process.env.DINECLOUD_DOMAINMODEL_SERVER_URL;
    const url = `${domainModelBaseUrl}${urls.domainModel.updateModelData}`;

    console.log(url, {
        [modelName]: data
    });

    return axios.post(url, {
        [modelName]: data
    }, {
        headers: {
            "Authorization": `${token}`,
            "Content-Type": "application/json"
        }
    });
}

module.exports = {
    saveDataByModel
}