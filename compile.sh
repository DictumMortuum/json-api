#!/bash/bin

curl "localhost:1234/rest/v1/price?batch=1" > pre.json
curl localhost:1234/rest/v1/history > history.json
curl localhost:1234/rest/v1/store > stores.json
node filterPrices.js > prices.json
node combine.js > final.json
pigz -v9 final.json
#rm pre.json
#rm prices.json
#rm stores.json
#rm history.json
