import { CognitoJwtVerifier } from "aws-jwt-verify";

// Verifier that expects valid access tokens:
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.AWS_USER_POOL_ID,
  tokenUse: "access",
  clientId: process.env.AWS_CLIENT_ID,
});

export async function verify(auth_header) {
  if (!auth_header.startsWith("Bearer")) {
    return false;
  }
  let token = auth_header.split(" ")[1];
  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch {
    return false;
  }
}
