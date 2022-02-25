export class PriorityQueueItem<T> {
  constructor(public priority: number, public data: T) { };
}

export class PriorityQueue<T> {
  private heap: PriorityQueueItem<T>[];

  constructor() {
    this.heap = [];
  }

  public peek(): T {
    if (this.isEmpty()) {
      throw Error('Queue is empty');
    }
    return this.heap[0].data;
  }

  public push(priorityQueueItem: PriorityQueueItem<T>): void;
  public push(item: T, priority: number): void;
  public push(item: PriorityQueueItem<T> | T, priority = 0) {
    let newItem: PriorityQueueItem<T>;
    if (item instanceof PriorityQueueItem) {
      newItem = item;
    }
    else {
      newItem = new PriorityQueueItem(priority, item);
    }
    // insert to the last
    this.heap.push(newItem);
    // bubble up
    const newItemIndex = this.heap.length - 1;
    this.bubbleUp(newItemIndex);
  }

  public pop(): T {
    if (this.isEmpty()) {
      throw Error('Queue is empty');
    }
    // swap first to last
    this.swap(0, this.heap.length - 1);
    // remove last
    const itemToReturn = this.heap.pop();
    if (!itemToReturn) {
      throw Error('Invalid state');
    }
    // bubbledown
    this.bubbleDown(0);
    // return last;
    return itemToReturn.data;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number) {
    // while item is more prioritised than parent and index is not parent
    // swap with parent
  }

  private bubbleDown(index: number) {
    // while item has less priority than min of left and right
    // swap with min of left and right
  }

  private swap(firstIndex: number, secondIndex: number) {
    let temp = this.heap[firstIndex];
    this.heap[firstIndex] = this.heap[secondIndex];
    this.heap[secondIndex] = temp;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftIndex(index: number): number {
    return (index * 2) + 1;
  }

  private getRightIndex(index: number): number {
    return (this.getLeftIndex(index)) + 1;
  }
}