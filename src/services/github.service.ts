import { HttpService, Injectable } from "@nestjs/common";

@Injectable()
export class GithubService {
	private githubAccessToken: string;
	private readonly githubUrl =
		"https://api.github.com/repos/ewan-m/fontastik-data/contents";
	private githubBranch: string;

	constructor(private http: HttpService) {
		this.githubAccessToken = process.env.GITHUB_TOKEN;
		this.githubBranch = process.env.GITHUB_BRANCH;
	}

	postFile(fileName: string, content: string, commitMessage: string) {
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
						accept: "application/vnd.github.v3+json",
						authorization: `token ${this.githubAccessToken}`,
					},
				}
			)
			.toPromise();
	}
}
