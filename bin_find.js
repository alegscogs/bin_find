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
