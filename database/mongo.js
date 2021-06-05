const MongoClient = require('mongodb').MongoClient;
const host = "mongodb://localhost:27017";
const databse = "BMI";
// const collection = "bmi2";
let connectionObj;

//create a mongodb colletions
module.exports.createConnection = async function () {
    try {
        //connect
        let client = await MongoClient.connect(host, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        //select database and collection
        let database = client.db(databse);
        //return connection object
        connectionObj = {
            db: database,
            close: () => {
                return client.close();
            }
        }
        return connectionObj;
    } catch (error) {
        console.log("error", error);
    }
}

//get connections
module.exports.getConnection = async function (collection) {
    try {
        ;
        //check the connection
        if (connectionObj) {
            // select the collection
            connectionObj.db = connectionObj.db.collection(collection);
            return connectionObj
        } else{
            console.log("reconnection")
            //create a new connection
            let connection = await this.createConnection();
            connection.db = connectionObj.db.collection(collection);
            return connection
        }
    } catch (error) {
        console.log("error",error)
    }
}

