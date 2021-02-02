function functionCheck(submittedFunction, sampleNumber, rangeMin, rangeMax){
    console.log("Size: ",sampleNumber)
    let scope = {
        x: 0
    }

    let data = [];
    for(let i = rangeMin; i<=rangeMax;i += (rangeMax-rangeMin)/(sampleNumber-1)){
        data.push({x: i});
    }
    try {
        data.forEach(dict => {
            scope.x = dict.x;

            let equation = math.evaluate(submittedFunction, scope);
            dict.y = equation;
        })
    }
    catch (e)
    {
        return "Error";
    }
    for(let i = 0; i<data.length;i++){
        if(!isRealNumber(data[i].y)){
            data.splice(i,1);
            i--;
        }

    }
    if(data.length < 2){
        return "Error";
    }

    return data;
}
function isRealNumber(n){
    return typeof n == 'number' && !isNaN(n) && isFinite(n);
}

export {functionCheck}