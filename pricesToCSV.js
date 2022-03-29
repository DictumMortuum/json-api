const data = require("./prices.json")
const util = require('util');

const rs = {}

// data.map(d => {
//   if (d.boardgame_id === null) {
//     return
//   }

//   if (rs[d.boardgame_id] === undefined) {
//     rs[d.boardgame_id] = []
//   }

//   rs[d.boardgame_id].push({
//     cr_date: d.cr_date,
//     price: d.price
//   })
// })

// console.log(JSON.stringify(rs))

function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}


data.map(d => {
  if(d.boardgame_id !== 23953) {
    if(d.boardgame_id !== null) {
      const date = new Date(d.cr_date)

      console.log(util.format('%d,%s,%f', d.boardgame_id, date.toISOString().split("T")[0], d.price))
    }
  }
})
