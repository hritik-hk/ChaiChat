import crypto from "crypto";
import jwt from "jsonwebtoken";

type hashPasswordType = {
  salt: Buffer;
  hash: Buffer;
};

type User = {
  _id: string;
  name: string;
};

function genPassword(password: string): hashPasswordType {
  const salt = crypto.randomBytes(32);
  const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");

  return {
    salt: salt,
    hash: genHash,
  };
}

function validPassword(password: string, hash: Buffer, salt: Buffer): boolean {
  // Hash user-entered password using PBKDF2 with SHA-512, generating a Buffer
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512");
  return crypto.timingSafeEqual(hashedPassword, hash);
}

function issueJWT(user: User) {
  const expiresIn = process.env.JWT_EXPIRY;
  const jwt_secret = process.env.JWT_SECRET as string;

  const payload = {
    userId: user._id,
  };

  const signedToken = jwt.sign(payload, jwt_secret, {
    expiresIn: expiresIn,
  });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn,
  };
}

export { issueJWT, genPassword, validPassword };
