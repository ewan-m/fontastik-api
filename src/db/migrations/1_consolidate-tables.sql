ALTER TABLE user_identity
ADD COLUMN has_saved_font BOOLEAN NOT NULL default 'false';

UPDATE user_identity
SET has_saved_font = font.has_saved_font FROM font
WHERE user_identity.user_id = font.user_id;

DROP TABLE font;
