const data = require("./pre.json")

const rs = [];

data.map(d => {
  if(d.boardgame_id === null) {
    return
  } else {
    rs.push(d)
  }
})

console.log(JSON.stringify(rs))
