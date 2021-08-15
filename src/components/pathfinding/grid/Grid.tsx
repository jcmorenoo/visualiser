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
    const width = 10;
    const nodes: INode[][] = this.generateNodes(width);
    const unvisited = nodes.reduce((accum, row) => {
      accum = accum.concat(...row);
      return accum;
    }, []);
    const startNode = nodes[0][0];
    const goalNode = nodes[width - 2][width - 2];
    startNode.isStart = true;
    startNode.distance = 0;
    goalNode.isGoal = true;
    this.state = {
      width,
      nodes: nodes,
      startNode: startNode,
      goalNode: goalNode,
      unvisited,
    }
    this.initialiseNodesNeighbours();
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

  setStart = () => {
    console.log('set start');
  }
  setGoal = () => {
    console.log('set goal');
  }
  restart = () => {
    console.log('restart');
  }
  start = () => {
    const nodes = [...this.state.nodes];
    console.log('start');
    // this.state.startNode?.neighbours.forEach(node => node.isVisited = true);
    this.findShortestPath();
    this.setState({ nodes });
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
    return nodes;
  }

  initialiseNodesNeighbours() {
    const nodes = [...this.state.nodes];
    nodes.forEach((nodeRow, rowIndex) => {
      nodeRow.forEach((node, colIndex) => {
        // Add neighbours above
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex - 1);
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex);
        this.tryAddNodeNeighbour(node, rowIndex - 1, colIndex + 1);
        // Add neighbours on same row
        this.tryAddNodeNeighbour(node, rowIndex, colIndex - 1);
        this.tryAddNodeNeighbour(node, rowIndex, colIndex + 1);
        // add neighbours below
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex - 1);
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex);
        this.tryAddNodeNeighbour(node, rowIndex + 1, colIndex + 1);
      });
    });
  }

  tryAddNodeNeighbour = (node: INode, rowIndex: number, colIndex: number) => {
    if (
      rowIndex < 0 ||
      colIndex < 0 ||
      rowIndex >= this.state.width ||
      colIndex >= this.state.width ||
      (node.rowIndex === rowIndex && node.colIndex === colIndex)
    ) {
      return;
    }
    node.neighbours.push(this.state.nodes[rowIndex][colIndex]);
  }

  assignGoalNode = (node: INode) => {
    const currentGoalNode = this.state.goalNode
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
    if (currentGoalNode) {
      currentGoalNode.isGoal = false;
    }
    node.isGoal = true;
    this.setState({
      goalNode: node
    });
  }

  assignStartNode = (node: INode) => {
    const currentStartNode = this.state.startNode;
    // Unassign
    if (node.isStart) {
      node.isStart = false;
      this.setState({
        startNode: undefined,
      });
      return;
    }
    // Dont assign if goal
    if (node.isGoal) {
      return;
    }
    // Unset the current startnode if exists
    if (currentStartNode) {
      currentStartNode.isStart = false;
    }
    node.isStart = true;
    this.setState({
      startNode: node
    });
    console.log('node', node)
    console.log('state', this.state.startNode)
  }

  findShortestPath = () => {
    console.log('findShortestPath');
    const unvisited = [...this.state.unvisited];
    const startNode = this.state.startNode;
    const goalNode = this.state.goalNode;

    if (!startNode || !goalNode || unvisited.length === 0) {
      console.log('invalid state');
      return;
    }

    while (unvisited.length > 0) {
      const currentNode = unvisited.sort((a: INode, b: INode) => a.distance - b.distance)[0];

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
    }
    // traverse back
    let currentNode = goalNode.previous;
    while (currentNode != undefined) {
      currentNode.isPath = true;
      currentNode = currentNode.previous;
    }
  }


}

export default Grid;
