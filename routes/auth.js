
const router = require('express').Router();
const User = require('../models/User');
// ❌ هذا غير موجود عندك
const Link = require('../models/Link');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


const transporter = require('../utils/mail');



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

    // GENERATE TOKEN
//const verificationToken = uuidv4();
const verificationCode =
Math.floor(100000 + Math.random() * 900000).toString();


    // CREATE USER
    
   const user = await User.create({
  username,
  email,
  password: hashedPassword,
   verificationCode,

  verificationCodeExpires:
    Date.now() + 1000 * 60 * 10,
  
  isVerified: false
});


const info = await transporter.sendMail({

  //from: process.env.EMAIL_USER,
   from: '"Qevora" <abdelbassetelhajiri02@gmail.com>',

  to: email,

  subject: "Verification Code",

  html: `
    <div style="font-family:Arial;padding:20px">

      <h2>
        BioLink Verification
      </h2>

      <p>
        Your verification code is:
      </p>

      <h1
        style="
          letter-spacing:5px;
          color:#6366f1;
        "
      >
        ${verificationCode}
      </h1>

      <p>
        This code expires in 10 minutes.
      </p>

    </div>
  `
});
console.log(info);
    

    res.json({
  message: 'Account created. Please verify your email.'
});

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }
});

router.post('/verify-code', async (req, res) => {

  try {

    const { email, code } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        error: 'Account already verified'
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        error: 'Invalid code'
      });
    }

    if (
      user.verificationCodeExpires < Date.now()
    ) {

      return res.status(400).json({
        error: 'Code expired'
      });

    }

    user.isVerified = true;

    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.json({
      message: 'Email verified successfully'
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});



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
       secure: true,
      //secure: false, // localhost

      //sameSite: 'lax',
        sameSite: "none",

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
    //sameSite: 'lax',
    //secure: false,
     secure: true,
      sameSite: "none"
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
