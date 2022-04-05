const prices = require("./prices.json")
const history = require("./history.json")
const stores = require("./stores.json")

const rs = {
  "history": history,
  "prices": prices,
  "stores": stores,
}

console.log(JSON.stringify(rs))

