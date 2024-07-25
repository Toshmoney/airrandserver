const bcrypt = require('bcryptjs');

const testPasswordComparison = async (password, hashedPassword) => {
  const plainTextPassword = password;
  const hashedPassword = hashedPassword

  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  console.log("Passwords match:", isMatch);
};

testPasswordComparison();