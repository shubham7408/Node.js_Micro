const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/identity-service.js");
const logger = require("./utils/logger.js");
const app = express();
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const { RedisStore } = require("rate-limit-redis");
const { rateLimit } = require("express-rate-limit");
const errorHandler = require("./middlewares/error_handler.js");
const PORT = process.env.PORT || 3001;

const redisClient = new Redis(process.env.REDIS_URL);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    logger.info(`Request received: ${req.method} ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});


const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 10,
    duration: 1,
})

app.use((req, res, next) => {
    rateLimiter.consume(req.ip).then(() => next()).catch(() => {
        logger.warn(`Rate limit exceed for ${req.ip}`);
        res.status(429).json({
            success: false,
            message: "To many request"
        });
    })
});

const sensitiveEndpointLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensetive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({
            success: false,
            message: "To many request"
        });
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
})

app.use("/api/auth/register", sensitiveEndpointLimiter);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

async function StartServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

StartServer();