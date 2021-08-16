import { INode } from 'types';
import './Node.css';

type NodeProps = {
  node: INode
  sizeInPx: number;
  onClick: (node: INode) => void;
  // todo: Onclick, do something
}

const Node = (props: NodeProps): JSX.Element => {
  // initialise grid
  const style = {
    width: `${props.sizeInPx}px`,
    paddingBottom: `${props.sizeInPx}px`,
    opacity: (props.node.isStart || props.node.isGoal || props.node.isWall) ? '1' : `${1-((props.node.weight-1)/10)}`,
  }
  const backgroundColour = getBackgroundColour(props.node);
  const classNames = ['item', backgroundColour]
  return (
    <div className={`${classNames.join(' ')}`} style={{...style}} onClick={(_) => props.onClick(props.node)}></div>
  );
};

const getBackgroundColour = (node: INode) => {
  if (node.isWall) {
    return 'item-wall';
  }
  if (node.isCurrentNode) {
    return 'item-current';
  }
  if (node.isStart) {
    return 'item-start';
  }
  if (node.isGoal) {
    return 'item-goal';
  }
  if (node.isPath) {
    return 'item-path';
  }
  if (node.isVisited) {
    return 'item-visited';
  }
  else {
    return 'item-default';
  }
}

export default Node;