import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv"; // Import dotenv for environment variables

dotenv.config();

const checkJwt = auth({
  audience: process.env.AUD,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: process.env.ALG,
});

// Your custom method to validate the token
export const isTokenValid = (req) => {
  return new Promise((resolve) => {
    checkJwt(req, null, (error) => {
      resolve(!error); // Resolve with true if the token is valid, false if not
    });
  });
};

export const getRoles = async (req) => {
  try {
    const isValid = await isTokenValid(req);

    if (!isValid) {
      return Promise.resolve(false);
    }

    const roles = req.auth.payload["https://asmadebyalex.com/roles"];
    return roles || []; // Return an empty array if roles are not present
  } catch (error) {
    return Promise.reject(error); // Reject the promise with the error message
  }
};

export const isSuperAdmin = async (req) => {
  try {
    const roles = await getRoles(req);

    if (roles && roles.includes("SuperAdmin")) {
      return Promise.resolve(true); // Resolve with true if the user is a SuperAdmin
    } else {
      return Promise.resolve(false); // Resolve with false if the user is not a SuperAdmin
    }
  } catch (error) {
    return Promise.reject(error); // Reject the promise with the error message
  }
};
