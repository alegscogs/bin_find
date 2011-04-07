// Copyright (C) 2011 by Alex Cox
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.


(function($){

// Execute a binary search tree on an array of sorted items.
// Takes three arguments, an `array` containing the items to be
// searched, a `block` function which acts like an iterator 
// and returns a set of values in an array for comparison,
// and an optional `start_pointer` index, if you want to start
// the binary search at a point other than the center of the array

function BinFind(array, block, start_pointer) {
  this.array  = array;
  this.block  = block;
  this.from   = this.min_i = 0;
  this.to     = this.max_i = this.array.length - 1;
  if (typeof start_pointer === "number") {
    this.i = start_pointer;
  } else {
    this.center();
  }
  this.result = this.search();
}

$.extend(BinFind.prototype, {
  center : function(){
    this.i = Math.floor(((this.to - this.from) / 2) + this.from);
  },
  constrain_pointer : function(i){
    if (i > this.max_i) { i = this.max_i; }
    if (i < 0)          { i = this.min_i; }
    return i;
  },
  to_left : function() {
    this.to = this.constrain_pointer(this.i - 1);
    this.center();
  },
  to_right : function() {
    this.from = this.constrain_pointer(this.i + 1);
    this.center();
  },
  search : function() {
    var found = false;
    while (!found && this.last_i !== this.i) {
      this.last_i = this.i;
      var 
        vv = this.block(this.i, this.array[this.i]),
        c = $.map([vv[1] - vv[0], vv[2] - vv[1]], function(v,i){
          return (v >= 0) ? 1 : 0;
        });

      switch (c[0] - c[1]) {
        case  0 :
          found = true;
          break;
        case  1 :
          this.to_right();
          break;
        case -1 :
          this.to_left();
          break;
        default :
          return 'Error: [' + vv + '] are not a valid range.';
      }
    }

    var r = null;    
    if (found) {
      r = this.array[this.i];
    }
    return r;
  }
});

$.fn.bin_find = function(search_block, start_pointer){
  var bin_find = new BinFind($.makeArray(this), search_block, start_pointer);
  return $(bin_find.result);
};

})(jQuery);
