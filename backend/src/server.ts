import cors from "cors";
import express, { Request, Response } from "express";
import { ContactService, ContactUpdateService } from "./business/service/contactService";
import { PostDeleteService, PostFetchService, PostInsertService, PostUpdateService } from "./business/service/postService";
import { SubscriptionService } from "./business/service/subscriptionService";
import { UserService } from "./business/service/userService";
import { UserSessionService } from "./business/service/userSessionService";
import { config } from "./config";
import { ContactController, ContactUpdateController } from "./controllers/contactController";
import { PostDeleteController, PostFetchController, PostInsertController, PostUpdateController } from "./controllers/postController";
import { SubscribeController } from "./controllers/subscribeController";
import { UserController } from "./controllers/userController";
import { UserSessionController } from "./controllers/userSessionController";
import { ContactInsertMysql, ContactUpdateMysql } from "./data/models/contactMysql";
import { PostDeleteMysql, PostFetchMysql, PostInsertMysql, PostUpdateMysql } from "./data/models/postMysql";
import { SubscriptionMysql } from "./data/models/subscriptionMysql";
import { UserMysql } from "./data/models/userMysql";
import { UserSessionMysql } from "./data/models/userSessionMysql";

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({ status: "ok" });
});

app.post("/user/register", (req: Request, res: Response) => {
	new UserController(new UserService(new UserMysql())).register(req, res);
});

app.post("/userSessions", (req: Request, res: Response) => {
	new UserSessionController(new UserSessionService(new UserSessionMysql())).signin(req, res);
});

app.post("/subscription", (req: Request, res: Response) => {
	new SubscribeController(new SubscriptionService(new SubscriptionMysql())).createSubscription(req, res);
});

app.get("/subscription/:username", (req: Request, res: Response) => {
	new SubscribeController(new SubscriptionService(new SubscriptionMysql())).getSubscription(req, res);
});

app.patch("/subscription/:username", (req: Request, res: Response) => {
	new SubscribeController(new SubscriptionService(new SubscriptionMysql())).updateSubscriptionStatus(req, res);
});

app.post("/posts", (req: Request, res: Response) => {
	new PostInsertController(new PostInsertService(new PostInsertMysql())).upload(req, res);
});

app.get("/posts", (req: Request, res: Response) => {
	new PostFetchController(new PostFetchService(new PostFetchMysql())).getAllPosts(req, res);
});

app.patch("/posts", (req: Request, res: Response) => {
	new PostUpdateController(new PostUpdateService(new PostUpdateMysql())).update(req, res);
});

app.delete("/posts", (req: Request, res: Response) => {
	new PostDeleteController(new PostDeleteService(new PostDeleteMysql())).delete(req, res);
});

app.post("/contact", (req: Request, res: Response) => {
	new ContactController(new ContactService(new ContactInsertMysql())).submitContact(req, res);
});

app.get("/contact", (req: Request, res: Response) => {
	new ContactController(new ContactService(new ContactInsertMysql())).getContacts(req, res);
});

app.patch("/contact", (req: Request, res: Response) => {
	new ContactUpdateController(new ContactUpdateService(new ContactUpdateMysql())).updateMessageStatus(req, res);
});

app.listen(config.port, () => {
	console.log(`Server draait op http://localhost:${config.port}`);
});
