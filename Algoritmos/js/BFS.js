// Vis JS, for graph visualization
var shadowState = false;
var nodesArray, nodes, nodesArrayPrev, nodesPrev;
var edgesArray, edgesArrayPrev, edges, edgesPrev;
var network, networkPrev;
var delay = 500;

// Graph
var adjacency = []; // For each node, save nodes adjacents to him.
var queue = []; // Array treated as a queue

// BFS
var visited = []; // For each node, save if visited or not.
var distance = []; // For each node, save distance from source node.
var parent = []; // For each node, save parent node.

// Colors
const selectedNode = 'rgba(255, 150, 150, 1)';
const unselectedNode = 'rgba(150, 150, 255, 1)';
const selectedEdge = 'rgba(255, 0, 0, 1)';
const unselectedEdge = 'rgba(150, 150, 255, 1)';

// Generator
const state = {
    timeoutId: 0,
    node: -1,
    generatorInstance: 0
}

document.addEventListener("DOMContentLoaded", () => {
    startGraph(7);
});


// Vis JS visualization
function startGraph(nNodes) {

    // Create nodes
    nodesArray = [];
    nodesArrayPrev = [];
    for(let i = 0; i < nNodes; i++) {
        nodesArray.push({ id: i, label: (i+1).toString(), color: unselectedNode });

        adjacency.push([]);
        visited.push(false);
        distance.push(-1);
        parent.push(null);
    }
    nodes = new vis.DataSet(nodesArray);
  
    // Create random edges
    edgesArray = [];
    edgesArrayPrev = [];
    for(let i = 0; i < nNodes; i++) {
        let adjacentEdges = Math.floor(Math.random() * (nNodes) + 1) - adjacency[i].length;
        let nonexistentNodes = [];
        for(let j = 0; j < nNodes; j++) {
            if(j !== i) nonexistentNodes.push(j);
        }
        for(let j = 0; j < adjacency[i].length; j++) {
            nonexistentNodes = nonexistentNodes.filter(elem => elem !== adjacency[i][j]);
        }
        for(let j = 0; j < adjacentEdges; j++) {
            if(nonexistentNodes.length > 0 && adjacency[i].length < 3) {
                let nodeToAdd = Math.floor(Math.random() * (nonexistentNodes.length));
                adjacency[i].push(nonexistentNodes[nodeToAdd]);
                adjacency[nonexistentNodes[nodeToAdd]].push(i);
                edgesArray.push({ id: 'E_' + i + '_' + nonexistentNodes[nodeToAdd], from: i, to: nonexistentNodes[nodeToAdd], color: unselectedEdge });
                edgesArrayPrev.push({ id: 'E_' + i + '_' + nonexistentNodes[nodeToAdd], from: i, to: nonexistentNodes[nodeToAdd], color: "#FFFFFF" })

                nonexistentNodes = nonexistentNodes.filter(elem => elem !== nonexistentNodes[nodeToAdd]);
            }
        }
    }
    edges = new vis.DataSet(edgesArray);
    edgesPrev = new vis.DataSet(edgesArrayPrev);
  
    for(let i = 0; i < adjacency.length; i++) {
        adjacency[i].sort(function(a, b){return a - b});
    }
    setAdjacencyLists(adjacency);

    var container = document.getElementById('network_0');
    var containerPrev = document.getElementById('network_1');
    
    var options = {
        physics: {
            enabled: false
        },
        width: '100%',
        height: '100%'
    };

    var data = {
      nodes: nodes,
      edges: edges,
    };
    
    network = new vis.Network(container, data, options);

    for(let i = 0; i < nNodes; i++) {
        let pos = network.getPosition(i);
        nodesArrayPrev.push({ id: i, label: (i+1).toString(), x: pos.x, y: pos.y, color: unselectedNode });
    }
    nodesPrev = new vis.DataSet(nodesArrayPrev);

    var dataPrev = {
        nodes: nodesPrev,
        edges: edgesPrev,
    };

    networkPrev = new vis.Network(containerPrev, dataPrev, options);
    

    network.on("dragging", params => {
        if(params.nodes.length > 0) nodesPrev.update([{ id: params.nodes[0], x: params.pointer.canvas.x, y: params.pointer.canvas.y }]);
    });

    networkPrev.on("dragging", params => {
        if(params.nodes.length > 0) nodes.update([{ id: params.nodes[0], x: params.pointer.canvas.x, y: params.pointer.canvas.y }]);
    });
}


// BFS algorithm
function* BFS(adj, nodeId) {
    
    var t = 0;

    for(let i = 0; i < adj.length; i++) {
        visited[i] = false;
        distance[i] = -1;
        parent[i] = null;

        hideEdgesPrev(adj);
    }
    setArrays();
    markLines([2, 5, 6, 7, 8, 9, 10]);
    yield t;
    t++;
    
    visited[nodeId] = true;
    setArrays();
    markLines([13]);
    markElement('visited', [nodeId]);
    yield t;
    t++;

    distance[nodeId] = 0;
    setArrays();
    markLines([14]);
    markElement('visited', []);
    markElement('distance', [nodeId]);
    yield t;
    t++;

    queue = newQueue();
    markLines([16]);
    markElement('distance', []);
    yield t;
    t++;

    enqueue(nodeId);
    setQueue(queue);
    setArrays();
    markLines([17]);
    yield t;
    t++;
    
    //markNodePrev(nodeId);
    
    while(!isEmpty(queue)) {
        markLines([19]);
        markElement('queue', [0]);
        markElement('vertex', []);
        yield t;
        t++;

        let u = peek();
        markNodePrev(u);
        markNodeOrig(u);
        queue = dequeue();
        setQueue(queue);
        setVertex(u);
        markElement('queue', []);
        markElement('vertex', [0]);
        markLines([21]);
        yield t;
        t++;

        for(let i = 0; i < adj[u].length; i++) {
            markLines([23]);
            yield t;
            t++;

            let v = adj[u][i];

            markEdgeOrig(`E_${u}_${v}`);
            markEdgeOrig(`E_${v}_${u}`);
            markLines([24]);
            markElement('adj', []);
            markElement('adj', [7*u + i]);
            markElement('visited', [v]);
            yield t;
            t++;

            if(!visited[v]) {
                visited[v] = true;
                setArrays();
                markLines([25]);
                markElement('visited', [v]);
                yield t;
                t++;

                distance[v] = distance[u] + 1;
                setArrays();
                markLines([26]);
                markElement('visited', []);
                markElement('distance', [v]);
                yield t;
                t++;

                parent[v] = u;
                setArrays();
                markLines([27]);
                markElement('distance', []);
                markElement('parent', [v]);
                yield t;
                t++;

                enqueue(v);
                setQueue(queue);
                setArrays();
                markLines([28]);
                markElement('parent', []);
                yield t;
                t++;

                markNodePrev(v);
                markEdgePrev(`E_${u}_${v}`);
                markEdgePrev(`E_${v}_${u}`);
                markLines([31]);
                yield t;
                t++;
            }

            markEdgeOrig(`E_${u}_${v}`, false);
            markEdgeOrig(`E_${v}_${u}`, false);
            yield t;
            t++;

        }

        markNodeOrig(u, false);
        yield t;
        t++;        
    }

    markLines([36]);
    yield t;
    t++;   

    markLines([]);
    setVertex();
    markElement('adj', []);
    markElement('queue', []);
    markElement('vertex', []);
    markElement('visited', []);
    markElement('distance', []);
    markElement('parent', []);
    yield t;
    t = -1;
}


// Operations for lists
function setAdjacencyLists(adjacency) {
    let adj = document.getElementsByClassName('adj');
    for(let i = 0; i < adj.length; i++) {
        adj[i].innerText = '';
    }

    for(let i = 0; i < adjacency.length; i++) {
        for(let j = 0; j < adjacency[i].length; j++) {
            document.getElementById(`adj_${i+1}_${j}`).innerText = adjacency[i][j] + 1;
        }
    }
}

function setQueue(queue) {
    let q = document.getElementsByClassName('queue');
    for(let i = 0; i < q.length; i++) {
        q[i].innerText = '';
    }

    for(let i = 0; i < queue.length; i++) {
        document.getElementById(`queue_${i}`).innerText = queue[i] + 1;
    }   
}

function setArrays() {
    let v = document.getElementsByClassName('visited');
    let d = document.getElementsByClassName('distance');
    let p = document.getElementsByClassName('parent');

    for(let i = 0; i < v.length; i++) {
        v[i].innerText = '';
        d[i].innerText = '';
        p[i].innerText = '';
    }

    for(let i = 0; i < visited.length; i++) {
        v[i].innerText = visited[i];
    }

    for(let i = 0; i < distance.length; i++) {
        d[i].innerText = distance[i];
    }

    for(let i = 0; i < parent.length; i++) {
        if(parent[i] != null) p[i].innerText = parent[i] + 1;
    }
}

function setVertex(vert = -1) {
    if(vert !== -1) document.getElementsByClassName('vertex')[0].innerText = parseInt(vert) + 1;
    else document.getElementsByClassName('vertex')[0].innerText = '';
}


// Operations for generator
function start() {
    if(state.timeoutId === 0 && parseInt(document.getElementById('startingNode').value) >= 1 && parseInt(document.getElementById('startingNode').value) <= 7) {
        if(state.node === -1) {
            state.node = parseInt(document.getElementById('startingNode').value);
            state.generatorInstance = BFS(adjacency, state.node - 1);   
        }
        state.timeoutId = setInterval(() => nextStep(), delay);
    }
}

function nextStep() {
    if(state.node !== -1) {
        let next = state.generatorInstance.next();
        if(isNaN(next.value)) {
            stop();
            state.node = -1;
            state.generatorInstance = 0;
        } 
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

function markNodeOrig(nodeId, mark = true) {
    if(mark) nodes.update([{ id: nodeId, color: selectedNode }]);
    else nodes.update([{ id: nodeId, color: unselectedNode }]);
}

function markNodePrev(nodeId, mark = true) {
    if(mark) nodesPrev.update([{ id: nodeId, color: selectedNode }]);
    else nodesPrev.update([{ id: nodeId, color: unselectedNode }]);
}

function markEdgeOrig(edgeId, mark = true) {
    if(mark) edges.update([{ id: edgeId, color: selectedEdge }]);
    else edges.update([{ id: edgeId, color: unselectedEdge }]);
}

function markEdgePrev(edgeId, mark = true) {
    if(mark) edgesPrev.update([{ id: edgeId, color: selectedEdge }]);
    else edgesPrev.update([{ id: edgeId, color: unselectedEdge }]);
}

function hideEdgesPrev(adj) {
    for(let i = 0; i < adj.length; i++) {
        markNodePrev(i, false);
        for(let j = 0; j < adj[i].length; j++) {
            edgesPrev.update([{ id: `E_${i}_${adj[i][j]}`, color: '#FFFFFF' }])
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
    nodes.clear();
    edges.clear();
    nodesPrev.clear();
    edgesPrev.clear();

    nodes.add(nodesArray);
    edges.add(edgesArray);
    nodesPrev.add(nodesArrayPrev);
    edgesPrev.add(edgesArrayPrev);

}

function resetGraphs() {
    if (network !== null) {
        network.destroy();
        network = null;
    }

    if (networkPrev !== null) {
        networkPrev.destroy();
        networkPrev = null;
    }

    startGraph(7);
}


// Queue operations
function newQueue() {
    return [];
}
function enqueue(elem) {
    queue.push(elem);
}

function dequeue() {
    return queue.filter((elem, i) => {
        return i !== 0;
    })
}

function peek() {
    return queue[0];
}

function isEmpty() {
    return queue.length === 0;
}