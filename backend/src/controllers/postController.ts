import express from "express";
import { Post } from "../business/model/post";
import { PostDeleteService, PostFetchService, PostInsertService, PostUpdateService } from "../business/service/postService";
import { errorMessage } from "../util/errors";

export class PostInsertController {
	private _service!: PostInsertService;

	constructor(service: PostInsertService) {
		this._service = service;
	}

	public async upload(req: express.Request, res: express.Response): Promise<void> {
		try {
			const userRole = req.body.userRole;
			if (userRole !== "Artist") {
				throw new Error("Only artists can create posts");
			}

			const description: string = req.body.post._description;
			if (description === undefined) {
				throw new Error("Description can not be undefined.");
			}

			const username: string = req.body.userName;
			if (username === undefined) {
				throw new Error("Username not found.");
			}
			const post: Post = new Post(description);

			res.status(201).json(await this._service.uploadPost(post, username));
		} catch (error) {
			console.error(error);
			res.status(400).json(errorMessage(error));
		}
	}
}

export class PostFetchController {
	private _service!: PostFetchService;

	constructor(service: PostFetchService) {
		this._service = service;
	}

	public async getAllPosts(req: express.Request, res: express.Response): Promise<void> {
		try {
			const artistName = req.query.artistName as string;
			if (!artistName) {
				throw new Error("Artist name is required.");
			}
			const posts: Post[] = await this._service.getAllPosts(artistName);

			res.status(200).json(posts);
		} catch (error) {
			console.error(error);
			res.status(500).json(errorMessage(error));
		}
	}
}

export class PostUpdateController {
	private _service!: PostUpdateService;

	constructor(service: PostUpdateService) {
		this._service = service;
	}

	public async update(req: express.Request, res: express.Response): Promise<void> {
		try {
			const description: string = req.body._description;
			const postTimeBody: string = req.body._postTime;
			const postTimeFormatted: string = this.addHourToPostTime(postTimeBody);
			const artistName: string = req.body._artistName;

			const post: Post = new Post(description);
			res.status(200).json(await this._service.updatePost(post, postTimeFormatted, artistName));
		} catch (error) {
			console.error(error);
			res.status(400).json(errorMessage(error));
		}
	}

	public addHourToPostTime(postTimeBody: string): string {
		const postTimeFormatted = new Date(postTimeBody);

		postTimeFormatted.setHours(postTimeFormatted.getHours() + 1);

		return postTimeFormatted.toISOString().slice(0, 19).replace("T", " ");
	}
}

export class PostDeleteController {
	private _service!: PostDeleteService;

	constructor(service: PostDeleteService) {
		this._service = service;
	}

	public async delete(req: express.Request, res: express.Response): Promise<void> {
		try {
			const postTimeBody = req.query.postTime;
			let postTimeFormatted = " ";
			if (typeof postTimeBody === "string") {
				postTimeFormatted = new Date(postTimeBody).toISOString().slice(0, 19).replace("T", " ");
			}

			const artistName = req.query.artistName;

			if (typeof artistName !== "string") {
				throw new Error("Wrong date type");
			}

			await this._service.deletePost(postTimeFormatted, artistName);
			res.status(200).json({ message: "Post deleted" });
		} catch (error) {
			res.status(500).json({ error: "Something went wrong while deleting your post: " + errorMessage(error) });
		}
	}
}
