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
  public push(item: PriorityQueueItem<T> | T, priority?: number) {
    let newItem: PriorityQueueItem<T>;
    if (item instanceof PriorityQueueItem) {
      newItem = item;
    }
    else {
      if (priority == null) {
        throw Error('Priority missing');
      }
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

  public getLength(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number) {
    while (index !== 0) {
      let parentIndex = this.getParentIndex(index);
      let parentItem = this.heap[parentIndex];
      let item = this.heap[index];

      // item is already in correct position
      // if the parent has higher priority than itself
      if (parentItem.priority < item.priority) {
        return;
      }

      this.swap(parentIndex, index);
      index = parentIndex;
      parentItem = this.heap[this.getParentIndex(index)];
    }
  }

  private bubbleDown(index: number) {
    while (index < this.heap.length) {
      let leftIndex = this.getLeftIndex(index);
      let rightIndex = this.getRightIndex(index);
      if (leftIndex >= this.heap.length) {
        return;
      }
      let childWithHighestPriority = leftIndex;
      if (this.heap[rightIndex] && this.heap[rightIndex].priority < this.heap[leftIndex].priority){
        childWithHighestPriority = rightIndex;
      }
      // item is already in the correct position
      // if it's priority is higher than it's child
      if (this.heap[index].priority < this.heap[childWithHighestPriority].priority) {
        return;
      }
      this.swap(index, childWithHighestPriority);
      index = childWithHighestPriority;
    }
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