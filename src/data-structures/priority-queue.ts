interface PriorityQueueItem<T> {
  priority: number;
  data: T
}

export class PriorityQueue<U, T extends PriorityQueueItem<U>> {
  private heap: T[];
  private size: number;

  constructor(){
    this.size = 0;
    this.heap = [];
  }

  public peek(): T {
    if (this.size === 0) {
      throw Error('Queue is empty');
    }
    return this.heap[0];
  }

  public push(item: T) {
    // insert to the last
    // bubble up

  }

  public pop(): T {
    // swap first to last
    // remove last
    // bubbledown
    // return last;
  }

  private bubbleUp(index: number) {
    // while item is more prioritised than parent and index is not parent
    // swap with parent
  }

  private bubbleDown(index: number) {
    // while item has less priority than min of left and right
    // swap with min of left and right
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1)/2);
  }

  private getLeftIndex(index: number): number {
    return (index * 2) + 1;
  }

  private getRightIndex(index: number): number {
    return (this.getLeftIndex(index)) + 1;
  }
}