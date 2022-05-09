const fs = require('fs');

const data = require("./data.json")
.filter(d => d.Type === "Tutorial Playthru")
.map(d => {
  return {
    ...d,
    Name: d["Name - 961 unique games"]
  }
})
.map(d => {
  const {Type, Name, Link} = d;

  return {
    Type, Name, Link
  }
})

const search = name => fetch(`http://127.0.0.1:1234/rest/v1/mapping2/search?q=${name}`).then(rs => rs.json())

const retval = [];

const main = async () => {
  for (let i in data) {
    const rs = await search(data[i].Name)
    console.log(data[i].Name, rs)
    retval.push({
      ...data[i],
      ...rs,
    })
  }

  fs.writeFileSync("./jgg.json",
    JSON.stringify(
      retval.filter(d => d.status !== "BAD")
      .map(d => {
        const { boardgame_id, name, Link: link } = d;
        return {
          boardgame_id,
          name,
          link
        }
      })
    )
  )
}

main();
