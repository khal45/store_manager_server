const verifyUserToken = (req, res) => {
  try {
    const { username, role } = req.user;

    if (!username || !role) {
      return res.status(400).json({ message: "Invalid token payload" });
    }

    res.status(200).json({ username, role });
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyUserToken;
