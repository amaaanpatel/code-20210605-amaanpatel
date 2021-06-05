
const argv = require('yargs').argv;
const spawn = require('child_process').spawn;
const parallel = require('async-await-parallel');
const mongo = require('../database/mongo');



module.exports = {
    cal_Bmi:  async (req, res) => {
        try {
            await processData()
            return res.send({ "status": "true" })
        } catch (error) {
            console.log("cal_bmierror", error)
            return res.send({ "test": "false" })
        }
    }
}

async function processData() {
    try {
        //get the data base connection
        let connection  = await mongo.getConnection('bmi_raw');
        //count the number of records
        let count = await connection.db.find().count();
        //batch size 
        const batchSize = 1000;
        //number of process to run parallel
        const processSize = 2;
        //total batches
        const totalBatches = count / batchSize;
        const slaveProcesses = []
        for (let i=0;i<totalBatches;i++){
            slaveProcesses.push(processBatch(i,batchSize));
        }
        return parallel(slaveProcesses, processSize);
    } catch (error) {
        console.log('processData Error',error);
    }
}

// batch process
function processBatch (Index, batchSize) {
    const startIndex = Index * batchSize;
    return () => { 
        return runSlave(startIndex, batchSize, Index);
    };
};

function runSlave (skip, limit, slaveIndex) {
    return new Promise((resolve, reject) => {
        const args = [ "controller/slave-bmi.js", "--skip", skip, "--limit", limit ];

        const childProcess = spawn("node", args);
        childProcess.stdout.on("data", data => {
            console.log("[" + slaveIndex + "]: INF: " + data);
        });

        childProcess.stderr.on("data", data => {
            console.log("[" + slaveIndex + "]: ERR: " + data);
        });

        childProcess.on("close", code => {
            console.log("this is connection close");
            if (code === 0) {
                resolve();
            }
            else {
                reject(code);
            }
        });

        childProcess.on("error", err => {
            console.log("error",err)
            reject(err);
        });
    });
};
