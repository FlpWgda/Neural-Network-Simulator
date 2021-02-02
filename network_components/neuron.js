import {neuronRadius, svgMain, hiddenLayers} from "../app.js";

class Neuron {
    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
        this.svg;
        this.chart;
        this.tooltipCanvas;
        this.tooltipChart;
        this.leftConnections = [];
        this.rightConnections = [];

        this.createElement();
    }
    createElement(){
        const svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg1.setAttribute('width',neuronRadius*4);
        svg1.setAttribute('height',neuronRadius*4);
        //svg1.style.position = 'absolute';
        svg1.setAttribute('x',this.x-neuronRadius);
        svg1.setAttribute('y',this.y-neuronRadius);
        const g1 = document.createElementNS("http://www.w3.org/2000/svg", "g");

        svg1.classList.add("neuron-chart");
        g1.classList.add("neuron-chart");
        this.svg = svg1;



        const cir1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        cir1.setAttribute("cx", neuronRadius*2);
        cir1.setAttribute("cy", neuronRadius*2);
        cir1.setAttribute("r", neuronRadius);
        cir1.setAttribute("stroke", 'black');
        cir1.setAttribute("stroke-width", 2);
        cir1.setAttribute("fill", "rgb(152, 152, 103)");
        g1.appendChild(cir1);

        const foreignObject1 = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        svg1.append(foreignObject1);
        foreignObject1.setAttribute('width','100%');
        foreignObject1.setAttribute('height','100%');
        //foreignObject1.setAttribute('x',20);
        //foreignObject1.setAttribute('y',20);

        const divForChart = document.createElement("div");
        divForChart.style.position = "relative";
        divForChart.style.left = -neuronRadius/2 + 'px';
        divForChart.style.top = neuronRadius*0.75 + 'px';
        divForChart.style.height = 40 + 'px';
        divForChart.style.width = 100 + 'px';
        divForChart.style.overflow = "hidden";
        //divForChart.style.verticalAlign = 'middle';
        divForChart.classList.add("neuron2");
        foreignObject1.appendChild(divForChart);
        const canvas = document.createElement("canvas");
        canvas.classList.add("canvasBorder");
        canvas.height = 50;
        canvas.width = 99;
        //const ctx = canvas.getContext('2d');
        //canvas.setAttribute('width',neuronRadius*2);
        //canvas.setAttribute('height',neuronRadius*2);
        //canvas.classList.add("icon");
        divForChart.appendChild(canvas);

        this.chart = new Chart(canvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'prediction',
                    data: [],
                    backgroundColor:
                        'rgba(240, 129, 132, 0.2)',
                    borderColor:
                        'rgba(28, 0, 132, 1)',
                    borderWidth: 1,
                    pointRadius: 0,
                    type: 'line',
                    fill:'none'},
                    {
                        label: 'function',
                        data: [],
                        backgroundColor:
                            'rgba(255, 99, 132, 0.2)',
                        borderColor:
                            'red',
                        borderWidth: 1,
                        pointRadius: 0,
                        type: 'line',
                        fill:'none'}
                ]
            },
            options: {
                layout: {
                    padding: {
                        left: 0,
                        right: 10,
                        top: 10,
                        bottom: 0
                    },
                    borderRadius: '50%'
                },
                scales: {
                    y: {
                        gridLines: {
                            display:false,
                            drawBorder: true,
                            lineWidth: 0,
                            color: 'black',
                            ticks: {
                                display: false
                            }
                        },
                        ticks: {
                            display: false,
                        }
                    },
                    x: {
                        gridLines: {
                            display:false,
                            drawBorder: true,
                            lineWidth: 0,
                            color: 'black'
                        },
                        ticks: {
                            display: false,
                        }
                    }
                },
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                //aspectRatio: 2.7,
                responsive: false
            }
        });
        /*ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        for (var i = 0; i < 40; i++)
        {
            var x = i,
                y = i;
            ctx.lineTo(x, y);
        }
        ctx.stroke();*/

        /*const text1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text1.setAttribute("font-size","15px");
        text1.setAttribute("text-anchor", "middle");
        text1.setAttribute("dominant-baseline","central");
        text1.setAttribute("x", '50%');
        text1.setAttribute("y", '48%');
        //console.log(this.value)
        text1.textContent = Math.round((this.value + Number.EPSILON) * 100) /100;

        g1.appendChild(text1);*/
        //g1.setAttribute('width',40)
        //g1.setAttribute('height',40)
        this.tooltipCanvas = document.createElement("canvas");
        this.tooltipCanvas.style.backgroundColor = '#a9bfc4';
        this.tooltipCanvas.style.position = 'fixed';
        this.tooltipCanvas.width = 200;
        this.tooltipCanvas.height = 250;
        this.tooltipChart = new Chart(this.tooltipCanvas, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Predykcje',
                    data: [],
                    backgroundColor:
                        'rgba(240, 129, 132, 0.2)',
                    borderColor:
                        'rgba(28, 0, 132, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    type: 'line',
                    fill:'none'},
                    {
                        label: 'Funkcja',
                        data: [],
                        backgroundColor:
                            'rgba(255, 206, 86, 0.2)',
                        borderColor:
                            'red',
                        borderWidth: 2,
                        type: 'line',
                        fill: 'none',
                        pointRadius: 0
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            //beginAtZero: true
                        }
                    },
                    x: {
                        ticks: {
                            //beginAtZero: true
                        }
                    }
                },
                maintainAspectRatio: false,
                responsive: false
            }
        })

        svg1.addEventListener("mouseover", (e) =>{
            hiddenLayers.appendChild(this.tooltipCanvas);
            this.tooltipCanvas.style.left = e.clientX+10 + 'px';
            this.tooltipCanvas.style.top = e.clientY-e.clientY*0.3 + 'px';

        })
        svg1.addEventListener("mouseout", (e) =>{
            hiddenLayers.removeChild(this.tooltipCanvas);

        })

        svg1.appendChild(g1);
        svgMain.appendChild(svg1);

        /*g1.addEventListener("mouseover", (e) => {

            //svgMain.removeChild(svg1);
            svgMain.appendChild(svg1);
            console.log("Append");
            //myChart.data.datasets[0].data[2] = 80;
            divForChart.style.width = '70px';
            divForChart.style.height = '60px';
            divForChart.style.top = neuronRadius/2 + 'px';
            divForChart.style.left = neuronRadius/2 + 'px';
        });
        g1.addEventListener("mouseleave", (e) => {
            divForChart.style.width = '60px';
            divForChart.style.height = '60px';
            divForChart.style.left = neuronRadius/1.4 + 'px';
            divForChart.style.top = neuronRadius + 'px';
            //svgMain.insertBefore(svg1,this.rightConnections[0]);
        });*/

        return svg1
    }
    updatePosition(){
        this.svg.setAttribute("x",this.x-neuronRadius);
        this.svg.setAttribute("y",this.y-neuronRadius);
        this.leftConnections.forEach(connection =>{
            connection.x1 = this.x+neuronRadius*2;
            connection.y1 = this.y+neuronRadius;
            connection.updatePosition();
        });
        this.rightConnections.forEach(connection =>{
            connection.x2 = this.x;
            connection.y2 = this.y+neuronRadius;
            connection.updatePosition();
        })
    }
    updateChartsFunction(data){

        this.chart.data.datasets[1].data = data;
        this.chart.update();
        this.tooltipChart.data.datasets[1].data = data;
        this.tooltipChart.update();
    }
    updateChartsPredictions(data){

        this.chart.data.datasets[0].data = data;
        this.chart.update();
        this.tooltipChart.data.datasets[0].data = data;
        this.tooltipChart.update();

    }
}

export {Neuron}