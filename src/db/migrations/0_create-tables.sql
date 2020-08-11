CREATE TABLE user_identity (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    is_blocked BOOLEAN NOT NULL DEFAULT 'false',
    profile_picture_url TEXT
);

CREATE TABLE font (
    font_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES user_identity(user_id),
    font_ttf BYTEA,
    font_characters JSONB
);

CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    user_id SERIAL REFERENCES user_identity(user_id),
    font_id SERIAL REFERENCES font(font_id),
    content TEXT,
    created TIMESTAMP with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    location POINT
);

CREATE TABLE post_like (
    post_like_id SERIAL PRIMARY KEY,
    post_id SERIAL REFERENCES post(post_id),
    user_id SERIAL REFERENCES user_identity(user_id)
);

CREATE TABLE offense_report (
    user_id: SERIAL REFERENCES user_identity(user_id),
    offense_report_id SERIAL PRIMARY KEY,
    report_type TEXT,
    post_or_user_id SERIAL,  
    created timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);
