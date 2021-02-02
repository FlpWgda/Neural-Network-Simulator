import {neuralNet, neuronRadius, modifyRegisteredChange, svgMain, svgMainAndControls,
        height, minNumberOfNeurons, maxNumberOfNeurons, stopLearning, functionCheckAndChartUpdate} from "../app.js"
import {Neuron} from "./neuron.js"

class Layer {
    constructor(x,networkLayerReference){
        this.x = x;
        this.neurons = [];
        this.leftConnectionLayer;
        this.rightConnectionLayer;
        this.buttonContainer;
        this.plusButton;
        this.minusButton;
        this.neuronsNumberTextNode;
        this.networkLayerReference = networkLayerReference;
        for(var i = 0; i < this.networkLayerReference.layerSize; i++){
            this.neurons.push(new Neuron(this.x - neuronRadius,(height/(this.networkLayerReference.layerSize+1))*(i+1) - neuronRadius,Math.random()*10))
        }
        this.addButtons()
    }

    addButtons(){
        const foreignObject1 = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");

        foreignObject1.setAttribute('x',this.x-neuronRadius*2);
        foreignObject1.setAttribute('y',10);
        foreignObject1.setAttribute('width',80);
        foreignObject1.setAttribute('height',60);
        svgMainAndControls.appendChild(foreignObject1);
        this.buttonContainer = foreignObject1;

        let layerSizeControls = document.createElement("div");
        foreignObject1.appendChild(layerSizeControls);
        layerSizeControls.classList.add("layerSizeControls");



        const minusButton1 = document.createElement("img");
        layerSizeControls.appendChild(minusButton1);
        minusButton1.src = "images/remove_circle-black-24dp.svg";
        minusButton1.classList.add("icon");
        //minusButton1.style.position = "absolute";
        //minusButton1.style.top = '5px';
        //minusButton1.style.left = neuronRadius/2 + 'px';
        this.minusButton = minusButton1;

        minusButton1.addEventListener("click", (e) => {
            this.removeNeuron();
            this.neuronsNumberTextNode.textContent = this.neurons.length;
            for(var i = 0; i< neuralNet.layers.length; i++){
                console.log("Połączenia: ", neuralNet.connectionLayers[i].connections.length, " ", neuralNet.connectionLayers[i].connections[0].length);
                console.log("Neurony: ", neuralNet.layers[i].neurons.length);
            }
            console.log("Połączenia: ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections.length, " ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections[0].length);
            console.log("Koniec");
        });

        this.neuronsNumberTextNode = document.createElement("p");
        layerSizeControls.appendChild(this.neuronsNumberTextNode);
        this.neuronsNumberTextNode.textContent = this.neurons.length;

        const plusButton1 = document.createElement("img");
        layerSizeControls.appendChild(plusButton1);
        foreignObject1.classList.add("layerOptions");

        plusButton1.src = "images/add_circle-black-24dp.svg";
        plusButton1.classList.add("icon");
        //plusButton1.style.position = "absolute";
        //plusButton1.style.top = '5px';
        //plusButton1.style.left = neuronRadius*2 + neuronRadius/2 +'px';
        this.plusButton = plusButton1;

        plusButton1.addEventListener("click", (e) => {
            this.addNeuron();
            console.log("Warstwy");
            this.neuronsNumberTextNode.textContent = this.neurons.length;
            for(var i = 0; i< neuralNet.layers.length; i++){
                console.log("Połączenia: ", neuralNet.connectionLayers[i].connections.length, " ", neuralNet.connectionLayers[i].connections[0].length);
                console.log("Neurony: ", neuralNet.layers[i].neurons.length);
            }
            console.log("Połączenia: ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections.length, " ", neuralNet.connectionLayers[neuralNet.connectionLayers.length-1].connections[0].length);
            console.log("Koniec");
        });


        const activationFunction = document.createElement("select");
        activationFunction.classList.add("layerSizeControls");
        activationFunction.classList.add("controlInputs");
        foreignObject1.appendChild(activationFunction);
        const relu = document.createElement("option");
        activationFunction.add(relu);
        relu.text = "ReLU";
        relu.value = "relu";
        const sigmoid = document.createElement("option");
        activationFunction.add(sigmoid);
        sigmoid.text = "Sigmoid";
        sigmoid.value = "sigmoid";
        const linear = document.createElement("option");
        activationFunction.add(linear);
        linear.text = "Linear";
        linear.value = "linear";
        const tanh = document.createElement("option");
        activationFunction.add(tanh);
        tanh.text = "Tanh";
        tanh.value = "tanh";

        activationFunction.addEventListener("change", (e) => {
            this.networkLayerReference.activationFunction = activationFunction.value;
            console.log('Funkcja aktywacji ', activationFunction.value);
            modifyRegisteredChange(true);
            stopLearning();
        });




        /*const plusButton = document.createElementNS(svgNS,"image");
        plusButton.setAttribute("href","add-black-24dp.svg");
        plusButton.setAttribute("x", this.x);
        plusButton.classList.add("icon");
        plusButton.setAttribute("y",40);
        plusButton.setAttribute("fill","#ffd700")
        this.plusButton = plusButton;

        plusButton.addEventListener("mouseover", (e) => {
            plusButton.setAttribute("fill","grey");
            console.log("Nic");
        });*/

        /*const minusButton = document.createElementNS(svgNS,"image");
        minusButton.setAttribute("href","remove-black-24dp.svg");
        minusButton.setAttribute("x", this.x-24);
        minusButton.setAttribute("y",40);
        this.minusButton = minusButton;
        */

        //svgMainAndControls.appendChild(plusButton)
        //svgMainAndControls.appendChild(minusButton)
    }
    addNeuron(){

        if(this.networkLayerReference.layerSize < maxNumberOfNeurons) {

            modifyRegisteredChange(true);
            stopLearning();

            this.networkLayerReference.layerSize++;
            this.neurons.push(new Neuron(this.x - neuronRadius, 0, Math.random() * 10));
            this.updateNeuronPositions();

            this.leftConnectionLayer.addConnections('left');
            this.rightConnectionLayer.addConnections('right');

            this.leftConnectionLayer.updateConnectionPositions('left');
            this.rightConnectionLayer.updateConnectionPositions('right');
            console.log(this.neurons.length);

            if (this.neurons.length == maxNumberOfNeurons) {
                this.plusButton.disabled = true;
                this.plusButton.style.opacity = 0.2;
            }
            if (this.minusButton.disabled == true) {
                this.minusButton.disabled = false;
                this.minusButton.style.opacity = 1;
            }

            functionCheckAndChartUpdate();
        }

    }
    removeNeuron(){

        if(this.networkLayerReference.layerSize > minNumberOfNeurons){
            modifyRegisteredChange(true);
            stopLearning();

            this.networkLayerReference.layerSize--;
            let removedNeuron = this.neurons.pop();
            svgMain.removeChild(removedNeuron.svg);
            /*removedNeuron.leftConnections.forEach(connection => {
                connection.svg.remove();
            });
            removedNeuron.leftConnections.length = 0;
            //if(this.leftConnectionLayer.leftLayer !== null){
                this.leftConnectionLayer.leftLayer.neurons.forEach(neuron =>{
                    neuron.rightConnections.pop();
                });
                this.leftConnectionLayer.leftLayer.updateNeuronPositions();
            //}
            //else{

            //}
            removedNeuron.rightConnections.forEach(connection => {
                connection.svg.remove();
            });
            removedNeuron.rightConnections.length = 0;*/
            this.updateNeuronPositions();
            this.leftConnectionLayer.removeConnections('left');
            this.rightConnectionLayer.removeConnections('right');


            this.leftConnectionLayer.updateConnectionPositions('left');
            this.rightConnectionLayer.updateConnectionPositions('right');
            console.log(this.neurons.length);

            if(this.neurons.length == minNumberOfNeurons){
                this.minusButton.disabled = true;
                this.minusButton.style.opacity = 0.2;
            }
            if(this.plusButton.disabled == true){
                this.plusButton.disabled = false;
                this.plusButton.style.opacity = 1;
            }


        }
    }
    updateNeuronPositions(){
        for(var i = 0; i < this.networkLayerReference.layerSize; i++){
            let neuron = this.neurons[i];
            neuron.x = this.x - neuronRadius;
            neuron.y = (height/(this.networkLayerReference.layerSize+1))*(i+1) - neuronRadius;
            neuron.updatePosition();
        }
    }
    updateButtonPositions(){
        this.buttonContainer.setAttribute('x',this.x - neuronRadius*2);
    }
}

export {Layer}