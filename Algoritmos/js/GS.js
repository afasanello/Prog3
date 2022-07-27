// Vis JS, for graph visualization
var shadowState = false;
var nodesArrayPrev, nodesPrev;
var edgesArrayPrev, edgesPrev;
var networkPrev;
var delay = 500;

// GS
var prefM = [], prefW = [];
var freeM = []; // Array treated as a queue
var next = []; // For each proposing, save next proposed.
var current = []; // Save the current proposed's partner.
var ranking = []; // Save the proposing ranking for each proposed.

// Colors
const selectedNode = 'rgba(255, 150, 150, 1)';
const unselectedNode = 'rgba(150, 150, 255, 1)';
const selectedEdge = 'rgba(255, 0, 0, 1)';
const unselectedEdge = 'rgba(150, 150, 255, 1)';

// Generator
const state = {
    timeoutId: 0,
    generatorInstance: 0
}

document.addEventListener("DOMContentLoaded", () => {
    startGraph();
});


// Vis JS visualization
function startGraph() {

    // Create nodes
    nodesArrayPrev = [];
    for(let i = 0; i < 10; i++) {
        if(i%2 === 0) nodesArrayPrev.push({ id: i, label: 'M' + (Math.floor(i/2) + 1).toString(), x: 0, y: 100*Math.floor(i/2), color: unselectedNode });
        else nodesArrayPrev.push({ id: i, label: 'W' + (Math.floor(i/2) + 1).toString(), x: 150, y: 100*Math.floor(i/2), color: unselectedNode });
    }
    nodesPrev = new vis.DataSet(nodesArrayPrev);
  
    // Create all edges
    edgesArrayPrev = [];
    for(let i = 0; i < 10; i += 2) {
        for(let j = 1; j < 10; j += 2) {
            edgesArrayPrev.push({ id: 'E_' + i + '_' + j, from: i, to: j, color: "#FFFFFF" });
        }
    }
    edgesPrev = new vis.DataSet(edgesArrayPrev);

    var containerPrev = document.getElementById('network_0');
    
    var options = {
        physics: {
            enabled: false
        },
        width: '100%',
        height: '100%'
    };

    var dataPrev = {
        nodes: nodesPrev,
        edges: edgesPrev,
    };

    networkPrev = new vis.Network(containerPrev, dataPrev, options);

    // Generate preferences lists
    for(let i = 0; i < 5; i++) {
        prefM.push([]);
        prefW.push([]);
        for(let j = 0; j < 5; j++) {
            prefM[i].push(j);
            prefW[i].push(j);
        }

        let prefMAux = [];
        let prefWAux = [];

        while (prefM[i].length) {

            var randomIndex = Math.floor(Math.random() * prefM[i].length),
                element = prefM[i].splice(randomIndex, 1)
         
            prefMAux.push(element[0]);
        
        }

        while (prefW[i].length) {

            var randomIndex = Math.floor(Math.random() * prefW[i].length),
                element = prefW[i].splice(randomIndex, 1)
         
            prefWAux.push(element[0]);
        
        }

        prefM[i] = [...prefMAux];
        prefW[i] = [...prefWAux];
    }

    setPreferencesLists(prefM, prefW);
}


// GS algorithm
function* GS() {
    
    var t = 0;

    let proponentArr = [];
    let proposedArr = [];
    
    markElement('proponent', []);
    markElement('proposed', []);

    next = [];
    current = [];
    ranking = [];

    yield t;
    t++;

    freeM = newQueue();

    ranking = new Array(prefW.length);

    for(let i = 0; i < prefW.length; i++) {
        current.push(null);
        ranking[i] = new Array(prefM.length);
    }

    for(let i = 0; i < prefM.length; i++) {
        enqueue(i);
        next.push(0);

        for(let j = 0; j < prefW.length; j++) {
            ranking[j][prefW[j][i]] = i;
        }
    }

    setQueue(freeM);
    setArrays();
    setM();
    hideEdgesPrev();
    markLines([3, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17]);
    
    yield t;
    t++;
    
    
    while(!isEmpty()) {
        markLines([20]);
        markElement('mfree', [0]);
        markElement('man', []);
        yield t;
        t++;
        
        let m = peek();
        setM(m)
        markNodePrev(2*m);
        
        freeM = dequeue();
        setQueue(freeM);
        
        markElement('mfree', []);
        markElement('man', [0]);
        markLines([22]);
        yield t;
        t++;
        
        let w = prefM[m][next[m]];
        markNodePrev(2*w + 1);

        markLines([24]);
        yield t;
        t++;

        next[m]++;
        setArrays();
        markElement('next', [m]);
        markLines([25]);
        yield t;
        t++;
        
        markElement('next', []);

        if(current[w] === null) {
            markLines([27]);
            yield t;
            t++;
            
            current[w] = m;
            proponentArr.push(5*m + next[m] - 1);
            markElement('proponent', proponentArr);
            proposedArr.push(5*w + ranking[w][m]);
            markElement('proposed', proposedArr);
            markElement('current', [w]);
            markEdgePrev(`E_${2*m}_${2*w + 1}`);
            setArrays();
            markLines([28]);
            yield t;
            t++;

            markElement('current', []);
            yield t;
            t++;
        } else {
            markLines([27]);
            yield t;
            t++;
            markLines([29]);
            yield t;
            t++;
            
            let m2 = current[w];
            markNodePrev(2*m2);
            markLines([30]);
            yield t;
            t++;
            
            if(ranking[w][m] > ranking[w][m2]) {
                markLines([31]);
                markElement('ranking', [5*w + m, 5*w + m2]);
                yield t;
                t++;

                enqueue(m);
                setQueue(freeM);
                markElement('ranking', []);
                markLines([32]);
                yield t;
                t++;
            } else {
                markLines([31]);
                markElement('ranking', [5*w + m, 5*w + m2]);
                yield t;
                t++;

                markLines([33]);
                markElement('ranking', []);
                yield t;
                t++;

                enqueue(m2);
                setQueue(freeM);

                proponentArr = proponentArr.filter((elem) => elem < 5*m2 || elem > 5*m2 + 4);
                proponentArr.push(5*m + next[m] - 1);
                markElement('proponent', proponentArr);
                
                markLines([34]);
                yield t;
                t++;
                
                
                markEdgePrev(`E_${2*current[w]}_${2*w + 1}`, false);
                current[w] = m;
                markElement('current', [w]);
                markEdgePrev(`E_${2*current[w]}_${2*w + 1}`);
                setArrays();

                proposedArr = proposedArr.filter((elem) => elem < 5*w || elem > 5*w + 4);
                proposedArr.push(5*w + ranking[w][m]);
                markElement('proposed', proposedArr);

                markLines([35]);
                yield t;
                t++;

                markElement('current', []);
                yield t;
                t++;
            }
        }
        
        
        unmarkAllNodes();

    }
    
    
    markElement('man', []);
    unmarkAllNodes();
    setQueue(freeM);
    setArrays();
    setM();
    markLines([41, 42]);
    yield t;
    t++;

    markLines([]);
    yield t;
    t = -1;
}


// Operations for lists
function setPreferencesLists(M, W) {
    let listsM = document.getElementsByClassName('proponent');
    let listsW = document.getElementsByClassName('proposed');

    for(let i = 0; i < listsM.length; i++) {
        listsM[i].innerText = '';
        listsW[i].innerText = '';
    }

    for(let i = 0; i < M.length; i++) {
        for(let j = 0; j < M[i].length; j++) {
            document.getElementById(`proponent_${i+1}_${j}`).innerText = 'W' + (M[i][j] + 1);
            document.getElementById(`proposed_${i+1}_${j}`).innerText = 'M' + (W[i][j] + 1);
        }
    }
}

function setQueue(queue) {
    let q = document.getElementsByClassName('mfree');
    for(let i = 0; i < q.length; i++) {
        q[i].innerText = '';
    }

    for(let i = 0; i < queue.length; i++) {
        document.getElementById(`mfree_${i}`).innerText = 'M' + (freeM[i] + 1);
    }   
}

function setArrays() {
    let n = document.getElementsByClassName('next');
    let c = document.getElementsByClassName('current');
    let r = document.getElementsByClassName('ranking');

    for(let i = 0; i < n.length; i++) {
        n[i].innerText = '';
        c[i].innerText = '';
    }

    for(let i = 0; i < r.length; i++) {
        r[i].innerText = '';
    }

    for(let i = 0; i < next.length; i++) {
        n[i].innerText = next[i] + 1;
    }

    for(let i = 0; i < current.length; i++) {
        if(current[i] != null) c[i].innerText = 'M' + (current[i] + 1);
    }

    if(ranking && ranking.length > 0) {
        for(let i = 0; i < ranking.length; i++) {
            if(ranking[i] && ranking[i].length > 0) {
                for(let j = 0; j < ranking[i].length; j++) {
                    document.getElementById(`ranking_${i+1}_${j}`).innerText = ranking[i][j] + 1;
                }
            } 
        }
    }
}

function setM(m = -1) {
    if(m !== -1) document.getElementsByClassName('man')[0].innerText = 'M' + (parseInt(m) + 1);
    else document.getElementsByClassName('man')[0].innerText = '';
}


// Operations for generator
function start() {
    if(state.timeoutId === 0) {
        state.generatorInstance = GS();   
        state.timeoutId = setInterval(() => nextStep(), delay);
    }
}

function nextStep() {
    let next = state.generatorInstance.next();
    if(isNaN(next.value)) {
        stop();
        state.generatorInstance = 0;
    }
}

function stop() {
    clearTimeout(state.timeoutId);
    state.timeoutId = 0;
}


// Mark operations
function markLines(arrLines) {
    let lines = document.getElementsByClassName('line');
    for(let i = 0; i < lines.length; i++) {
        lines[i].className = 'line';
    }

    for(let i = 0; i < arrLines.length; i++) {
        lines[arrLines[i]].className = 'line selected';
    }
}

function unmarkAllNodes() {
    for(let i = 0; i < 10; i++) {
        nodesPrev.update([{ id: i, color: unselectedNode }]);
    }
}

function markNodePrev(nodeId, mark = true) {
    if(mark) nodesPrev.update([{ id: nodeId, color: selectedNode }]);
    else nodesPrev.update([{ id: nodeId, color: unselectedNode }]);
}

function markEdgePrev(edgeId, mark = true) {
    if(mark) edgesPrev.update([{ id: edgeId, color: selectedEdge }]);
    else edgesPrev.update([{ id: edgeId, color: '#FFFFFF' }]);
}

function hideEdgesPrev() {
    for(let i = 0; i < 10; i += 2) {
        markNodePrev(i, false);
        for(let j = 1; j < 10; j += 2) {
            edgesPrev.update([{ id: `E_${i}_${j}`, color: '#FFFFFF' }]);
        }
    }
}

function markElement(table, arr) {
    for(let i = 0; i < document.getElementsByClassName(table).length; i++) {
        document.getElementsByClassName(table)[i].classList.remove('markedBorder');
    }
    for(let i = 0; i < arr.length; i++) {
        document.getElementsByClassName(table)[arr[i]].classList.add('markedBorder');
    }
}


// Reset operations
function resetAllNodes() {
    nodesPrev.clear();
    edgesPrev.clear();

    nodesPrev.add(nodesArrayPrev);
    edgesPrev.add(edgesArrayPrev);
}

function resetGraphs() {
    if (networkPrev !== null) {
        networkPrev.destroy();
        networkPrev = null;
    }

    startGraph();
}


// Queue operations
function newQueue() {
    return [];
}

function enqueue(elem) {
    freeM.push(elem);
}

function dequeue() {
    return freeM.filter((elem, i) => {
        return i !== 0;
    })
}

function peek() {
    return freeM[0];
}

function isEmpty() {
    return freeM.length === 0;
}