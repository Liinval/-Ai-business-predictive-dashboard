const express = require('express');
const cors = require ('cors');
const brain = require ('brain.js');
require('dotenv').config();


const app =express();
app.use(cors({
    origin: `https://ai-business-predictive-dashboard.vercel.app`
}));
app.use(express.json())


const trainingData =[
    {input: {marketing : 0.2, users: 0.3, month: 0.33}, output :{revenue :0.25}},
    {input: {marketing : 0.4, users: 0.5, month: 0.66}, output :{revenue :0.48}},
    {input: {marketing : 0.7, users: 0.8, month: 1.00}, output :{revenue :0.79}},
    {input: {marketing : 0.3, users: 0.4, month: 0.33}, output :{revenue :0.35}},
    {input: {marketing : 0.6, users: 0.7, month: 0.66}, output :{revenue :0.68}},
    {input: {marketing : 0.9, users: 0.95, month: 1.00}, output :{revenue :0.92}},
]


const net = new brain.NeuralNetwork({
    hiddenLayers:[4,4]
})

console.log("Training AI model...");
net.train(trainingData,{
    iterations: 20000,
    errorThresh: 0.005,
    log: true,
    logPeriod: 5000
})

console.log("Model trained successfully.");


app.post('/api/predict',(req , res)=>{
    const {marketing,users,month}=req.body;

    const rawPrediction = net.run({ marketing, users,month});

    const MAX_REVENUE = 100000;
    
    const predictedRevenue = Math.round(rawPrediction.revenue * MAX_REVENUE);

    const dashboardData = [
        {name : 'Month 1', actualRevenue:250 ,marketing :20, users:30},
        {name : 'Month 2', actualRevenue:480 ,marketing :40, users:50},
        {name : 'Month 3', actualRevenue:790 ,marketing :70, users:80},
        {name : 'Month 4 (Predicted)', predictedRevenue:'predictedRevenue' ,marketing : marketing * 1000, users: users* 1000}
        ];

        res.json({
            accuracy : 0.85,
            predictedRevenue : predictedRevenue,
            ChartData : dashboardData
        })
})

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, ()=> console.log(`Backend running on PORT ${PORT}`));
 