const browserSync = require("browser-sync").create();
const nodemon = require("nodemon");

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
    setTimeout(() => {
      browserSync.reload({ stream: false });
    }, 1000);
  });
