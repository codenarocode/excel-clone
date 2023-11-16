let ctrlKey;
document.addEventListener("keydown",(e)=>{
    ctrlKey=e.ctrlKey;
})

document.addEventListener("keyup",(e)=>{
    ctrlKey=e.ctrlKey;
})

for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
     let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
       handleSelectedCells(cell);
    }
}
let cutBtn=document.querySelector(".cut");
let copyBtn=document.querySelector(".copy");
let pasteBtn=document.querySelector(".paste");
let rangeStorage=[];
function handleSelectedCells(cell){
    cell.addEventListener("click",(e)=>{
         if(!ctrlKey)return;
         if(rangeStorage.length>=2){
            defaultSelectedCellsUI();
            rangeStorage=[];
         }

         cell.style.border= "3px solid #218c74";
         let rid= Number(cell.getAttribute("rid"));
         let cid= Number(cell.getAttribute("cid"));
         rangeStorage.push([rid,cid]);
         copyData=[];

    })
}

function defaultSelectedCellsUI(){
    for(let i=0;i<rangeStorage.length;i++){
        let cell=document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border= "1px solid #dfe4ea";
    }
}

let copyData=[];
copyBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2)return;
    copyData=[];
    let stRow=rangeStorage[0][0];
    let stCol=rangeStorage[0][1];
    let endRow=rangeStorage[1][0];
    let endCol=rangeStorage[1][1];
    for(let i=stRow;i<=endRow;i++){
        let copyRow=[];
        for(let j=stCol;j<=endCol;j++){
            copyRow.push(sheetDB[i][j]);
        }
        copyData.push(copyRow);
    }
    defaultSelectedCellsUI();
   
})

cutBtn.addEventListener("click",(e)=>{
    if(rangeStorage.length<2|| copyData.length!==0)return;
    
    let stRow=rangeStorage[0][0];
    let stCol=rangeStorage[0][1];
    let endRow=rangeStorage[1][0];
    let endCol=rangeStorage[1][1];
   
    for(let i=stRow;i<=endRow;i++){
        
        for(let j=stCol;j<=endCol;j++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            
            //props update

            let cellProp=sheetDB[i][j];
            
            cellProp.value="";
            cellProp.bold=false;
            cellProp.italic=false;
            cellProp.underline=false;
            cellProp.alignment="left";
            cellProp.fontFamily="serif";
            cellProp.fontSize="16";
            cellProp.fontColor="#000000";
            cellProp.bgColor="#000000";

            //UI update
            cell.click();
        }
        
    }
    defaultSelectedCellsUI();
})

pasteBtn.addEventListener("click", (e)=>{
    if(copyData.length===0 || rangeStorage.length<2)return;

    let rowDiff= Math.abs(rangeStorage[1][0]-rangeStorage[0][0]);
    let colDiff=Math.abs(rangeStorage[1][1]-rangeStorage[0][1]);

    let address= addressBar.value;
    let [stRow,stCol]=decodeRIDCIDfromAddress(address);
    for(let i=stRow,r=0;i<=stRow+rowDiff;i++,r++){
        for(let j=stCol,c=0;j<=stCol+colDiff;j++,c++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if(!cell)continue;

            //props update
            let cellProp=sheetDB[i][j];
            let data=copyData[r][c];
            cellProp.value=data.value;
            cellProp.bold=data.bold;
            cellProp.italic=data.italic;
            cellProp.underline=data.underline;
            cellProp.alignment=data.alingment;
            cellProp.fontFamily=data.fontFamily;
            cellProp.fontSize=data.fontSize;
            cellProp.fontColor=data.fontColor;
            cellProp.bgColor=data.bgColor;

            //UI update
            cell.click();
        }
    }
})