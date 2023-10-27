const express = require("express");
const app = express();
const port = 8080;

app.use(express.json());
app.use("/api", require("./Routes/routes"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
