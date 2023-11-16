
//create promise of setTimeOut to delay in coloring

function colorPromise(){
    return new Promise( (resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        },1000)
    });
}


async function isGraphCyclicTracePath(cycleResponse){
    let visited =[];
    let dfsVisited=[];
    let [srcr,srcc]=cycleResponse;
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

    let response = await dfsCycleDetectionTracePath(srcr,srcc,visited,dfsVisited);
    if(response === true) return Promise.resolve(true);
    return Promise.resolve(false);
}

async function dfsCycleDetectionTracePath(i,j,visited,dfsVisited){
    let cell= document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
    if(visited[i][j]){
        if(dfsVisited[i][j]){
            cell.style.backgroundColor="lightsalmon";
            await colorPromise();
            cell.style.backgroundColor="lightblue";
            await colorPromise ();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    visited[i][j]=true;
    dfsVisited[i][j]=true;
    cell.style.backgroundColor="lightblue";
    await colorPromise();
    for(let k=0;k<graphComponentMatrix[i][j].length;k++){
        let child= graphComponentMatrix[i][j][k];
        let response = await dfsCycleDetectionTracePath(child[0],child[1],visited,dfsVisited)
        if(response === true ){
            cell.style.backgroundColor="transparent";
            await colorPromise();
            return Promise.resolve(true);
        }

    }
    dfsVisited[i][j]=false;
    cell.style.backgroundColor="transparent";
    await colorPromise();
    return Promise.resolve(false);

}
