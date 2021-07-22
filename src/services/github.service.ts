import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GithubService {
	private githubAccessToken: string;
	private readonly githubUrl =
		"https://api.github.com/repos/ewan-m/fontastik-data/contents";
	private readonly acceptHeader = "application/vnd.github.v3+json";
	private githubBranch: string;

	constructor(private http: HttpService) {
		this.githubAccessToken = process.env.GITHUB_TOKEN;
		this.githubBranch = process.env.GITHUB_BRANCH;
	}

	async postFile(fileName: string, content: string, commitMessage: string) {
		try {
			const file = await this.http
				.get(`${this.githubUrl}/${fileName}?ref=${this.githubBranch}`, {
					headers: {
						accept: this.acceptHeader,
						authorization: `token ${this.githubAccessToken}`,
					},
				})
				.toPromise();
			if (file.data.sha) {
				await this.http
					.delete(
						`${this.githubUrl}/${fileName}?branch=${this.githubBranch}&sha=${file.data.sha}&message=Revert: '${commitMessage}'`,
						{
							headers: {
								accept: this.acceptHeader,
								authorization: `token ${this.githubAccessToken}`,
							},
						}
					)
					.toPromise();
			}
		} catch (error) {}
		return this.http
			.put(
				`${this.githubUrl}/${fileName}`,
				{
					message: commitMessage,
					content,
					branch: this.githubBranch,
				},
				{
					headers: {
						accept: this.acceptHeader,
						authorization: `token ${this.githubAccessToken}`,
					},
				}
			)
			.toPromise();
	}
}
