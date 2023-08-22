import mongoose from "mongoose";

import app from "./server";
const PORT = 3400;

mongoose
  .connect(
    "mongodb+srv://adeoul001:RMfBrCYYtvUyXiNR@nodejsintern.d53fa5k.mongodb.net"
  )
  .then(() => {
    console.log("Connected to database ");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

// RMfBrCYYtvUyXiNR
