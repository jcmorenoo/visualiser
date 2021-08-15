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
    paddingBottom: `${props.sizeInPx}px`
  }
  const backgroundColour = getBackgroundColour(props.node);
  const classNames = ['item', backgroundColour]
  return (
    <div className={`${classNames.join(' ')}`} style={{...style}}></div>
  );
};

const getBackgroundColour = (node: INode) => {
  if (node.isGoal) {
    return 'item-goal';
  }
  else if (node.isStart) {
    return 'item-start';
  }
  else if (node.isVisited) {
    return 'item-visited';
  }
  else {
    return 'item-default';
  }
}

export default Node;