import {
    start,
    modifyRegisteredChange,
    modifyEpochNumber,
    showRestartBanner,
    modifyStartValue,
    updateChartsPredictions,
    registeredChange,
    stopLearning
} from "../app.js";

class LearningEngine{
    constructor(neuralNetwork) {
        this.layerModels = this.createModels(neuralNetwork);
        this.neuralNetwork = neuralNetwork;
        this.start = 0;
        this.compileModel(this.layerModels[this.layerModels.length-1]);
    }
    createModels(neuralNetwork){


        let layers = [];
        layers.push(tf.layers.dense({inputShape: [1], units: neuralNetwork.layerInfos[0].layerSize,
            activation: neuralNetwork.layerInfos[0].activationFunction, kernelInitializer: neuralNetwork.kernelInitializer
            /*kernelInitializer: neuralNetwork.layerInfos[0].kernelInitializer*/}));
        for(let i = 1; i< neuralNetwork.layerInfos.length; i++){
            let layer = tf.layers.dense({units: neuralNetwork.layerInfos[i].layerSize,
                activation: neuralNetwork.layerInfos[i].activation,
                kernelInitializer: neuralNetwork.kernelInitializer})
            layers.push(layer);
        }
        let outputLayer = tf.layers.dense({units: 1, activation: neuralNetwork.outputActivation,
            kernelInitializer: neuralNetwork.kernelInitializer});
        layers.push(outputLayer);

        let models = [];
        for(let i = 0; i<= layers.length-1;i++){
            let model = tf.sequential();
            for(let j = 0; j<= i; j++){
                model.add(layers[j]);
            }
            models.push(model);
        }

        return models;
    }
    compileModel(model){
        model.compile({
            optimizer: this.neuralNetwork.optimizer,
            loss: this.neuralNetwork.lossFunction,
            metrics: ['accuracy']
        });
    }

    async trainNetwork(data,batchSize,epochs,currentEpoch, shuffle) {
        console.log("batch size:", batchSize)
        const {MinMaxScaler} = ml.preprocessing;
        const minMaxScaler = new MinMaxScaler({ featureRange: [0,1]});
        let dataTensor = this.createTensorFromArray(data.map(dict => dict.x));
        
        let labelsTensor = this.createTensorFromArray(data.map(dict => dict.y));
        let modelToTrain = this.layerModels[this.layerModels.length-1];
        let layerModels = this.layerModels;
        let neuralNet = this.neuralNetwork;
        let loss = 0;

        await this.layerModels[this.layerModels.length-1].fit(dataTensor, labelsTensor, {
            epochs: epochs,
            batchSize: batchSize,
            shuffle: shuffle,
            callbacks: {onEpochEnd}
        }).then(info => {
            console.log('Loss', info.history.loss[0]);
            //loss = info.history.loss[0];
        });
        async function onEpochEnd(epoch, logs) {
            loss = logs.loss;
            if(isNaN(loss)){
                modifyStartValue(0);
                modifyRegisteredChange(true);
                stopLearning();
                showRestartBanner();
            }
            else{
                neuralNet.updateWeights(modelToTrain);
            }

            modifyEpochNumber(epoch+ 1 + currentEpoch);

            let predictions = [];
            tf.engine().startScope();
            await layerModels.forEach(layerModel => {
                let predicted = layerModel.predict(dataTensor).arraySync();
                predictions.push(predicted);
            })
            tf.engine().endScope();

            updateChartsPredictions(data.map(dict => dict.x),predictions);
            if(registeredChange == 1){
                //modifyRegisteredChange(0);
                //neuralNet.lossChart.data.datasets[0].data = [{x:0, y:loss}];
            }
            else{
                neuralNet.lossChart.data.datasets[0].data.push({x: neuralNet.lossChart.data.datasets[0].data.length, y:loss});
            }
            //neuralNet.updateLossChart();
            await neuralNet.lossChart.update();

            if(start == 0){
                modelToTrain.stopTraining = true;
            }
        }

        //console.log("Waga ", i, ' ', this.model.layers[1].getWeights()[0].arraySync()[0][0]);


        let predictions = [];
        tf.engine().startScope();
        await this.layerModels.forEach(layerModel => {
           predictions.push(this.predict(layerModel,dataTensor));
        })
        tf.engine().endScope();
        return [predictions,loss];

    }
    predict(model,data){
        let predicted = model.predict(data).arraySync()
        return predicted ;
    }
    createTensorFromArray(data){
        let newArray = [];
        while(data.length){
            newArray.push(data.splice(0,1))
        }

        let tensor = tf.tensor(newArray);
        return tensor;
    }
}
export {LearningEngine};
