const router = require('express').Router();
const User = require('../models/User');
// ❌ هذا غير موجود عندك
const Link = require('../models/Link');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');



router.post('/register', async (req, res) => {
  try {

    const { username, email, password } = req.body;

    // VALIDATION
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'All fields required'
      });
    }

    // USERNAME EXISTS
    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res.status(400).json({
        error: 'Username already used'
      });
    }

    // EMAIL EXISTS
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({
        error: 'Email already used'
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({
      message: 'Account created'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});
/*
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...req.body,
      password: hashedPassword
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
*/


router.post('/login', async (req, res) => {

  try {

    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username },
        { email: username }
      ]
    });

    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        error: 'Wrong password'
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d'
      }
    );
  
    res.cookie('token', token, {
      httpOnly: true,

      secure: false, // localhost

      sameSite: 'lax',

      maxAge: 1000 * 60 * 60 * 24 * 7
    });

    res.json({
      message: 'Logged in',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false
  });

  res.json({ message: 'Logged out' });
});

router.post('/change-password', auth, async (req, res) => {
  const user = await User.findById(req.user.id);

  const isMatch = await bcrypt.compare(req.body.current, user.password);
  if (!isMatch) return res.status(400).json({ error: "Wrong password" });

  user.password = await bcrypt.hash(req.body.new, 10);
  await user.save();

  res.json({ message: "Password updated" });
});

router.delete('/delete-account', auth, async (req, res) => {
  await User.findByIdAndDelete(req.user.id);
  await Link.deleteMany({ userId: req.user.id });

  res.clearCookie('token');
  res.json({ message: "Account deleted" });
});


router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
 
 res.json({
    id: user._id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    theme: user.theme,
    socialIcons: user.socialIcons
  });

});

module.exports = router;
