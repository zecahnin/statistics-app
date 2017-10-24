const express = require('express');
const app = express();
var queryStat = require('./build/serviceQuery')();

const port = 5555;

console.log('> Starting app edulivre');

const staticFileMiddleware = express.static('dist');
app.use(staticFileMiddleware);


app.use('/statics/query', function (req, res) {
  queryStat.query(req, res);
});

app.listen(port, () => {
  console.log(`Edulivre app listening on port ${port}!`);
});
