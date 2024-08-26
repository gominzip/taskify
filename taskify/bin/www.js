import app from "../app.js";
import { testDBConnection } from "../src/config/db.js";
const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`${PORT}번 포트 서버 가동 ╭( ･ㅂ･)و )))`);
  await testDBConnection();
});
