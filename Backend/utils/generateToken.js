import jwt from 'jsonwebtoken';

export const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('rentmate_token', token, {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return token;
};