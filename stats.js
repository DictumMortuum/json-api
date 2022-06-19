const fs = require('fs');

fetch("http://127.0.0.1:1234/rest/v1/play?_resource=stats")
  .then(res => res.json())
  .then(res => {
    fs.writeFileSync("./rest/v1/plays.json", JSON.stringify(res))
  })

fetch("http://127.0.0.1:1234/rest/v1/trueskill")
  .then(res => res.json())
  .then(res => {
    fs.writeFileSync("./rest/v1/ratings.json", JSON.stringify(res))
  })

fetch("http://127.0.0.1:1234/rest/v1/trueskill/overall")
  .then(res => res.json())
  .then(res => {
    fs.writeFileSync("./rest/v1/overall.json", JSON.stringify(res))
  })
