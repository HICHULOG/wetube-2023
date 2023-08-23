import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "Hello!",
        resave: false,
        saveUninitialized: false,
        // url을 string채로 두면 누군가가 DB URL을 알고 연결할수 있기 때문에 위험하다
        store: MongoStore.create({mongoUrl:"mongodb://127.0.0.1:27017/wetube"}),
    })
);

// session middleware다음에 있어야함!!
// 그래야 localsMiddleware가 session object에 접근할 수 있음.
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;