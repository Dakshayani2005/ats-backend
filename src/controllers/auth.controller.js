const authService = require("../services/auth.service");

exports.register = (req, res) => {
  authService.register(req.body, (err) => {
    if (err) return res.status(400).json({ message: err });
    res.json({ message: "User registered successfully" });
  });
};

exports.login = (req, res) => {
  authService.login(req.body, (err, token) => {
    if (err) return res.status(401).json({ message: err });
    res.json({ token });
  });
};
