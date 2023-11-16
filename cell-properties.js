// storage
let collectedSheetDB=[];
let sheetDB = [];
sheetAddIcon.click();

// for(let i=0; i<rows ;i++){
//     let sheetRow=[];
//     for(let j=0;j<cols;j++){
//         let cellProp={
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             fontFamily: "serif",
//             fontSize: "16",
//             fontColor: "#000000",
//             bgColor: "#000000",
//             value: "" ,
//             formula: "",
//             children : []         // just for indication purpose 
//         }
//         sheetRow.push(cellProp);
//     }
//     sheetDB.push(sheetRow);
// }

// Selectors for cell properties

let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let fontSize = document.querySelector(".font-size-prop");
let fontFamily = document.querySelector(".font-family-prop");
let fontColor = document.querySelector(".font-color-prop");
let bgColor = document.querySelector(".bg-color-prop");
let alignment= document.querySelectorAll(".alignment");
let leftAlign= alignment[0];
let centerAlign= alignment[1];
let rightAlign= alignment[2];
let formulaBar= document.querySelector(".formula-bar");
let activeColor = "#d1d8e0";
let inactiveColor= "#ecf0f1";


// Application of two way binding
// Attach property listners

bold.addEventListener("click", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal" ;
    bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
})
italic.addEventListener("click", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal" ;
    italic.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
})
underline.addEventListener("click", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none" ;
    underline.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
})
fontSize.addEventListener("change", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.fontSize = fontSize.value;
    cell.style.fontSize = cellProp.fontSize + "px" ;
    fontSize.value= cellProp.fontSize;
})
fontFamily.addEventListener("change", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.fontFamily = fontFamily.value;
    cell.style.fontFamily = cellProp.fontFamily;
    fontFamily.value= cellProp.fontFamily;
})
fontColor.addEventListener("change", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.fontColor = fontColor.value;
    cell.style.color = cellProp.fontColor;
    fontColor.value= cellProp.fontColor;
})
bgColor.addEventListener("change", (e)=>{
    let address= addressBar.value;
    let [cell, cellProp]= activeCell(address);
    //Modifications
    cellProp.bgColor = bgColor.value;
    cell.style.backgroundColor = cellProp.bgColor;
    bgColor.value= cellProp.bgColor;
})

alignment.forEach((alignElem) => {
     alignElem.addEventListener("click",(e)=>{
        let address= addressBar.value;
        let [cell, cellProp]= activeCell(address);

        let alignValue= e.target.classList[0];
        cellProp.alignment= alignValue;
        cell.style.textAlign= cellProp.alignment;

        switch(alignValue){
            case "left" :
                leftAlign.style.backgroundColor= activeColor;
                centerAlign.style.backgroundColor= inactiveColor;
                rightAlign.style.backgroundColor= inactiveColor;
                break;
            case "center":
                leftAlign.style.backgroundColor= inactiveColor;
                centerAlign.style.backgroundColor= activeColor;
                rightAlign.style.backgroundColor= inactiveColor;
                break;
            case "right":
                leftAlign.style.backgroundColor= inactiveColor;
                centerAlign.style.backgroundColor= inactiveColor;
                rightAlign.style.backgroundColor= activeColor;
                break;
        }
     })
     
});

let allCells= document.querySelectorAll(".cell");
for(let i=0;i<allCells.length;i++){
    addListenerToAttachCellProperties(allCells[i]);
}

function addListenerToAttachCellProperties(cell){
    cell.addEventListener("click",(e)=>{
        let address= addressBar.value;
        let [rid,cid]= decodeRIDCIDfromAddress(address);
        let cellProp= sheetDB[rid][cid];
        // apply cell properties
        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        cell.style.fontSize = cellProp.fontSize + "px";
        cell.style.fontFamily = cellProp.fontFamily;
        cell.style.color = cellProp.fontColor;
        cell.style.backgroundColor = cellProp.bgColor === "#000000" ? "transparent" : cellProp.bgColor;
        cell.style.textAlign = cellProp.alignment;

          // apply properties ui props container      
        bold.style.backgroundColor = cellProp.bold ? activeColor : inactiveColor;
        italic.style.backgroundColor = cellProp.italic ? activeColor : inactiveColor;
        underline.style.backgroundColor = cellProp.underline ? activeColor : inactiveColor;
        fontSize.value= cellProp.fontSize;
        fontFamily.value= cellProp.fontFamily;
        fontColor.value= cellProp.fontColor;
        bgColor.value= cellProp.bgColor;
        switch(cellProp.alignment){
            case "left" :
                leftAlign.style.backgroundColor= activeColor;
                centerAlign.style.backgroundColor= inactiveColor;
                rightAlign.style.backgroundColor= inactiveColor;
                break;
            case "center":
                leftAlign.style.backgroundColor= inactiveColor;
                centerAlign.style.backgroundColor= activeColor;
                rightAlign.style.backgroundColor= inactiveColor;
                break;
            case "right":
                leftAlign.style.backgroundColor= inactiveColor;
                centerAlign.style.backgroundColor= inactiveColor;
                rightAlign.style.backgroundColor= activeColor;
                break;
        }
        formulaBar.value= cellProp.formula;
        cell.innerText = cellProp.value;
    })
}


function activeCell(address){
    let [rid, cid] = decodeRIDCIDfromAddress(address);
    let cell= document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`)
    let cellProp= sheetDB[rid][cid];
    return [cell, cellProp];

}

function decodeRIDCIDfromAddress(address){
    let rid= Number(address.slice(1))-1;
    let cid= Number(address.charCodeAt(0))-65;
    return [rid,cid];
}

