import {svgMain, hiddenLayers} from "../app.js";

class Connection{
    constructor(x1,y1,x2,y2){
        this.x1 = x1 ;
        this.y1 = y1 ;
        this.x2 = x2;
        this.y2 = y2 ;
        this.weight = 0;
        this.svg = this.createElement();
        this.svgTooltip = document.createElement("div");;
    }

    createElement(){
        const line1 = document.createElementNS("http://www.w3.org/2000/svg", "line");
        //line1.setAttribute('id','line2');
        line1.setAttribute('x1',this.x1);
        line1.setAttribute('y1',this.y1);
        line1.setAttribute('x2',this.x2);
        line1.setAttribute('y2',this.y2);
        line1.setAttribute("stroke", "green");
        line1.setAttribute("stroke-width", 1.5);

        let tooltipDiv;
        line1.addEventListener("mouseover", (e) =>{
            tooltipDiv = this.svgTooltip;
            hiddenLayers.appendChild(tooltipDiv);
            tooltipDiv.style.position = 'fixed';
            tooltipDiv.style.left = e.clientX+10 + 'px';
            tooltipDiv.style.top = e.clientY+10 + 'px';
            tooltipDiv.textContent = "Waga połączenia: " + this.weight;
            tooltipDiv.classList.add("tooltipStyle");

        })
        line1.addEventListener("mouseout", (e) =>{
            hiddenLayers.removeChild(tooltipDiv);

        })
        line1.classList.add("connection");
        line1.classList.add("weightLine");
        svgMain.appendChild(line1);

        /*line1.addEventListener("mouseover", (e) => {
            let tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
        })*/

        return line1;
    }
    updatePosition(){
        this.svg.setAttribute('x1',this.x1);
        this.svg.setAttribute('y1',this.y1);
        this.svg.setAttribute('x2',this.x2);
        this.svg.setAttribute('y2',this.y2);
    }
    updateConnectionWeight(weight){
        this.weight = weight;
        this.svg.setAttribute("stroke-width", Math.abs(weight)*2+1);
        if(weight < 0){
            this.svg.setAttribute("stroke", "red");
        }
        else{
            this.svg.setAttribute("stroke", "green");
        }
        this.svgTooltip.textContent = "Waga połączenia: " + weight;
    }
}

export {Connection}