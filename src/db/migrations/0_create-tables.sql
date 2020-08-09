CREATE TABLE user {
    userId SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    passwordSalt TEXT NOT NULL,
    isBlocked BOOLEAN NOT NULL DEFAULT 'false',
    profilePictureUrl TEXT,
};

CREATE TABLE font {
    fontId SERIAL PRIMARY KEY,
    userId SERIAL REFERENCES user_identity(userId),
    fontTtf BYTEA,
    fontCharacters JSONB,
};

CREATE TABLE post {
    postId SERIAL PRIMARY KEY,
    userId SERIAL REFERENCES user_identity(userId),
    fontId SERIAL REFERENCES font(fontId),
    content TEXT,
    created TIMESTAMP with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    location POINT
};

CREATE TABLE postLike {
    postLikesId SERIAL PRIMARY KEY,
    postId SERIAL REFERENCES post(postId),
    userId SERIAL REFERENCES user(userId)
};

CREATE TABLE offenseReport {
    offenseReportId SERIAL PRIMARY KEY,
    reportType TEXT,
    postOrUserId SERIAL,  
    created timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
}
