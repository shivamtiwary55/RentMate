import jwt from 'jsonwebtoken';

export const generateToken = (res, userId, role) => {
  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Store token in HTTP-only cookie (safer than localStorage)
  res.cookie('rentmate_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};