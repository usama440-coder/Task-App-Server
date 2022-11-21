// Desc     =>  Validator for user registeration
const registerUserValidator = (name, email, password) => {
  if (
    name.length > 300 ||
    password.length < 6 ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  ) {
    return true;
  }
};

module.exports = registerUserValidator;
