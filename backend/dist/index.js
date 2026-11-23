import { app } from "./app.js";
import { env } from "./utils/env.js";
import { ensureDatabaseTables } from "./utils/initDb.js";
const port = Number(env.PORT);
app.listen(port, async () => {
    console.log(`API running on port ${port}`);
    await ensureDatabaseTables();
});
