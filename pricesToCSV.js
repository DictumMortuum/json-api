const data = require("/home/dimitris/Code/DictumMortuum/json-api/prices.json")
const util = require('util');

data.map(d => {
  if(d.boardgame_id !== 23953) {
    if(d.boardgame_id !== null) {
      const date = new Date(d.cr_date)

      console.log(util.format('%d,%s,%f,%d,%s', d.boardgame_id, date.toISOString().split("T")[0], d.price, d.stock, d.store_name))
    }
  }
})

//for i in {1..22}; do git reset master~1 --hard; [[ -f prices.json.gz ]] && gunzip prices.json.gz; node /tmp/pricesToCSV.js > /tmp/asdf$i.csv; rm prices.json; done