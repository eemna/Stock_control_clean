import { Redis } from '@upstash/redis';
import pkg from "@upstash/ratelimit";
import "dotenv/config";
const {Ratelimit} = pkg;
const ratelimit = new Ratelimit({
  redis : Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(500,"60 s"),
});

export default ratelimit;
