import React, { Component } from 'react';
import Node from './Node/Node';
import { dijkstra } from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const END_NODE_ROW = 10;
const END_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getStartingGrid();
    this.setState({ grid })
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

  visualizeDijkstra() {
    const { grid } = this.state;
  }



  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>Visualize Dijkstra's Algorithm</button>
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