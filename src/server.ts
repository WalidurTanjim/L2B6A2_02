import app from "./app";
import config from "./config";

const port = config.PORT;

app.listen(port, () => {
  console.log("L2B6A2_02 listening with port:", port);
});