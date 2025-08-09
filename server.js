require("dotenv").config();
const express = require("express");
const {configureCors} = require("./src/config/corsConfig");
const { requestLogger, addTimeStamp } = require("./src/middleware/customMiddleware");
const { globalErrorhandler } = require("./src/middleware/errorHandler");
const { urlVersioning } = require("./src/middleware/apiVersioning");
const { createBasicRateLimiter } = require("./src/middleware/rateLimiting");
const itemRoutes = require('./src/routes/item-routes.js')
const app = express();
const PORT = process.env.PORT || 3000;

//express json middleware
app.use(requestLogger);
app.use(addTimeStamp);

app.use(configureCors());
app.use(createBasicRateLimiter(2,15*60*1000)) // 100 request per 15 minutes
app.use(express.json());

app.use(urlVersioning('v1'));
app.use('/api/v1',itemRoutes);

app.use(globalErrorhandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
