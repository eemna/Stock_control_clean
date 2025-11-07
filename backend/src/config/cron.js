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



  // CRON JOB EXPLANATION:
  // Cron jobs are scheduled tasks that run periodically at fixed intervals.
  // Example here: we want to send 1 GET request every 14 minutes.

  // How to define a "Schedule"?
  // You define a schedule using a cron expression (5 fields) representing:

  //  MINUTE  HOUR  DAY OF THE MONTH  MONTH  DAY OF THE WEEK

  // EXAMPLES & EXPLANATION:
  // */14 * * * *   → Every 14 minutes
  // 0 0 * * 0      → At midnight on every Sunday
  // 30 3 15 * *    → At 3:30 AM on the 15th of every month
  // 0 0 1 1 *      → At midnight on January 1st
  // 0 * * * *      → Every hour

