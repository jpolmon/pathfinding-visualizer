import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra, getNodesInShortestPathOrder } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';
import getAllNodes from '../algorithms/utils/getAllNodes';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 35;

const getStartingGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const thisRow = [];
    for (let col = 0; col < 50; col++) {
      thisRow.push(createNode(row, col));
    }
    grid.push(thisRow);
  }
  return grid;
};

const createNode = (row, col) => {
  return {
    row,
    col,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isEnd: row === END_NODE_ROW && col === END_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false, 
    previousNode: null,
  };
};

const renderWalls = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}

const initialState = {
  grid: getStartingGrid(),
  mouseIsPressed: false,
}

export default class PathfindingVisualizer extends Component {  
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    this.initialState = this.state
  }

  reset() {
    const nodesObj = getAllNodes(this.initialState.grid);
    for (const node of nodesObj) {
      node.distance = Infinity;
      (node.row === START_NODE_ROW && node.col === START_NODE_COL) ? node.isStart = true : node.isStart = false;
      (node.row === END_NODE_ROW && node.col === END_NODE_COL) ? node.isEnd = true : node.isEnd = false;
      node.isWall = false;
    }
    
    const nodesHtml = document.querySelectorAll('.node');
    for (const node of nodesHtml) {
      node.classList.remove('node-visited', 'node-wall', 'node-shortest-path', 'node-start', 'node-end');
      const row = parseInt(node.id.split('-')[1]);
      const col = parseInt(node.id.split('-')[2]);
      if (row === START_NODE_ROW && col === START_NODE_COL) {
        node.classList.add('node-start');
      } 
      if (row === END_NODE_ROW && col === END_NODE_COL) {
        node.classList.add('node-end');
      }
    }
  }

  handleMouseDown(row, col) {
    const newGrid = renderWalls(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = renderWalls(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false })
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if(i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        if (!node.isStart && !node.isEnd) {  
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const endNode = grid[END_NODE_ROW][END_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(endNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }



  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
        <button onClick={() => this.reset()}>Reset Board</button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isStart, isEnd, isWall} = node;
                  return (
                    <Node
                      key = {nodeIdx}
                      col = {col}
                      isStart = {isStart}
                      isEnd = {isEnd}
                      isWall = {isWall}
                      mouseIsPressed = {mouseIsPressed}
                      onMouseDown = {(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter = {(row, col) =>
                      this.handleMouseEnter(row, col)
                    }
                    onMouseUp = {() => this.handleMouseUp()}
                    row = {row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
};

