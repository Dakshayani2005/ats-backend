const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user.repository");

exports.register = (data, callback) => {
  userRepo.findUserByEmail(data.email, (err, users) => {
    if (users.length > 0) {
      return callback("User already exists");
    }

    const hashedPassword = bcrypt.hashSync(data.password, 10);

    const user = {
      email: data.email,
      password: hashedPassword,
      role: data.role,
      company_id: data.company_id
    };

    userRepo.createUser(user, callback);
  });
};

exports.login = (data, callback) => {
  userRepo.findUserByEmail(data.email, (err, users) => {
    if (users.length === 0) {
      return callback("Invalid credentials");
    }

    const user = users[0];
    const isMatch = bcrypt.compareSync(data.password, user.password);

    if (!isMatch) {
      return callback("Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        company_id: user.company_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    callback(null, token);
  });
};
