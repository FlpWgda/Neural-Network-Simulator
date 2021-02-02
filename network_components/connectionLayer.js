import {neuronRadius, height, width} from "../app.js"
import {Connection} from "./connection.js"

class ConnectionLayer{
    constructor(leftLayer, rightLayer){
        this.leftLayer = leftLayer
        this.rightLayer = rightLayer
        this.connections = []

        if(leftLayer == null){
            let neuronConnection = []
            for(var i = 0; i< rightLayer.neurons.length; i++){
                //this.connections.push(neuronConnection)
                neuronConnection.push(new Connection(0  ,  (height/2)+(i - (rightLayer.neurons.length-1)/2)*5 ,  rightLayer.neurons[i].x,  rightLayer.neurons[i].y + neuronRadius));
                //this.rightLayer.neurons[i].rightConnections = neuronConnection
            }
            this.connections.push(neuronConnection)
        }
        else if(rightLayer == null){
            for(let i = 0; i< leftLayer.neurons.length; i++){
                let neuronConnection = []
                this.connections.push(neuronConnection)
                neuronConnection.push(new Connection(leftLayer.neurons[i].x + neuronRadius*2 , leftLayer.neurons[i].y + neuronRadius  ,  width  ,  (height/2)+(i - (leftLayer.neurons.length-1)/2)*5));
                //this.leftLayer.neurons[i].leftConnections = neuronConnection;
            }
        }
        else{
            for(let i = 0; i<leftLayer.neurons.length; i++){
                let neuronConnections = []
                this.connections.push(neuronConnections)
                for(var j = 0; j<rightLayer.neurons.length; j++){
                    let connection = new Connection(leftLayer.neurons[i].x + neuronRadius*2,leftLayer.neurons[i].y + neuronRadius,rightLayer.neurons[j].x,rightLayer.neurons[j].y + neuronRadius);
                    neuronConnections.push(connection);
                    //this.rightLayer.neurons[j].rightConnections.push(connection);
                }
                //this.leftLayer.neurons[i].leftConnections = neuronConnections;
            }
        }
    }
    addConnections(side){
        if(side == 'left'){
            this.connections.forEach(connectionList => {
                connectionList.push(new Connection(0,0,0,0))
            });
        }
        else if(side == 'right'){
            let connectionList = [];
            this.connections[0].forEach(neuron => {
                connectionList.push(new Connection(0,0,0,0))
            });
            this.connections.push(connectionList)
        }
        this.updateConnectionPositions('left');
        this.updateConnectionPositions('right');
    }
    removeConnections(side){
        if(side == 'left'){
            this.connections.forEach(connectionList => {
                connectionList[connectionList.length-1].svg.remove();
                connectionList.pop();
            });
        }
        else{
            this.connections[this.connections.length-1].forEach(connection => {
                connection.svg.remove();
            });
            this.connections.pop();
        }
        this.updateConnectionPositions('left');
        this.updateConnectionPositions('right');
    }
    updateConnectionPositions(side){
        if(side == 'left'){
            if(this.rightLayer != null){
                for(var i = 0; i<this.rightLayer.neurons.length; i++){
                    this.connections.forEach(connectionList => {
                        connectionList[i].x2 = this.rightLayer.neurons[i].x;
                        connectionList[i].y2 = this.rightLayer.neurons[i].y + neuronRadius;
                        connectionList[i].updatePosition();
                    });
                }
            }
            else{
                this.updateNumberOfConnections();
                //console.log("Liczba połączeń: ", this.connections.length )
                //console.log("Liczba neuronów: ", this.leftLayer.neurons.length)
                for(var i = 0; i < this.leftLayer.neurons.length; i++) {
                    this.connections[i][0].x2 = width;
                    this.connections[i][0].y2 = (height/2) + (i - (this.leftLayer.neurons.length-1)/2)*5;
                    this.connections[i][0].updatePosition();
                }
            }
        }
        else if(side == 'right'){
            if(this.leftLayer != null){
                for(var i = 0; i<this.leftLayer.neurons.length; i++){
                    //console.log("Długosc tablicy tablic: ", this.connections.length);
                    //console.log("Liczba neuronów: ", this.leftLayer.neurons.length);
                    this.connections[i].forEach(connection => {
                        connection.x1 = this.leftLayer.neurons[i].x + neuronRadius*2;
                        connection.y1 = this.leftLayer.neurons[i].y + neuronRadius;
                        connection.updatePosition();
                    });
                }
            }
            else{

                for(var i = 0; i<this.rightLayer.neurons.length; i++){
                    this.connections[0][i].x1 = 0;
                    this.connections[0][i].y1 = (height/2)+(i - (this.rightLayer.neurons.length-1)/2)*5;
                    this.connections[0][i].updatePosition();
                }
            }
        }
    }
    updateNumberOfConnections(){
        let layerConnectionDifference = this.leftLayer.neurons.length - this.connections.length;

        if(layerConnectionDifference < 0){
            for(var i = 0; i< Math.abs(layerConnectionDifference); i++){
                let connectionsTemp = this.connections.pop();
                connectionsTemp.forEach(connection => {
                    connection.svg.remove();
                }) ;
            }
        }
        else{
            for(var i = 0; i< layerConnectionDifference; i++){
                let connectionsList = [];
                this.connections.push(connectionsList);
                connectionsList.push(new Connection(0,0,0,0));
            }
        }
    }
    updateConnectionWeights(weights){
        for(let i=0; i<this.connections.length; i++){
            for(let j=0; j<this.connections[i].length; j++){
                this.connections[i][j].updateConnectionWeight(weights[i][j]);
            }
        }
    }
}

export {ConnectionLayer}