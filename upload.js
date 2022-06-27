const { Deta } = require("deta")
const deta = Deta(process.env.BASE);
const db = deta.Base("prices3")
const json = require("./rest/v1/prices.json");
const chunkSize = 2600;

async function run() {
  let j = 0;

  for (let i = 0; i < json.length; i += chunkSize) {
    const chunk = json.slice(i, i + chunkSize);
    let d = await db.put({
      key: j + "",
      prices: chunk.map(d => {
        const { transformed_name, ...rest } = d;
        return d;
      })
    })

    j++
    console.log(d.prices.length)
  }
}

run()
