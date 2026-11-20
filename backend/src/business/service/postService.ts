import { PostDeleteMysql, PostFetchMysql, PostInsertMysql, PostUpdateMysql } from "../../data/models/postMysql";
import { Post } from "../model/post";

export class PostInsertService {
	private _data!: PostInsertMysql;

	constructor(data: PostInsertMysql) {
		this._data = data;
	}

	public async uploadPost(post: Post, username: string): Promise<Post> {
		return this._data.upload(post, username);
	}
}

export class PostFetchService {
	private _data!: PostFetchMysql;

	constructor(data: PostFetchMysql) {
		this._data = data;
	}

	public async getAllPosts(artistName: string): Promise<Post[]> {
		return this._data.getAllPosts(artistName);
	}
}

export class PostUpdateService {
	private _data!: PostUpdateMysql;

	constructor(data: PostUpdateMysql) {
		this._data = data;
	}

	public async updatePost(post: Post, postTimeFormatted: string, artistName: string): Promise<Post> {
		return this._data.update(post, postTimeFormatted, artistName);
	}
}

export class PostDeleteService {
	private _data!: PostDeleteMysql;

	constructor(data: PostDeleteMysql) {
		this._data = data;
	}

	public async deletePost(postTimeFormatted: string, artistName: string): Promise<void> {
		await this._data.delete(postTimeFormatted, artistName);
	}
}
