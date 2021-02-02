import {modifyRegisteredChange, width, stopLearning, functionCheckAndChartUpdate} from "../app.js"
import {Layer} from "./layer.js"
import {ConnectionLayer} from "./connectionLayer.js"

class NeuralNetwork {
    constructor(layerSizes){
        this.layerInfos = []
        this.layers = []
        this.connectionLayers = []
        this.lossHistory = []
        this.mainChart = window.mainChart;
        this.lossChart = window.lossChart;
        this.learningRate = 0.1;
        this.optimizer = tf.train.sgd(this.learningRate);
        this.lossFunction = "meanSquaredError";
        this.outputActivation = "sigmoid";
        this.kernelInitializer = "heUniform";

        for(var i = 0; i< layerSizes.length; i++){
            let layerInfo = {
                layerIndex : i,
                layerSize : layerSizes[i],
                activationFunction: "relu"
            }
            this.layerInfos.push(layerInfo)
        }

        for(var i = 0; i < layerSizes.length; i++){
            this.layers.push(new Layer((width/(layerSizes.length+1))*(i+1),this.layerInfos[i]))
        }

        for(var i = 0; i < layerSizes.length + 1; i++){
            if(i == 0){
                this.connectionLayers.push(new ConnectionLayer(null,this.layers[i]))
                this.layers[i].leftConnectionLayer = this.connectionLayers[i]
            }
            else if(i == layerSizes.length){
                this.connectionLayers.push(new ConnectionLayer(this.layers[i-1],null))
                this.layers[i-1].rightConnectionLayer = this.connectionLayers[i]
            }
            else{
                this.connectionLayers.push(new ConnectionLayer(this.layers[i-1],this.layers[i]))
                this.layers[i-1].rightConnectionLayer = this.connectionLayers[i]
                this.layers[i].leftConnectionLayer = this.connectionLayers[i]
            }
        }
    }
    addLayer(numberOfNeurons){

        modifyRegisteredChange(true);
        stopLearning();

        let layerInfo = {
            layerIndex: this.layerInfos.length,
            layerSize: numberOfNeurons
        }
        this.layerInfos.push(layerInfo);
        let rightConnectionLayerTemp = this.layers[this.layers.length - 1].rightConnectionLayer;
        this.layers.push(new Layer((width/(this.layerInfos.length+1))*(this.layerInfos.length-1),layerInfo));
        this.layers[this.layers.length - 1].rightConnectionLayer = rightConnectionLayerTemp;
        this.updateLayersPosition();
        let connectionLayer =  new ConnectionLayer(this.layers[this.layers.length-2],this.layers[this.layers.length-1])
        this.connectionLayers.splice(this.connectionLayers.length-1,0,connectionLayer);
        this.layers[this.layers.length -1].leftConnectionLayer = connectionLayer;
        this.layers[this.layers.length - 2].rightConnectionLayer = connectionLayer;
        this.connectionLayers[this.connectionLayers.length - 1].leftLayer = this.layers[this.layers.length - 1];
        this.updateConnectionLayersPositions();

        functionCheckAndChartUpdate();


    }
    removeLayer(){

        modifyRegisteredChange(true);
        stopLearning();

        this.layerInfos.pop();
        let removedLayer = this.layers.pop();
        let removedConLayer = this.connectionLayers.splice(this.connectionLayers.length-2,1);
        removedConLayer[0].connections.forEach(connectionList => {
            connectionList.forEach(connection => {
                connection.svg.remove();
            });
        });
        removedLayer.buttonContainer.remove();
        //removedLayer.plusButton.remove();
        //removedLayer.minusButton.remove();
        removedLayer.neurons.forEach(neuron => {
            neuron.svg.remove();
        });
        let lastLayer = this.layers[this.layers.length-1];
        let lastConnectionLayer = this.connectionLayers[this.connectionLayers.length-1];
        lastLayer.rightConnectionLayer = lastConnectionLayer;
        lastConnectionLayer.leftLayer = lastLayer;

        this.updateLayersPosition();
        this.updateConnectionLayersPositions();


    }
    updateLayersPosition(){
        for(var i = 0; i<this.layers.length; i++){
            this.layers[i].x = (width/(this.layers.length+1))*(i+1);
            this.layers[i].updateNeuronPositions();
            this.layers[i].updateButtonPositions();
        }
    }
    updateConnectionLayersPositions(){
        this.connectionLayers.forEach(connectionLayer => {
            connectionLayer.updateConnectionPositions("left");
            connectionLayer.updateConnectionPositions("right");
        });
    }
    updateChartsFunction(functionCheckResult){
        if(functionCheckResult != 'Error'){
            this.layers.forEach(layer => {
                layer.neurons.forEach(neuron => {
                    neuron.updateChartsFunction(functionCheckResult);
                })
            })
            this.mainChart.data.datasets[0].data = functionCheckResult;
            this.mainChart.update();
        }
    }
    updateChartsPredictions(data,layersPredictions){
        for(let i = 0; i<this.layers.length;i++){ // jak będzie podłączony main chart to usuń -1 z condition
            for(let j = 0; j<this.layers[i].neurons.length; j++){
                let predictions = layersPredictions[i].map(array => array[j])
                let dataPredictionPairs = [];
                for(let i = 0; i< data.length;i++){
                    dataPredictionPairs.push({x: data[i], y:predictions[i]})
                }
                this.layers[i].neurons[j].updateChartsPredictions(dataPredictionPairs);
            }
        }
        let predictions = layersPredictions[this.layers.length].map(array => array[0])
        let dataPredictionPairs = [];
        for(let i = 0; i< data.length;i++){
            dataPredictionPairs.push({x: data[i], y:predictions[i]})
        }
        this.mainChart.data.datasets[1].data = dataPredictionPairs;
        this.mainChart.update();

    }
    updateLossChart(){
        this.lossChart.data.datasets[0].data = this.lossHistory;
        this.lossChart.update();
    }
    updateWeights(model){
        for(let i=0; i< this.connectionLayers.length; i++){
            this.connectionLayers[i].updateConnectionWeights(model.layers[i].getWeights()[0].arraySync());
        }
    }
}

export {NeuralNetwork}