import { PriorityQueue } from '../../src/data-structures/priority-queue';

describe('Peek', () => {
  test('should return item with highest priority', () => {
    const testQueue = new PriorityQueue();
    const item1 = "FirstItem";
    const item2 = "SecondItem";
    const item3 = "ThirdItem";

    testQueue.push(item3, 3);
    testQueue.push(item1, 1);
    testQueue.push(item2, 2);

    expect(testQueue.peek()).toBe(item1);
  });

  test('should return the only item in priority queue when there\'s only one item', () => {
    const testQueue = new PriorityQueue();
    const item1 = "FirstItem";

    testQueue.push(item1, 1);

    expect(testQueue.peek()).toBe(item1);
  });
});

describe('Pop', () => {
  test('should return item with highest priority and remove item from the queue', () => {
    const testQueue = new PriorityQueue();
    const item1 = "FirstItem";
    const item2 = "SecondItem";
    const item3 = "ThirdItem";

    testQueue.push(item3, 3);
    testQueue.push(item1, 1);
    testQueue.push(item2, 2);

    expect(testQueue.pop()).toBe(item1);
    expect(testQueue.getLength()).toEqual(2);
    expect(testQueue.pop()).toBe(item2);
    expect(testQueue.getLength()).toEqual(1);
    expect(testQueue.pop()).toBe(item3);
    expect(testQueue.isEmpty()).toBe(true);
  });

  test('should return item with highest priority', () => {
    const testQueue = new PriorityQueue();
    const item1 = "FirstItem";
    const item2 = "SecondItem";
    const item3 = "ThirdItem";

    testQueue.push(item3, 3);
    testQueue.pop();
    testQueue.push(item1, 1);
    testQueue.push(item2, 2);
    testQueue.pop();
    testQueue.push(item3, 3);
    testQueue.push(item1, 1);

    expect(testQueue.pop()).toBe(item1);
    expect(testQueue.pop()).toBe(item2);
    expect(testQueue.pop()).toBe(item3);
  });
});