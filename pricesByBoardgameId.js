const fs = require('fs');
const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const { createReadStream, createWriteStream } = require('fs');

const reducePrices = data => {
  const rs = [];

  data.map(d => {
    if(d.boardgame_id === null || d.boardgame_id === 23953) {
      return
    } else {
      const { boardgame_name, thumb, store_thumb, url, cr_date, rank, ...rest } = d;

      if (rank > 0 && rank !== null) {
        rs.push({
          ...rest,
          rank
        })
      } else {
        rs.push(rest)
      }
    }
  })

  fs.writeFileSync("./rest/v1/prices.json", JSON.stringify(rs))

  const gzip = createGzip();
  const source = createReadStream("./rest/v1/prices.json");
  const destination = createWriteStream("./rest/v1/prices.json.gz");

  pipeline(source, gzip, destination, (err) => {
    if (err) {
      console.error('An error occurred:', err);
      process.exitCode = 1;
    }
  });
}

const bootstrapPrices = data => {
  const rs = {}

  data.map(d => {
    rs[d.boardgame_id] = []
  })

  data.map(d => {
    const { boardgame_id,  thumb, rank, cr_date, ...rest } = d;
    rs[d.boardgame_id].push(rest)
  })

  Object.keys(rs).map(d => {
    const dir = "./rest/v1/boardgames/" + d
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  })

  Object.keys(rs).map(d => {
    fs.writeFileSync("./rest/v1/boardgames/" + d + "/prices.json", JSON.stringify(rs[d].sort((a, b) => a.price - b.price)))
  })
}

const bootstrapDate = data => {
  const rs = data.map(d => new Date(d.cr_date))
  const json = {
    date: new Date(Math.max(...rs))
  }

   fs.writeFileSync("./rest/v1/date.json", JSON.stringify(json))
}

const bootstrapPricesById = data => {
  const rs = {}

  data.map(d => {
    const { id, ...rest } = d;

    if(rs[d.id] !== undefined) {
      console.log(d)
    }

    rs[d.id] = rest;
  })

  const dir = "./rest/v1/prices/"
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  Object.keys(rs).map(d => {
    const dir = "./rest/v1/prices/" + d
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  })

  Object.keys(rs).map(d => {
    const { cr_date, thumb, rank, ...rest } = rs[d]
    fs.writeFileSync("./rest/v1/prices/" + d + ".json", JSON.stringify(rest))
  })
}

const bootstrapBoardgames = data => {
  const rs = {}

  data.map(d => {
    rs[d.boardgame_id] = []
  })

  data.map(d => {
    const { store_id, id, cr_date, name, price, stock, url, ...rest } = d;
    rs[d.boardgame_id].push(rest)
  })

  Object.keys(rs).map(d => {
    const dir = "./rest/v1/boardgames/" + d
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }

    const data = rs[d];
    const { rank } = data[0];

    // if (rank > 0 && rank < 3000) {
    //   fetch("http://127.0.0.1:1234/rest/v1/image/" + d)
    //   .then(res => res.json())
    //   // .then(res => console.log(res))
    //   .catch(err => console.log(d, err))
    // }
  })

  Object.keys(rs).map(d => {
    const data = rs[d];
    const { thumb, store_thumb, rank, ...obj } = data[0]
    obj.images = []

    if(thumb !== "") {
      obj.images.push(thumb)
    }

    data.map(d => {
      if(d.store_thumb !== "") {
        obj.images.push(d.store_thumb)
      }
    })

    if(rank > 0) {
      obj.rank = rank
    }

    obj.images.sort()

    fs.writeFileSync("./rest/v1/boardgames/" + d + "/boardgame.json", JSON.stringify(obj))
  })
}

const bootstrapHistory = data => {
  const rs = {}

  data.map(d => {
    rs[d.boardgame_id] = []
  })

  data.map(d => {
    const { boardgame_id, ...rest } = d;
    rs[d.boardgame_id].push(rest)
  })

  Object.keys(rs).map(d => {
    const dir = "./rest/v1/boardgames/" + d
    if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
    }
  })

  Object.keys(rs).map(d => {
    fs.writeFileSync("./rest/v1/boardgames/" + d + "/history.json", JSON.stringify(rs[d]))
  })
}

["./rest", "./rest/v1/", "./rest/v1/boardgames"].map(dir => {
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
})

fetch("http://127.0.0.1:1234/rest/v1/price?batch=1")
  .then(res => res.json())
  .then(res => {
    const data = res.filter(d => d.boardgame_id !== null).filter(d => d.boardgame_id !== 23953)
    reducePrices(data);
    bootstrapPrices(data);
    bootstrapPricesById(data);
    bootstrapBoardgames(data);
    bootstrapDate(data);
  })

fetch("http://127.0.0.1:1234/rest/v1/history")
  .then(res => res.json())
  .then(res => {
    bootstrapHistory(res);
  })

fetch("http://127.0.0.1:1234/rest/v1/store")
  .then(res => res.json())
  .then(res => {
    res.sort((a, b) => ('' + a.name).localeCompare(b.name))
    return res
  })
  .then(res => {
    fs.writeFileSync("./rest/v1/stores.json", JSON.stringify(res))
  })
