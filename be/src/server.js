require('dotenv').config();
const express = require('express');
const cors = require('cors');
const configPublicfile = require('./config/configPublicfile');
const configBody = require('./config/xulySession');
const api = require('./routes/api');

const app = express();
const port = process.env.PORT || 3000;
const hostname = process.env.HOST_NAME;

configPublicfile(app);
configBody(app);


app.use(cors()); 
app.use('/', api);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
