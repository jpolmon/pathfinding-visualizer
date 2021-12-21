class FibHeap {
  constructor() {
    // Creating the array that will be used as a heap.
    this.heap = [];
  }

  getMin() {
    // Returns the initial value of the array as it will be the lowest value of the heap
    return this.heap[0];
  }

  insert(node) {
    // Inserts the new node at the end of the array
    this.heap.push(node);
  }
}

export default FibHeap;
