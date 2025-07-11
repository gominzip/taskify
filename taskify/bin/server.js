import BrowserSync from "browser-sync";
import nodemon from "nodemon";
const browserSync = BrowserSync.create();

// Nodemon이 서버를 재시작할 때 BrowserSync가 브라우저를 새로 고침
nodemon({
  script: "./bin/www.js",
  ext: "js html css ejs",
})
  .on("start", () => {
    if (!browserSync.active) {
      browserSync.init({
        proxy: "http://localhost:3000",
        files: ["src/public/**/*.*", "src/views/**/*.*"],
        port: 4000, // BrowserSync가 제공할 포트
        reloadDelay: 1000, // 재시작 후 지연 시간
      });
    }
  })
  .on("restart", () => {
    browserSync.reload({ stream: false });
  });
