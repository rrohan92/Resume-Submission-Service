'use strict';

const answers = require('./answers');
const SIZE = 4;

const ApiBuilder = require('claudia-api-builder'),
  api = new ApiBuilder();

module.exports = api;

api.get('/', function (request) {
  if(request.queryString.q === 'Puzzle'){
    //extract the puzzle question using regex
    const chars = request.queryString.d.match(/[-<=>]/gmi);
    const puzzle = [];

    //populating 2d array
    puzzle.push([chars[0],chars[1],chars[2],chars[3]]);
    puzzle.push([chars[4],chars[5],chars[6],chars[7]]);
    puzzle.push([chars[8],chars[9],chars[10],chars[11]]);
    puzzle.push([chars[12],chars[13],chars[14],chars[15]]);

    for(let i in puzzle){
      for(let j in puzzle[i]){
        if(i === j){ //assign '=' to diagonal positions
          puzzle[i][j] = '=';
        }else if(puzzle[i][j] === '<'){ //flip '<' and '>'
          puzzle[j][i] = '>';
        }else if(puzzle[i][j] === '>'){
          puzzle[j][i] = '<';
        }
      }
    }

    //check for empty spaces
    for(let i in puzzle){
      for(let j in puzzle[i]){
        if(puzzle[i][j] === '-'){
          //count '<' and '>' in each row and assign accordingly
          if(countChars(puzzle[i]) === 'greater'){
            puzzle[i][j] = '>';
            puzzle[j][i] = '<';
          } else if(countChars(puzzle[i]) === 'less') {
            puzzle[i][j] = '<';
            puzzle[j][i] = '>';
          }
        }
      }
    }

    answers[request.queryString.q] = ` ABCD\nA${puzzle[0][0]}${puzzle[0][1]}${puzzle[0][2]}${puzzle[0][3]}
                                      \nB${puzzle[1][0]}${puzzle[1][1]}${puzzle[1][2]}${puzzle[1][3]}
                                      \nC${puzzle[2][0]}${puzzle[2][1]}${puzzle[2][2]}${puzzle[2][3]}
                                      \nD${puzzle[3][0]}${puzzle[3][1]}${puzzle[3][2]}${puzzle[3][3]}`
  }


  return new ApiBuilder.ApiResponse(answers[request.queryString.q], {'Content-Type': 'text/plain'}, 200);
});

function countChars(puzzle) {
  let countGreater = 0, countLess = 0;

  for (let i in puzzle){
    if(puzzle[i] === '<'){
      countLess++;
    }
    if(puzzle[i] === '>'){
      countGreater++;
    }
  }

  if(countGreater > countLess){
    return 'greater';
  } else if(countLess > countGreater){
    return 'less';
  }
}