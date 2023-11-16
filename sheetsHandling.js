
let sheetAddIcon= document.querySelector(".sheet-add-icon");
let sheetFolderCont= document.querySelector(".sheet-folder-cont");

sheetAddIcon.addEventListener("click",(e)=>{
      let sheet= document.createElement("div");
      sheet.setAttribute("class","sheet-folder");
      let allSheetFolders= document.querySelectorAll(".sheet-folder");
      sheet.setAttribute("id",allSheetFolders.length);
      sheet.innerHTML=`
      <div class="sheet-content">Sheet ${allSheetFolders.length + 1}</div>
      `;
      sheetFolderCont.appendChild(sheet);
      sheet.scrollIntoView();
      createSheetDB();
      createGraphComponentMatrix();
      handleSheetActiveness(sheet);
      handleSheetRemoval(sheet);
      sheet.click();
});

function handleSheetRemoval(sheet){
    sheet.addEventListener("mousedown", (e)=>{
          if(e.button !== 2)return;
          let allSheetFolders= document.querySelectorAll(".sheet-folder");
          if(allSheetFolders.length===1){
            alert("You need to have atleast one sheet!!");
            return;
          }
          let response= confirm("Your sheet will be removed permanently, Are you sure?")

          if(response === false) return;

          //remove this sheet properties and graph relations from db;
           let sheetIdx= sheet.getAttribute("id");
           collectedSheetDB.splice(sheetIdx,1);
           collectedGraphComponent.splice(sheetIdx,1);

           // remove UI of that sheet and rearrange the UI of remaining sheets
           //Now default sheet will be sheet1

           handleSheetUIRemoval(sheet);

           // By Default set DB to Sheet1
            sheetDB=collectedSheetDB[0];
            graphComponentMatrix=collectedGraphComponent[0];
            handleSheetProperties();
        });
}

function handleSheetUIRemoval(sheet){
      sheet.remove();
      let allSheetFolders= document.querySelectorAll(".sheet-folder");
      for(let i=0; i<allSheetFolders.length;i++){
         allSheetFolders[i].setAttribute("id",i);
         let sheetContent= allSheetFolders[i].querySelector(".sheet-content");
         sheetContent.innerText= `Sheet ${i+1}`;
         allSheetFolders[i].style.backgroundColor="transparent";
      }
      allSheetFolders[0].style.backgroundColor="#ced6e0";
}

function handleSheetDB(sheetIdx){
    sheetDB= collectedSheetDB[sheetIdx];
    graphComponentMatrix=collectedGraphComponent[sheetIdx];
}

function handleSheetProperties(){
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            let cell=document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.click();
        }
    }
    let firstCell = document.querySelector(".cell");
    firstCell.click();
}

function handleSheetUI(sheet){
    let allSheetFolders= document.querySelectorAll(".sheet-folder");
    for(let i=0;i<allSheetFolders.length;i++){
        allSheetFolders[i].style.backgroundColor = "transparent";

    }
    sheet.style.backgroundColor="#ced6e0";
}

function handleSheetActiveness(sheet){
    sheet.addEventListener("click",(e)=>{
        let sheetIdx=Number(sheet.getAttribute("id"));
        handleSheetDB(sheetIdx);
        handleSheetProperties();
        handleSheetUI(sheet);
    });
}

function createSheetDB(){
    let sheetDB = [];

    for(let i=0; i<rows ;i++){
        let sheetRow=[];
        for(let j=0;j<cols;j++){
            let cellProp={
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                fontFamily: "serif",
                fontSize: "16",
                fontColor: "#000000",
                bgColor: "#000000",
                value: "" ,
                formula: "",
                children : []         // just for indication purpose 
            }
            sheetRow.push(cellProp);
        }
        sheetDB.push(sheetRow);
    }
    collectedSheetDB.push(sheetDB);
}

function createGraphComponentMatrix(){
    let graphComponentMatrix=[];
    for(let i=0;i<rows;i++){
        let row = [];
        for(let j=0;j<cols;j++){
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}