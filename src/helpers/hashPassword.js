import  bcrypt  from 'bcrypt';

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); //salting factor
  const hashedPassword = await bcrypt.hash(password, salt); //encripta
  return hashedPassword;
};

async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) {
    throw new Error('Data and hash arguments required');
  }
  return await bcrypt.compare(password, hashedPassword);
}

export {hashPassword, comparePassword };