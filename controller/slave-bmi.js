const argv = require('yargs').argv;
const mongo = require('../database/mongo');
const { v4: uuidv4 } = require('uuid');
const MongoClient = require('mongodb').MongoClient;
const host = "mongodb://localhost:27017";
const databse = "BMI";
const moment = require('moment')

    //get the collection info
    const bmi_category = ["Underweight", "Normal weight","Overweight","Moderately obese","Severely obese", "Very severely obese"];
    const health_risk = ["Malnutrition risk"," Low risk", "Enhanced risk"," Medium risk", "High risk" ,"Very high risk"]

if (argv.skip === undefined || argv.limit === undefined) {
    throw new Error("no args found");
}


//connect to the database for each batch operation
function connectDatabase () {
    return MongoClient.connect(host, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(client => {
            const db = client.db(databse);
            return {
                db: db,
                close: () => {
                    return client.close();
                },
            };
        });
};


async function processData(db, skipAmount, limitAmount) {
    try {
        //get the data to process
        let data = await db.collection('bmi_raw').find()
            .skip(skipAmount)
            .limit(limitAmount)
            .toArray()
        let tf = []
        for (let i = 0; i < data.length; i++) {
            //perform bim calculation
            let bm = calculateBmi(data[i])
            tf.push(bm)
        }
        // let date = moment().format('YYYY-MM-DD HH');
        //store the transfrom data in a newcollection
        await db.collection(`bmi_result`).insertMany(tf)
        return
    } catch (error) {
        console.log("error in connection batch",skipAmount,limitAmount);
        console.log(error)
    }
}

function calculateBmi(data) {
    let bmi = data.WeightKg / Math.pow((data.HeightCm/100),2);
    // console.log(bmi)
    if (bmi < 18.4) {
        data.category = bmi_category[0]
        data.risk = health_risk[0]
    } else if(18.5 <= bmi && bmi <= 24.9){
        data.category = bmi_category[1]
        data.risk = health_risk[1]
    }else if (25 <= bmi && bmi <= 29.9) {
        data.category = bmi_category[2]
        data.risk = health_risk[2]
    } else if (30 <= bmi && bmi <= 34.9) {
        data.category = bmi_category[3]
        data.risk = health_risk[3]
    } else if (35 <= bmi && bmi <= 39.9) {
        data.category = bmi_category[4]
        data.risk = health_risk[4]
    } else {
        data.category = bmi_category[5]
        data.risk = health_risk[5]
    }
    //set the bmi
    data.bmi = bmi;
    return data
}


connectDatabase()
    .then(client => {
        return processData(client.db,argv.skip, argv.limit) 
            .then(() => client.close());
    })
    .then(() => {
        console.log("processind done " + argv.skip + " to " + (argv.skip + argv.limit));
    })
    .catch(err => {
        console.error("error while processing" + argv.skip + " to " + (argv.skip + argv.limit));
        console.error(err);
    });
