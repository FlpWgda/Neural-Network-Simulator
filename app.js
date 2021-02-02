import {LearningEngine} from "./model/learningEngine.js"
import {functionCheck} from "./model/functionUtilities.js"
import {NeuralNetwork} from "./network_components/neuralNetwork.js"

const hiddenLayers = document.getElementById("svgLayers");
const networkControls = document.getElementById("networkControls");
const svgNS = "http://www.w3.org/2000/svg";


var width = hiddenLayers.offsetWidth ;
console.log("Szerokość ", width);
var heightWithControls = hiddenLayers.offsetHeight -10;
var height = heightWithControls -50;
console.log("Wysokość", height);

const neuronRadius = 20
const hoverScale = 1.2

const maxNumberOfLayers = 6
const minNumberOfLayers = 1
const maxNumberOfNeurons = 10
const minNumberOfNeurons = 1

const svgMainAndControls = document.createElementNS(svgNS, "svg");
const svgMain = document.createElementNS(svgNS, "svg");
svgMainAndControls.setAttribute('width',width);
svgMainAndControls.setAttribute('height',heightWithControls);
svgMain.setAttribute('width',width);
svgMain.setAttribute('height',height);
svgMain.setAttribute('y',50);
svgMainAndControls.appendChild(svgMain);

hiddenLayers.appendChild(svgMainAndControls);



var layerSizes = [8,8,8];
const neuralNet = new NeuralNetwork(layerSizes);

const plusLayerButton = document.getElementById("plusLayerButton");
const minusLayerButton = document.getElementById("minusLayerButton");
const numberOfLayers = document.getElementById("numberOfLayers");
numberOfLayers.textContent =  neuralNet.layerInfos.length


plusLayerButton.addEventListener("click", (e) => {

    if(neuralNet.layers.length < maxNumberOfLayers) {
        neuralNet.addLayer(8);
        console.log("Warstwy");
        for (var i = 0; i < neuralNet.layers.length; i++) {
            console.log("Połączenia: ", neuralNet.connectionLayers[i].connections.length, " ", neuralNet.connectionLayers[i].connections[0].length);
            console.log("Neurony: ", neuralNet.layers[i].neurons.length);
        }
        console.log("Połączenia: ", neuralNet.connectionLayers[neuralNet.connectionLayers.length - 1].connections.length, " ", neuralNet.connectionLayers[neuralNet.connectionLayers.length - 1].connections[0].length);

        numberOfLayers.textContent = neuralNet.layerInfos.length;

        if(neuralNet.layers.length == maxNumberOfLayers){
            plusLayerButton.disabled = true;
            plusLayerButton.style.opacity = 0.2;
        }
        if(minusLayerButton.disabled == true){
            minusLayerButton.disabled = false;
            minusLayerButton.opacity = 1;
        }
    }
});
plusLayerButton.addEventListener("mouseover", (e) => {


})

minusLayerButton.addEventListener("click", (e) => {

     if(neuralNet.layers.length > minNumberOfLayers){
         neuralNet.removeLayer();
         console.log("Warstwy");
         for(var i = 0; i< neuralNet.layers.length; i++){
             console.log("Połączenia: ", neuralNet.connectionLayers[i].connections.length, " ", neuralNet.connectionLayers[i].connections[0].length);
             console.log("Neurony: ", neuralNet.layers[i].neurons.length);
         }
         console.log("Połączenia: ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections.length, " ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections[0].length);

         numberOfLayers.textContent =  neuralNet.layerInfos.length;

         if(neuralNet.layers.length == minNumberOfLayers){
             minusLayerButton.disabled = true;
             minusLayerButton.style.opacity = 0.2;
         }
         if(plusLayerButton.disabled == true){
             plusLayerButton.disabled = false;
             plusLayerButton.style.opacity = 1;
         }
     }

})


let submittedFunction = "x^2";

const checkFunctionButton = document.getElementById("functionCheckButton");
const incorrectFunctionInfo = document.getElementById("incorrectFunction");
const functionSize = document.getElementById("functionSize");
const numberOfPoints = document.getElementById("numberOfPoints");
const batch = document.getElementById("batchSize");
const shuffle = document.getElementById("shuffle");
functionSize.addEventListener("input", (e) =>{
    //stopLearning();
    numberOfPoints.textContent = functionSize.value;
    batch.max = parseInt(functionSize.value);
    if(parseInt(batch.value) > parseInt(functionSize.value)){
        batch.value = parseInt(functionSize.value);
    }
    //functionCheckAndChartUpdate();
})

batch.addEventListener("change", (e) => {
    registeredChange = true;
    batch.value = parseInt(batch.value);
    if(parseInt(batch.value) > parseInt(batch.max)){
        batch.value = parseInt(batch.max);
    }

    if(parseInt(batch.value) < parseInt(batch.min)){
        batch.value = parseInt(batch.min);
    }
})


shuffle.addEventListener("change", (e) => {
    console.log("shuffle decision", shuffle.value);
    registeredChange = true;
    if(shuffle.value == "on"){
        shuffleDecision = true;
    }
    else{
        shuffleDecision= false;
    }
})

var shuffleDecision = true;
var functionCheckResult;

const rangeMin = document.getElementById("rangeMin");
rangeMin.addEventListener("change", (e)=> {
    //stopLearning();

    if(!isRealNumber(parseFloat(rangeMin.value))){
        rangeMin.value = 0;
    }
    if(parseFloat(rangeMin.value) > parseFloat(rangeMin.max)){
        rangeMin.value = rangeMin.max
    }
    else if(parseFloat(rangeMin.value) < parseFloat(rangeMin.min)){
        rangeMin.value = rangeMin.min
    }
    if(parseFloat(rangeMin.value) >= parseFloat(rangeMax.value)){
        rangeMax.value = parseFloat(rangeMin.value) + 0.1
    }

    //functionCheckAndChartUpdate();
})
const rangeMax = document.getElementById("rangeMax");
rangeMax.addEventListener("change", (e) => {
    //stopLearning();
    if(!isRealNumber(parseFloat(rangeMax.value))){
        rangeMax.value = 0;
    }
    if(parseFloat(rangeMax.value) > rangeMax.max){
        rangeMax.value = rangeMax.max
    }
    else if(parseFloat(rangeMax.value) < rangeMax.min){
        rangeMax.value = rangeMax.min
    }
    if(parseFloat(rangeMax.value) <= parseFloat(rangeMin.value)){
        rangeMin.value = parseFloat(rangeMax.value) - 0.1
    }

    //functionCheckAndChartUpdate();

})

const nextSetEpochsInput = document.getElementById("nextSetEpochsInput");
const epochs = document.getElementById("epochs");
const setEpochsButton = document.getElementById("setEpochsButton");
const next1EpochsButton = document.getElementById("next1EpochsButton");
const next10EpochsButton = document.getElementById("next10EpochsButton");
const next100EpochsButton = document.getElementById("next100EpochsButton");

function isRealNumber(n){
    return typeof n == 'number' && !isNaN(n) && isFinite(n);
}

const gammaText = document.getElementById("gammaText");
const gamma = document.createElement("input");

gamma.type = "number";
gamma.style.marginLeft = "5px"
gamma.style.marginRight= "5px"
gamma.min = 0;
gamma.max = 1;
gamma.step = 0.1;
gamma.value = 0.2;
gamma.classList.add("nextEpochsButton");
gamma.style.width = "60px";
gamma.addEventListener("change", (e) => {
    registeredChange = true;
    stopLearning();
    if(parseFloat(gamma.value) > gamma.max){
        gamma.value = gamma.max
    }
    else if(parseFloat(gamma.value) < gamma.min){
        gamma.value = gamma.min
    }
    if(optimizer.value == "momentum"){
       neuralNet.optimizer.momentum = parseFloat(gamma.value)
    }
    else if(optimizer.value == "adadelta"){
        neuralNet.optimizer.momentum = parseFloat(gamma.value);
    }
    if(!isRealNumber(parseFloat(gamma.value))){
        gamma.value = 0.1;
    };
})




const learningRate = document.getElementById("learningRate");
const wspUczeniaText = document.getElementById("WspUczeniaText");
const divControls = document.getElementById("controls");
const optimizer = document.getElementById("optimizer");
optimizer.addEventListener("input", (e) =>{
    registeredChange = true;
    stopLearning();
    if(optimizer.value == "sgd"){
        divControls.removeChild(gamma);
        neuralNet.optimizer = tf.train.sgd(parseFloat(learningRate.value));
        gammaText.hidden = true;
    }
    else if(optimizer.value == "momentum"){
        divControls.insertBefore(gamma,wspUczeniaText);
        gammaText.hidden = false;
        neuralNet.optimizer = tf.train.momentum(parseFloat(learningRate.value),parseFloat(gamma.value));
    }
    else if(optimizer.value == "adagrad"){
        divControls.removeChild(gamma);
        neuralNet.optimizer = tf.train.adagrad(parseFloat(learningRate.value));
        gammaText.hidden = true;
    }
    else if(optimizer.value == "adadelta"){
        divControls.insertBefore(gamma,wspUczeniaText);
        neuralNet.optimizer = tf.train.adadelta(parseFloat(learningRate.value),parseFloat(gamma.value));
        gammaText.hidden = false;
    }

    console.log(neuralNet.optimizer)
})
learningRate.addEventListener("change", (e) => {
    registeredChange = true;
    stopLearning();
    if(parseFloat(learningRate.value) > parseFloat(learningRate.max)){
        learningRate.value = learningRate.max
    }
    else if(parseFloat(learningRate.value) < parseFloat(learningRate.min)){
        learningRate.value = learningRate.min
    }
    console.log(neuralNet.optimizer.learningRate);
    neuralNet.optimizer.learningRate = parseFloat(learningRate.value);

    if(!isRealNumber(parseFloat(learningRate.value))){
            learningRate.value = 0.1;
    };
}


)
const lossFunction = document.getElementById("lossFunction");

lossFunction.addEventListener("input", (e) => {
    registeredChange = true;
    stopLearning();
    if(lossFunction.value == "meanAbsoluteError"){
        neuralNet.lossFunction = "meanAbsoluteError"
    }
    else{
        neuralNet.lossFunction = "meanSquaredError"
    }
})
const outputActivation = document.getElementById("outputActivation");

/*outputActivation.addEventListener("input", (e) => {
    registeredChange = true;
    neuralNet.outputActivation = outputActivation.value;
})*/

const kernelInitializer = document.getElementById("weightInit");

kernelInitializer.addEventListener("input", (e) => {
    registeredChange = true;
    stopLearning();
    neuralNet.kernelInitializer = kernelInitializer.value;
})













var incorrectFunctionBool = false;

function functionCheckAndChartUpdate(){
    functionCheckResult = functionCheck(submittedFunction, parseFloat(functionSize.value), parseFloat(rangeMin.value), parseFloat(rangeMax.value));

    registeredChange = true;
    stopLearning();
    if(functionCheckResult == 'Error'){
        incorrectFunctionBool = true;

        incorrectFunctionInfo.style.visibility = "visible";
        startStopButton.disabled = true;
        startStopButton.style.opacity = 0.2;
        setEpochsButton.disabled = true;
        setEpochsButton.style.opacity = 0.2;
        next1EpochsButton.disabled = true;
        next1EpochsButton.style.opacity = 0.2;
        next10EpochsButton.disabled = true;
        next10EpochsButton.style.opacity = 0.2;
        next100EpochsButton.disabled = true;
        next100EpochsButton.style.opacity = 0.2;
        neuralNet.updateChartsFunction([]);
    }
    else{
        incorrectFunctionBool = false;
        incorrectFunctionInfo.style.visibility = "hidden";

        startStopButton.disabled = false;
        startStopButton.style.opacity = 1;
        setEpochsButton.disabled = false;
        setEpochsButton.style.opacity = 1;
        next1EpochsButton.disabled = false;
        next1EpochsButton.style.opacity = 1;
        next10EpochsButton.disabled = false;
        next10EpochsButton.style.opacity = 1;
        next100EpochsButton.disabled = false;
        next100EpochsButton.style.opacity = 1;

        neuralNet.updateChartsFunction(functionCheckResult);
        neuralNet.lossHistory = [];
        neuralNet.updateLossChart();
        modifyEpochNumber(0);
    }
}

const startStopButton = document.getElementById("startStopButton");

const nextEpochButton = document.getElementById("nextEpochButton");

const epochNumberPointer = document.getElementById("epochNumberPointer");

functionCheckAndChartUpdate();

var start = 0;
var registeredChange = false;
var learningEngine = new LearningEngine(neuralNet);
var epochNumber = 0;
startStopButton.addEventListener("click", (e) => {
    if(start == 0){
        startLearning(10000);
    }
    else{
        stopLearning(10000);
    }
});

const buttons = [];
for(let i = 1; i<13; i++){
    buttons.push(document.getElementById("button" + i));
}
buttons.forEach(button => button.addEventListener("click", (e) => {
    submittedFunction = button.value.substring(7);
    console.log(button.value.substring(7));
    buttons.forEach(button => button.style.backgroundColor = "transparent")
    button.style.backgroundColor = "#4CAF50";
    functionCheckAndChartUpdate();
}))
buttons[1].style.backgroundColor = "#4CAF50";




epochs.addEventListener("change", (e) =>{
    if(parseInt(epochs.value) > parseInt(epochs.max)){
        epochs.value = epochs.max;
    }
    if(epochs.value < epochs.min){
        epochs.value = epochs.min;
    };
})
nextSetEpochsInput.addEventListener("click", (e) =>{
    startLearning(parseInt(epochs.value));
})
next1EpochsButton.addEventListener("click", (e) =>{
    startLearning(1);
})
next10EpochsButton.addEventListener("click", (e) =>{
    startLearning(10);
})
next100EpochsButton.addEventListener("click", (e) =>{
    startLearning(100);
})

function modifyRegisteredChange(value){
    registeredChange = value;
}
function modifyEpochNumber(value){
    epochNumber = value;
    epochNumberPointer.textContent = epochNumber;
}
function modifyStartValue(value){
    start = value;
}
function showRestartBanner(){
    let restartBanner = document.createElement("div");
    restartBanner.id = "restartBanner";
    hiddenLayers.appendChild(restartBanner);
    restartBanner.style.top = hiddenLayers.offsetTop + 'px';
    restartBanner.style.left = hiddenLayers.offsetLeft + 'px';
    restartBanner.style.height = hiddenLayers.offsetHeight + 'px';
    restartBanner.style.width = hiddenLayers.offsetWidth + 'px';
    let restartMessage = document.createElement("p");
    restartMessage.id = "restartMessage";
    restartMessage.textContent = "Sieć nie jest w stanie się nauczyć. Podaj inne parametry. Kliknij baner aby zamknąć";
    restartBanner.appendChild(restartMessage);
    const listener = (e) => {
        hiddenLayers.removeChild(restartBanner);
        document.body.removeEventListener("click",listener)}
    document.body.addEventListener("click", listener);

}
function stopLearning(){
    start = 0;
    startStopButton.src = "images/play_arrow-black-48dp.svg"
    if(registeredChange == true){
        neuralNet.lossHistory = []
        neuralNet.updateLossChart();
        neuralNet.mainChart.data.datasets[1].data = [];
        neuralNet.mainChart.update();
        //neuralNet.updateChartsPredictions();
    }
    setEpochsButton.disabled = false;
    setEpochsButton.style.opacity = 1;
    next1EpochsButton.disabled = false;
    next1EpochsButton.style.opacity = 1;
    next10EpochsButton.disabled = false;
    next10EpochsButton.style.opacity = 1;
    next100EpochsButton.disabled = false;
    next100EpochsButton.style.opacity = 1;


}
const {MinMaxScaler} = ml.preprocessing;
var minMaxScalerData;
var minMaxScalerLabels;

function updateChartsPredictions(dataX, layersPredictions){

    let deNormalizedData = minMaxScalerData.inverse_transform(dataX)
    let deNormalizedLayersPredictions = [];
    layersPredictions.forEach(predictionArray => predictionArray.forEach(matrixRow => matrixRow = minMaxScalerLabels
        .inverse_transform(matrixRow)));
    for(let i = 0; i< layersPredictions.length; i++){
        let oneLayerPredictions = []
        for(let j= 0; j< layersPredictions[i].length; j++){
            oneLayerPredictions.push(minMaxScalerLabels.inverse_transform(layersPredictions[i][j]))
        }
        deNormalizedLayersPredictions.push(oneLayerPredictions)
    }

    neuralNet.updateChartsPredictions(deNormalizedData,deNormalizedLayersPredictions)
}

async function startLearning(epochs){
    if(incorrectFunctionBool == false){
        start = 1
        startStopButton.src = "images/pause-black-48dp.svg"
        if(registeredChange == true){
            learningEngine = new LearningEngine(neuralNet);
            registeredChange = false;
            modifyEpochNumber(0);
        }

        setEpochsButton.disabled = true;
        setEpochsButton.style.opacity = 0.2;
        next1EpochsButton.disabled = true;
        next1EpochsButton.style.opacity = 0.2;
        next10EpochsButton.disabled = true;
        next10EpochsButton.style.opacity = 0.2;
        next100EpochsButton.disabled = true;
        next100EpochsButton.style.opacity = 0.2;

        let dataForTraining = functionCheckResult.filter(
            dict => typeof dict.y == 'number' &&
                !isNaN(dict.y) &&
                isFinite(dict.y))

        let dataForTrainingData = dataForTraining.map(dataForTraining => dataForTraining.x);
        let dataForTrainingLabels = dataForTraining.map(dataForTraining => dataForTraining.y);

        minMaxScalerData = new MinMaxScaler({ featureRange: [0,1]})
        let normalizedData = minMaxScalerData.fit_transform(dataForTrainingData);
        minMaxScalerLabels = new MinMaxScaler({ featureRange: [0,1]})
        let normalizedLabels = minMaxScalerLabels.fit_transform(dataForTrainingLabels);


        let dataForTrainingNormalized = [];

        normalizedData.forEach(value => dataForTrainingNormalized.push({x: value}));
        for(let i =0; i<dataForTrainingNormalized.length; i++){
            dataForTrainingNormalized[i].y = normalizedLabels[i];
        }

        let results = await learningEngine.trainNetwork(dataForTrainingNormalized,parseInt(batch.value),epochs,
            epochNumber,shuffleDecision);

        stopLearning();
    }

}
console.log(tf.losses.huberLoss.delta)
export {neuronRadius,svgMain, svgMainAndControls, hiddenLayers, registeredChange,
        width, height, modifyRegisteredChange, modifyEpochNumber, showRestartBanner,
        maxNumberOfLayers, minNumberOfLayers, maxNumberOfNeurons, minNumberOfNeurons,
        start, neuralNet, modifyStartValue, stopLearning, functionCheckAndChartUpdate,
        updateChartsPredictions}