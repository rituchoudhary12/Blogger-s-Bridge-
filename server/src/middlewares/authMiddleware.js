import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
  try {
    // get the access token from the request headers
    let accessToken = req.headers.authorization;

    // if no access token present return unauthorized request
    if (!accessToken) {
      res.status(401).json({
        status: false,
        message: "Unauthorized request !!!",
      });
    }
    // if access token present then
    else {
      // Split the access token and Bearer
      accessToken = accessToken.split(" ")[1];
      const decodedAccessToken = jwt.verify(accessToken, JWT_SECRET);

      // if no decodedAccessToken present then
      if (!decodedAccessToken) {
        res.status(401).json({
          status: false,
          message: "Unauthorized request !!!",
        });
      } else {
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decodedAccessToken.exp < currentTime) {
          res.status(401).json({
            status: false,
            message:
              "Token expired. Please use refresh token to get a new access token.",
          });
        } else {
          // Token is not expired, proceed with actions
          // and yes destructure the phonenumber from the token and append it to the req.body
          req.body = {
            ...req.body,
            user_id: decodedAccessToken.user_id,
          };
          next();
        }
      }
    }
  } catch (error) {
    console.log(JSON.stringify(error, null, 2));
    if (error.name === "TokenExpiredError") {
      res.status(401).json({
        status: false,
        message:
          "Token expired. Please use refresh token to get a new access token.",
      });
    }
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};
