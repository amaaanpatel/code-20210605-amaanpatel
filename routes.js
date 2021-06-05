const express = require('express');
const router = express.Router();
const calculate_Bmi = require('./controller/master-bmi');
const overWeightCount = require('./controller/overWeight')



router.get('/process',calculate_Bmi.cal_Bmi);
router.get('/overweight',overWeightCount.getOverWight)
module.exports = router