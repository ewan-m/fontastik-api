export function getEmailBody(name: string, token: string) {
	return `
<h1>
    Fontastik Sign In Link
</h1>
<p>
    Hi ${name},
</p>
<p style="max-width: 60ch;">
    To sign in to your account simply use the following magic link to be automatically signed in. It would be a good idea to then change your password once you've signed in.
</p>
<p>
    <a href="${process.env.APPLICATION_URL}/sign-in?token=${token}">Sign in to Fontastik</a>
</p>
<p>
Ewan - Fontastik ❤️
</p>`;
}
