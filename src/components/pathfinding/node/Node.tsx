import { INode } from 'types';
import './Node.css';

type NodeProps = {
  node: INode
  sizeInPx: number;
  // todo: Onclick, do something
}

const Node = (props: NodeProps): JSX.Element => {
  // initialise grid
  const style = {
    width: `${props.sizeInPx}px`,
    paddingBottom: `${props.sizeInPx}px`,
    opacity: `${100-props.node.weight}%`,
  }
  const backgroundColour = getBackgroundColour(props.node);
  const classNames = ['item', backgroundColour]
  return (
    <div className={`${classNames.join(' ')}`} style={{...style}}></div>
  );
};

const getBackgroundColour = (node: INode) => {
  if (node.isStart) {
    return 'item-start';
  }
  else if (node.isGoal) {
    return 'item-goal';
  }
  else if (node.isPath) {
    return 'item-path';
  }
  else if (node.isVisited) {
    return 'item-visited';
  }
  else {
    return 'item-default';
  }
}

export default Node;