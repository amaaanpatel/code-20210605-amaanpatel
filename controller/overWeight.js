
const mongo = require('../database/mongo');



module.exports = {
    getOverWight:  async (req, res) => {
        try {
            let connection = await mongo.getConnection('bmi_result')
            let overWeightCount = await connection.db.find({category:'Overweight'}).count()
            return res.send({ "status": "true","result":overWeightCount })
        } catch (error) {
            console.log("getOverWight", error)
            return res.send({ "test": "false" })
        }
    }
}
