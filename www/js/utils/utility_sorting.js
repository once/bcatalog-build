
// Helper STABLE sorting


  Array.prototype.mergeSort = mergeSort;

  function mergeSort(compare) {

    var length = this.length,
        middle = Math.floor(length / 2);

    if (!compare) {
      compare = function(left, right) {
        if (left < right)
          return -1;
        if (left == right)
          return 0;
        else
          return 1;
      };
    }

    if (length < 2)
      return this;

    return merge(
      this.slice(0, middle).mergeSort(compare),
      this.slice(middle, length).mergeSort(compare),
      compare
    );
  }

  function merge(left, right, compare) {

    var result = [];

    while (left.length > 0 || right.length > 0) {
      if (left.length > 0 && right.length > 0) {
        if (compare(left[0], right[0]) <= 0) {
          result.push(left[0]);
          left = left.slice(1);
        }
        else {
          result.push(right[0]);
          right = right.slice(1);
        }
      }
      else if (left.length > 0) {
        result.push(left[0]);
        left = left.slice(1);
      }
      else if (right.length > 0) {
        result.push(right[0]);
        right = right.slice(1);
      }
    }
    return result;
  }



        function SortArrayBy(arr, sort_field ,fieldtype, direction) {
            
            var sortingFunction = null;
            
            if (fieldtype=="int") {
                    
                    if (direction=="desc") {
                    
                        
                        sortingFunction =  sortIntArrayDesc;
                    }
                    else {
                        sortingFunction =  sortIntArrayAsc;
                        
                    }    

                    return arr.mergeSort(sortingFunction); // mergeSort is suitable only for INT

            }
            else if (fieldtype=="bool") {

                    if (direction=="truefirst") {
                    
                        
                        sortingFunction =  sortBoolArrayTrueFirst;
                    }
                    else {
                        sortingFunction =  sortBoolArrayFalseFirst;
                        
                    }
                
                return arr.mergeSort(sortingFunction);


            }

            else {
                
                if (direction=="desc") {
                    
                        
                        sortingFunction =  sortStringArrayDesc;
                    }
                    else {
                        sortingFunction =  sortStringArrayAsc;
                        
                    }
                
                return arr.mergeSort(sortingFunction);
            }
                
            
                        
            // Helper sorting functions
            function sortIntArrayAsc(a,b) {
                    
                    return a[sort_field] - b[sort_field];

             }


               
            function sortIntArrayDesc(a,b) {

                    return b[sort_field] - a[sort_field];
            
                    
            }

            function sortBoolArrayTrueFirst(a,b) {
    
                    var a = a[sort_field] || false;		//in case of undefined, they are considered false
                    var b = b[sort_field] || false;
                    
                    if (a == b) return 0;
                    if ((a == true) && (b == false)) return 1;
                    if ((a == false) && (b == true)) return -1;
            }

            function sortBoolArrayFalseFirst(a,b) {
            
                var a = a[sort_field] || false;		//in case of undefined, they are considered false
                var b = b[sort_field] || false;
                
                if (a == b) return 0;
                if ((a == true) && (b == false)) return -1;
                if ((a == false) && (b == true)) return 1;
            }



            
            function sortStringArrayAsc(a,b) {

                return  (sortCompare(a[sort_field], b[sort_field])) ? 1 : -1;
                
            }

            function sortStringArrayDesc(a,b) {
            
                return  (sortCompare(a[sort_field], b[sort_field])) ? -1 : 1;

                    
            }
            
            // function for correct comparison of Cyrillic and Latin symbols
            // Latin should go after cyrillic
            
            function sortCompare(a,b) { 
            
                // A > B  -> true
                // A < B  -> false
                
                for (var i=0; i < a.length; i++) {
                    
                        if (!isCyrillicSymbol(a[i]) && isCyrillicSymbol(b[i])) {
                            return true
                        }
                        else if (isCyrillicSymbol(a[i]) && !isCyrillicSymbol(b[i])){
                            return false
                        }
                        else {
                            
                            if (a == b) continue;
                            
                            return (a > b);
                        }
                        
                }
                
            
            }
            
            function isCyrillicSymbol(s) {
                
                return ((s.charCodeAt(0) >= 1040) && (s.charCodeAt(0) <= 1103));
            }

                     
        }
  

  module.exports = {

    SortArrayBy : SortArrayBy
  }

