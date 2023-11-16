//storage of parent child relation
let collectedGraphComponent=[];
let graphComponentMatrix=[];
// for(let i=0;i<rows;i++){
//     let row = [];
//     for(let j=0;j<cols;j++){
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }
// checking whether graph is cyclic or not

function isGraphCyclic(){
    let visited =[];
    let dfsVisited=[];

    for(let i=0;i<rows;i++){
        let visitedRow=[];
        let dfsVisitedRow=[];
        for(let j=0;j<cols;j++){
            visitedRow.push(false);
            dfsVisitedRow.push(false);

        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }
    for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            if(dfsCycleDetection(i,j,visited,dfsVisited))return [i,j];
        }
    }
    return null;
}

function dfsCycleDetection(i,j,visited,dfsVisited){
    
    if(visited[i][j]){
        if(dfsVisited[i][j])return true;
        return false;
    }

    visited[i][j]=true;
    dfsVisited[i][j]=true;
    for(let k=0;k<graphComponentMatrix[i][j].length;k++){
        let child= graphComponentMatrix[i][j][k];
        if(dfsCycleDetection(child[0],child[1],visited,dfsVisited))return true;

    }
    dfsVisited[i][j]=false;
    return false;

}
