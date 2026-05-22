import { app } from "./app.js";
import { env } from "./utils/env.js";

const port = Number(env.PORT);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});
