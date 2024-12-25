/**
 * A binary heap is a complete binary tree that satisfies the heap ordering property.
 * This implementation supports both minimum and maximum heaps, depending on the
 * comparison function provided. If no comparison function is provided, it defaults to
 * a minimum heap.
 *
 * @example
 * var Heap = require('path-to-algorithms/src/data-structures/heap').Heap;
 *
 * // Example for a max heap using birthyear for comparison:
 * var heap = new Heap(function(a, b) {
 *     return a.birthyear - b.birthyear;
 * });
 *
 * heap.add({ name: 'John', birthyear: 1981 });
 * heap.add({ name: 'Pavlo', birthyear: 2000 });
 * heap.add({ name: 'Garry', birthyear: 1989 });
 * heap.add({ name: 'Derek', birthyear: 1990 });
 * heap.add({ name: 'Ivan', birthyear: 1966 });
 *
 * console.log(heap.extract()); // { name: 'Pavlo', birthyear: 2000 }
 * console.log(heap.extract()); // { name: 'Derek', birthyear: 1990 }
 * console.log(heap.extract()); // { name: 'Garry', birthyear: 1989 }
 * console.log(heap.extract()); // { name: 'John', birthyear: 1981 }
 * console.log(heap.extract()); // { name: 'Ivan', birthyear: 1966 }
 *
 * @module data-structures/heap
 */
(function (exports) {
  "use strict";

  /**
   * Heap constructor.
   * The heap can be either a min-heap or max-heap, determined by the comparison function.
   * By default, it behaves as a min-heap if no comparison function is provided.
   *
   * @public
   * @constructor
   * @param {Function} cmp A function used for comparing elements (optional).
   *                       It should return a positive number if a > b,
   *                       a negative number if a < b, and 0 if they are equal.
   */
  exports.Heap = function (cmp) {
    this._heap = [];
    // If comparison function is provided, use it; otherwise, use default for min-heap.
    this._cmp =
      typeof cmp === "function"
        ? cmp
        : function (a, b) {
            return a - b;
          };
  };

  /**
   * Heapifies the subtree rooted at the given index, maintaining the heap property.
   * This method assumes that the subtrees are already valid heaps and fixes the
   * heap rooted at the provided index.
   *
   * Time complexity: O(log N).
   *
   * @private
   * @param {Number} index Index of the node to heapify.
   */
  exports.Heap.prototype._heapify = function (index) {
    var largest = index;
    var left = 2 * index + 1; // Left child index
    var right = 2 * index + 2; // Right child index
    var temp;

    // Compare the left child with the current node (index).
    if (
      left < this._heap.length &&
      this._cmp(this._heap[left], this._heap[index]) > 0
    ) {
      largest = left;
    }

    // Compare the right child with the current largest node.
    if (
      right < this._heap.length &&
      this._cmp(this._heap[right], this._heap[largest]) > 0
    ) {
      largest = right;
    }

    // If the largest node is not the current index, swap and heapify.
    if (largest !== index) {
      temp = this._heap[index];
      this._heap[index] = this._heap[largest];
      this._heap[largest] = temp;
      // Recursively heapify the affected subtree.
      this._heapify(largest);
    }
  };

  /**
   * Changes the key/value of the element at the given index and repositions it
   * to maintain the heap property.
   *
   * Time complexity: O(log N).
   *
   * @public
   * @param {Number} index Index of the element to change.
   * @param {Number|Object} value The new value for the element.
   * @return {Number} The new position of the element.
   */
  exports.Heap.prototype.changeKey = function (index, value) {
    this._heap[index] = value;
    var elem = this._heap[index];
    var parent = Math.floor((index - 1) / 2); // Parent index (use (index-1)/2 for zero-based index).
    var temp;

    // Move the element up the tree if it's greater than its parent.
    while (index > 0 && this._cmp(elem, this._heap[parent]) > 0) {
      temp = this._heap[parent];
      this._heap[parent] = elem;
      this._heap[index] = temp;
      index = parent;
      parent = Math.floor((parent - 1) / 2);
    }

    // Ensure the heap is valid after key change.
    this._heapify(index);
    return index;
  };

  /**
   * Updates a specific node by repositioning it in the heap to maintain the heap property.
   * This is useful in algorithms where node values need to be updated, such as Dijkstra's or A*.
   *
   * Time complexity: O(log N).
   *
   * @public
   * @param {Number|Object} node The node to be updated.
   */
  exports.Heap.prototype.update = function (node) {
    var idx = this._heap.indexOf(node);
    if (idx >= 0) {
      this.changeKey(idx, node);
    }
  };

  /**
   * Adds a new element to the heap, maintaining the heap property.
   *
   * Time complexity: O(log N).
   *
   * @public
   * @param {Number|Object} value The value to be added to the heap.
   * @return {Number} The index of the inserted value.
   */
  exports.Heap.prototype.add = function (value) {
    // Insert the value at the end of the array and then move it to the correct position.
    this._heap.push(value);
    return this.changeKey(this._heap.length - 1, value);
  };

  /**
   * Retrieves, but does not remove, the element at the top of the heap (the extremum).
   *
   * Time complexity: O(1).
   *
   * @public
   * @return {Number|Object} The current top value of the heap.
   */
  exports.Heap.prototype.top = function () {
    return this._heap[0];
  };

  /**
   * Removes and returns the top (extremum) element from the heap.
   * After removal, the heap property is restored.
   *
   * Time complexity: O(log N).
   *
   * @public
   * @return {Number|Object} The extremum value removed from the heap.
   * @throws Will throw an error if the heap is empty.
   */
  exports.Heap.prototype.extract = function () {
    if (this._heap.length === 0) {
      throw new Error("The heap is already empty!");
    }

    // Swap the top element with the last one, remove the last, and heapify the top.
    var extr = this._heap[0];
    var last = this._heap.pop();
    if (this._heap.length > 0) {
      this._heap[0] = last;
      this._heapify(0);
    }
    return extr;
  };

  /**
   * Returns the entire collection of the heap's elements.
   *
   * @public
   * @return {Array} An array representing the heap's internal collection.
   */
  exports.Heap.prototype.getCollection = function () {
    return this._heap;
  };

  /**
   * Checks if the heap is empty.
   *
   * @public
   * @return {Boolean} True if the heap is empty, otherwise false.
   */
  exports.Heap.prototype.isEmpty = function () {
    return this._heap.length === 0;
  };
})(typeof window === "undefined" ? module.exports : window);
