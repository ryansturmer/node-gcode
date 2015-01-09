{
   buildTree = function(first, rest) {
      if(rest.length == 0) {
          return first;
      } else { 
          var next = rest.shift();
          var operator = next[0]
          var term = next[1]
          return {left: first, right: buildTree(term, rest), op: operator};
      }
   }
}

start
  = line

line 
  = num:line_number? words:word* {
      var result = {'N':num}
      words.forEach(function(word) {
        result[word[0]] =word[1];
      });
      return result;
}

word = word:letter value:real_value { return [word, value]; }

line_number
  = "N" integer

real_value 
  = factor1

integer
  = [0-9]+ { return parseInt(text()); }

number
  = [\+\-]?[0-9]+([\.][0-9]+)? { return parseFloat(text()); }
    
expression
  = "[" expr:factor4 "]" {return expr; }

atan_factor = "ATAN" left:expression "/" right:expression { 
    return {'op':"ATAN", 'left':left, 'right':right};
}

unary_factor = op:unary_op expr:expression {return {'op':op, 'right':expr}}

param_value = "#" expr:(expression / number / param_value) { return {'op':'#', 'right':expr }}

factor1
  = expression
  / number
  / atan_factor
  / unary_factor
  / param_value

factor2
  = first:factor1 rest:(group1_op factor1)* { 
        return buildTree(first, rest);
    }
factor3
  = first:factor2 rest:(group2_op factor2)* {
      return buildTree(first, rest);
    }
factor4
  = first:factor3 rest:(group3_op factor3)* {
      return buildTree(first, rest);
    }

group1_op = "**"
group2_op = "*" / "/" / "MOD"
group3_op = "+" / "-" / "OR" / "XOR" / "AND"
unary_op = "ABS" / "ACOS" / "ASIN" / "COS" / "EXP" / "FIX" / "FUP" / "ROUND" / "LN" / "SIN" / "SQRT" / "TAN" / "EXISTS"
letter = "A" / "B" / "C" / "D" / "F" / "G" / "H" / "I"  / "J" / "K" / "L" / "M" / "P" / "Q" / "R" / "S" / "T" / "X" / "Y" / "Z"