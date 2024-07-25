const generateCode = (length)=>{
    const letters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ1234567890';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      result += letters[randomIndex];
    }
    return result;
  }

  module.exports = {generateCode}