const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  const { email, mobileNo, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email }, { mobileNo }] });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '2d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        mobileNo: user.mobileNo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
