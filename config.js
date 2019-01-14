/* Configuring our App */
const config = {
    port: process.env.PORT,
    host: process.env.HOST,
    secret: process.env.SECRET,
    redisPort: process.env.REDIS_PORT,
    redisHost: process.env.REDIS_HOST,
    socketIoUrl: process.env.SOCKETIO_URL,
    routes: {
        login: "/account/login",
        logout: "/account/logout",
        chat: "/chat",
        signUp: "/account/signup",
        facebookAuth: "/auth/facebook",
        facebookAuthCallback: "/auth/facebook/callback",
        googleAuth: "/auth/google",
        googleAuthCallback: "/auth/google/callback",
        twitterAuth: "/auth/twitter",
        twitterAuthCallback: "/auth/twitter/callback"
    },
    facebook: {
        appID: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET
    },
    google: {
        clientID: process.env.GOOGLE_APP_ID,
        clientSecret: process.env.GOOGLE_APP_SECRET
    },
    twitter: {
        appID: "",
        appSecret: ""
    },
    crypto: {
        workFactor: 5000,
        keylen: 64,
        randomSize: 256,
        digest: "sha512"
    },
    RabbitMQ: {
        URL: process.env.RABBITMQ,
        exchange: process.env.RABBITMQ_EXCHANGE
    },
    RedisMemoryCleanUp: {
        delta: 48 * 60 * 60 * 1000,
        interval: 24 * 60 * 60 * 1000
    }
};

export default config;
