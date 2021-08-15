import React from 'react';
import { IGrid, INode } from 'types'
import Node from '../node/Node';
import './Grid.css';

const GRID_WIDTH = 670;
const GRID_PADDING = 10;
const CONTAINER_SIZE = GRID_WIDTH - (2 * GRID_PADDING);
// padding: 10px;
// width: 630px;

type GridState = IGrid & {
  delayInMs: number;
  isSelectingStart: boolean;
  isSelectingGoal: boolean;
};

class Grid extends React.Component<{}, GridState> {
  constructor(props: {}) {
    super(props);
    const delayInMs = 25;
    const width = 15;
    const nodes: INode[][] = this.generateNodes(width);
    const startNode = nodes[0][0];
    const goalNode = nodes[width - 1][width - 1];
    startNode.isStart = true;
    goalNode.isGoal = true;
    this.state = {
      width,
      nodes: nodes,
      startNode: startNode,
      goalNode: goalNode,
      delayInMs,
      isSelectingStart: false,
      isSelectingGoal: false,
    }
  }
  render() {
    const nodes: JSX.Element[] = [];
    const nodeSizeInPx = (CONTAINER_SIZE / this.state.width) - (2 * 0.4) //(total width 610 / number of nodes) - (2*margin)
    for (const row of this.state.nodes) {
      for (const node of row) {
        nodes.push(<Node node={{ ...node }} sizeInPx={nodeSizeInPx} key={`${node.colIndex}-${node.rowIndex}`} onClick={this.handleNodeClick}></Node>)
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
          <button onClick={this.randomiseWeightsOfNodes}>Random Weights</button>
          <button onClick={this.restart}>Restart</button>
          <button onClick={this.start}>Start</button>
        </div>
      </>
    );
  }

  randomiseWeightsOfNodes = () => {
    console.log('Randomise weights')
    for (const row of this.state.nodes) {
      for (const node of row) {
        node.weight = Math.ceil(Math.random() * 75); // between 1 and 75;
      }
    }
    this.forceUpdate();
  }
  setStart = () => {
    console.log('set start');
    this.setState({isSelectingStart: true});
  }
  setGoal = () => {
    console.log('set goal');
    this.setState({isSelectingGoal: true});
  }
  restart = () => {
    const nodes: INode[][] = this.generateNodes(this.state.width);
    const startNode = nodes[0][0];
    const goalNode = nodes[this.state.width - 1][this.state.width - 1];
    startNode.isStart = true;
    goalNode.isGoal = true;
    this.setState({
      nodes: nodes,
      startNode: startNode,
      goalNode: goalNode,
    })
  }
  start = async () => {
    await this.findShortestPath();
  }

  handleNodeClick = (node: INode) => {
    console.log('handleClick');
    if (this.state.isSelectingStart) {
      console.log('selecting start')
      this.assignStartNode(node);
      this.setState({isSelectingStart: false});
    }
    else if (this.state.isSelectingGoal) {
      this.assignGoalNode(node);
      this.setState({isSelectingGoal: false});
    }
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
          isPath: false,
          neighbours: [],
          distance: Number.POSITIVE_INFINITY,
          weight: 1,
          previous: undefined,
        });
      }
      nodes.push(nodeRow);
    }
    this.initialiseNodesNeighbours(nodes);
    return nodes;
  }

  initialiseNodesNeighbours(nodes: INode[][]) {
    const width = nodes.length;
    nodes.forEach((nodeRow, rowIndex) => {
      nodeRow.forEach((node, colIndex) => {
        // Add neighbours above
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex - 1, nodes, width);
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex, nodes, width);
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex + 1, nodes, width);
        // Add neighbours on same row
        this.tryAddNodeNeighbour(node, rowIndex, colIndex - 1, nodes, width);
        this.tryAddNodeNeighbour(node, rowIndex, colIndex + 1, nodes, width);
        // add neighbours below
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex - 1, nodes, width);
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex, nodes, width);
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex + 1, nodes, width);
      });
    });
  }

  tryAddNodeNeighbour = (node: INode, rowIndex: number, colIndex: number, nodes: INode[][], width: number) => {
    if (
      rowIndex < 0 ||
      colIndex < 0 ||
      rowIndex >= width ||
      colIndex >= width ||
      (node.rowIndex === rowIndex && node.colIndex === colIndex)
    ) {
      return;
    }
    node.neighbours.push(nodes[rowIndex][colIndex]);
  }

  assignGoalNode = (node: INode) => {
    const currentGoalNode = this.state.goalNode;
    const selectedNode = this.state.nodes[node.rowIndex][node.colIndex];
    if (selectedNode.isGoal) {
      selectedNode.isGoal = false;
      this.setState({
        goalNode: undefined,
      });
      return;
    }
    if (selectedNode.isStart) {
      return;
    }
    if (currentGoalNode) {
      currentGoalNode.isGoal = false;
    }
    selectedNode.isGoal = true;
    this.setState({
      goalNode: selectedNode
    });
  }

  assignStartNode = (node: INode) => {
    const currentStartNode = this.state.startNode;
    const selectedNode = this.state.nodes[node.rowIndex][node.colIndex];
    // Unassign
    if (selectedNode.isStart) {
      selectedNode.isStart = false;
      this.setState({
        startNode: undefined,
      });
      return;
    }
    // Dont assign if goal
    if (selectedNode.isGoal) {
      return;
    }
    // Unset the current startnode if exists
    if (currentStartNode) {
      currentStartNode.isStart = false;
    }
    selectedNode.isStart = true;
    this.setState({
      startNode: selectedNode
    });
  }

  findShortestPath = async () => {
    console.log('findShortestPath');
    const unvisited = this.state.nodes.reduce((accum, row) => {
      accum = accum.concat(...row);
      return accum;
    }, []);
    const startNode = this.state.startNode;
    const goalNode = this.state.goalNode;

    if (!startNode || !goalNode || unvisited.length === 0) {
      console.log('invalid state');
      return;
    }
    startNode.distance = 0;
    while (unvisited.length > 0) {
      const currentNode = unvisited.reduce((min, cur) => {
        if (min == undefined || cur.distance < min.distance) {
          min = cur;
        }
        return min;
      })
        // .filter((node) => node.distance < Number.POSITIVE_INFINITY)
        // .sort((a: INode, b: INode) => a.distance - b.distance)[0];

      for (const neighbour of currentNode.neighbours) {
        if (unvisited.indexOf(neighbour) >= 0) {
          let distanceToNeighbour = currentNode.distance + neighbour.weight;
          if (distanceToNeighbour < neighbour.distance) {
            neighbour.previous = currentNode;
            neighbour.distance = distanceToNeighbour;
          }
        }
      }
      currentNode.isVisited = true;
      unvisited.splice(unvisited.indexOf(currentNode), 1);
      await sleep(this.state.delayInMs);
      this.forceUpdate();
    }
    // traverse back
    let currentNode = goalNode.previous;
    while (currentNode != undefined) {
      currentNode.isPath = true;
      currentNode = currentNode.previous;
      await sleep(this.state.delayInMs);
      this.forceUpdate();
    }
  }
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default Grid;
