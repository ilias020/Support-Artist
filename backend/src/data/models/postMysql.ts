import { ResultSetHeader, RowDataPacket } from "mysql2";
import { Post } from "../../business/model/post";
import { pool } from "../../util/database";
import { errorMessage, mysqlErrno } from "../../util/errors";

export class PostInsertMysql {
	public async getArtistName(username: string): Promise<string> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>("SELECT artistName FROM `support_artist_db`.`artists` WHERE userName = ?;", [username]);
			if (rows.length === 0) {
				throw new Error("User not found");
			}
			const artistName = rows[0].artistName;
			return artistName;
		} catch {
			throw new Error("Error");
		}
	}

	public async upload(post: Post, username: string): Promise<Post> {
		try {
			const artistName = await this.getArtistName(username);
			post.artistName = artistName;
			await pool
				.promise()
				.execute<ResultSetHeader>("INSERT INTO `support_artist_db`.`posts` (`description`, `postTime`, `artistName`) VALUES (?, ?, ?);", [
					post.description,
					post.postTime,
					post.artistName
				]);
			return post;
		} catch (error) {
			if (mysqlErrno(error) === 1048) {
				throw new Error(errorMessage(error));
			} else {
				throw new Error("Something went wrong while creating your post: " + errorMessage(error));
			}
		}
	}
}

export class PostFetchMysql {
	public async getAllPosts(artistName: string): Promise<Post[]> {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					"SELECT description, postTime, artistName FROM `support_artist_db`.`posts` WHERE artistName = ? ORDER BY postTime DESC;",
					[artistName]
				);

			const posts: Post[] = rows.map((row) => {
				const post = new Post(row.description);
				post.postTime = new Date(row.postTime);
				post.artistName = row.artistName;
				return post;
			});

			return posts;
		} catch (error) {
			throw new Error("Something went wrong while fetching posts: " + errorMessage(error));
		}
	}
}

export class PostUpdateMysql {
	public async update(post: Post, postTimeFormatted: string, artistName: string): Promise<Post> {
		try {
			const [result] = await pool
				.promise()
				.execute<ResultSetHeader>("UPDATE `support_artist_db`.`posts` SET description = ? WHERE postTime = ? AND artistName = ?;", [
					post.description,
					postTimeFormatted,
					artistName
				]);
			if (result.affectedRows !== 1) {
				throw new Error("Affected rows is not equal to 1");
			}

			const postTime = new Date(postTimeFormatted);
			post.postTime = postTime;
			post.artistName = artistName;

			return post;
		} catch (error) {
			if (mysqlErrno(error) === 1048) {
				throw new Error(errorMessage(error));
			} else {
				throw new Error("Something definitely went wrong while updating your post: " + errorMessage(error));
			}
		}
	}
}

export class PostDeleteMysql {
	public async delete(postTimeFormatted: string, artistName: string): Promise<void> {
		try {
			const [result] = await pool
				.promise()
				.execute<ResultSetHeader>("DELETE FROM `support_artist_db`.`posts` WHERE artistName = ? and postTime = ?;", [
					artistName,
					postTimeFormatted
				]);
			if (result.affectedRows !== 1) {
				throw new Error("Affected rows is not equal to 1");
			}
		} catch {
			throw new Error("Something went wrong while deleting your post");
		}
	}
}
