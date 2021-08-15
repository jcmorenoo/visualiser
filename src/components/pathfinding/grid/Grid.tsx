import React from 'react';
import { IGrid, INode } from 'types'
import Node from '../node/Node';
import './Grid.css';

const GRID_WIDTH = 670;
const GRID_PADDING = 10;
const CONTAINER_SIZE = GRID_WIDTH - (2 * GRID_PADDING);
// padding: 10px;
// width: 630px;

type GridState = IGrid;

class Grid extends React.Component<{}, GridState> {
  constructor(props: {}) {
    super(props);
    const width = 20;
    const nodes: INode[][] = this.generateNodes(width);
    this.state = {
      width,
      nodes: nodes,
    }
    this.assignStartNode(nodes[0][0]);
    this.assignGoalNode(nodes[width-2][width-2]);
  }
  render() {
    const nodes: JSX.Element[] = [];
    const nodeSizeInPx = (CONTAINER_SIZE / this.state.width) - (2 * 0.4) //(total width 610 / number of nodes) - (2*margin)
    for (const row of this.state.nodes) {
      for (const node of row) {
        nodes.push(<Node node={{ ...node }} sizeInPx={nodeSizeInPx} key={`${node.colIndex}-${node.rowIndex}`}></Node>)
      }
    }
    return (
      <>
        <div className="grid" style={{ width: `${GRID_WIDTH}px`, padding: `${GRID_PADDING}px` }}>
          <div className="container">
            {nodes}
          </div>
        </div>
        <div className="control-group">
          <button onClick={this.setStart}>Set Start</button>
          <button onClick={this.setGoal}>Set Goal</button>
          <button onClick={this.restart}>Restart</button>
          <button onClick={this.start}>Start</button>
        </div>
      </>
    );
  }

  setStart() {
    console.log('set start');
  }
  setGoal() {
    console.log('set goal');
  }
  restart() {
    console.log('restart');
  }
  start() {
    console.log('start');
  }

  generateNodes(width: number): INode[][] {
    const nodes: INode[][] = [];
    for (let i = 0; i < width; i++) {
      const nodeRow: INode[] = [];
      for (let j = 0; j < width; j++) {
        nodeRow.push({
          rowIndex: i,
          colIndex: j,
          isGoal: false,
          isStart: false,
          isVisited: false,
          neighbours: []
        });
      }
      nodes.push(nodeRow);
    }
    return nodes;
  }

  assignGoalNode = (node: INode) => {
    if (node.isGoal) {
      node.isGoal = false;
      this.setState({
        goalNode: undefined,
      });
      return;
    }
    if (node.isStart) {
      return;
    }
    if (this.state.goalNode) {
      this.state.goalNode.isGoal = false;
    }
    node.isGoal = true;
    this.setState({
      goalNode: node
    });
  }

  assignStartNode = (node: INode) => {
    if (node.isStart) {
      node.isStart = false;
      this.setState({
        startNode: undefined,
      });
      return;
    }
    if (node.isGoal) {
      return;
    }
    if (this.state.startNode) {
      this.state.startNode.isStart = false;
    }
    node.isStart = true;
    this.setState({
      startNode: node
    });
  }
}

// const Grid = (props: GridProps): JSX.Element => {
//   // initialise grid
//   return 
// };

export default Grid;
