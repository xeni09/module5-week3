const sessions = [];

module.exports.sessions = sessions;

module.exports.checkAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split("Bearer ")[1];
  const session = sessions.find((x) => x.token === token);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
