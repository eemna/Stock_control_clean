import cron from "cron";
import https from "https";

const API_URL = process.env.API_URL || "https://stock-control-dike.onrender.com/api/health";

const job = new cron.CronJob("*/14 * * * *", function () {
  https
    .get(API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log(`[CRON] ✅ Health check succeeded: ${API_URL}`);
      } else {
        console.log(`[CRON] ❌ Failed with status: ${res.statusCode}`);
      }
    })
    .on("error", (e) => console.error(`[CRON] 🚨 Error while sending request: ${e.message}`));
});

export default job;



 
