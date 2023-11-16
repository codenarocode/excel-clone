
for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        let cell= document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e)=>{
              let address= addressBar.value;
              let [activecell,cellProp]= activeCell(address);
              let enteredData = activecell.innerText;
            //   console.log(1);
            //   console.log(enteredData);
            //   console.log(cellProp.value);
              if(enteredData == cellProp.value) return;
              cellProp.value = enteredData;
              // if data modifies remove p-c relation, formulabar empty and update child according to new hardcoded value

              removeChildFromParent(cellProp.formula);
              removeChildFromGraphComponent(cellProp.formula,address);
              cellProp.formula= "";
              updateChildrenCells(address);
              
        })
    }
}



formulaBar.addEventListener("keydown", async (e)=>{
     let formula= formulaBar.value;
     if(e.key=="Enter" && formula){
        // if change in formula, break old parent child relation, and evalute new formula and parent child relation
        let address= addressBar.value;
        let[cell, cellProp] =activeCell(address);
        
        addChildToGraphComponent(formula,address);
        // check formula is cyclic or not then only evalute
        let cycleResponse= isGraphCyclic();
        console.log (cycleResponse);
        if(cycleResponse){
            let response = confirm("Your formula is cyclic. Do you want to trace cyclic path");
            while(response){
                //keepon tracking colored path until response given by user is false
                await isGraphCyclicTracePath(cycleResponse);
                response=confirm("Your formula is cyclic. Do you want to trace cyclic path");
            }
            removeChildFromGraphComponent(formula,address);
            return;
        }
        removeChildFromParent(cellProp.formula);
        let evaluatedValue= evaluateFormula(formula);
        // To update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue,formula,address);
        addChildToParent(formula);
        updateChildrenCells(address);
        
     }
     
})

function addChildToGraphComponent(formula, childAddress){
    let [crid,ccid]= decodeRIDCIDfromAddress(childAddress);
    let encodedFormula= formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue= encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [prid,pcid]=decodeRIDCIDfromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].push([crid,ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress){
    let [crid,ccid]= decodeRIDCIDfromAddress(childAddress);
    let encodedFormula= formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue= encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [prid,pcid]=decodeRIDCIDfromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function updateChildrenCells(parentAddress){
    let [parentCell, parentCellProp]= activeCell(parentAddress);
    let children= parentCellProp.children;
    for(let i=0;i<children.length;i++){
        let childAddress=children[i];
        let [childCell,childCellProp]= activeCell(childAddress);
        let childFormula=childCellProp.formula;
        let evaluatedValue= evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue,childFormula,childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula){
    let encodedFormula= formula.split(" ");
    let childAddress= addressBar.value;
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue= encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
             let [parentCell,parentCellProp]=activeCell(encodedFormula[i]);
             parentCellProp.children.push(childAddress);
        }
    }
}
function removeChildFromParent(formula){
    let encodedFormula= formula.split(" ");
    let childAddress= addressBar.value;
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue= encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65 && asciiValue<=90){
             let [parentCell,parentCellProp]=activeCell(encodedFormula[i]);
             let idx= parentCellProp.children.indexOf(childAddress);
             parentCellProp.children.splice(idx,1);
        }
    }
}

function evaluateFormula(formula){
    let encodedFormula= formula.split(" ");
    for(let i=0;i<encodedFormula.length;i++){
        let asciiValue= encodedFormula[i].charCodeAt(0);
        if(asciiValue>=65&&asciiValue<=90){
            let [cell,cellProp]= activeCell(encodedFormula[i]);
            encodedFormula[i]=cellProp.value;
        }
    }
    let decodedFormula= encodedFormula.join(" ");
    return eval(decodedFormula);
}

function setCellUIAndCellProp(evaluatedValue, formula, address){
   
    let [cell, cellProp]= activeCell(address);
    cell.innerText= evaluatedValue;
    cellProp.formula=formula;
    cellProp.value= evaluatedValue;
}