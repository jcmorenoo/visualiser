export interface IGrid {
  width: number;
  nodes: INode[][];
  startNode?: INode;
  goalNode?: INode;
}

export interface INode {
  neighbours: INode[];
  rowIndex: number;
  colIndex: number;
  isVisited: boolean;
  isStart: boolean;
  isGoal: boolean;
  isPath: boolean;
  previous?: INode;
  distance: number;
  weight: number;
}