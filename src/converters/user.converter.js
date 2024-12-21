const toSimpleUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

module.exports = {
  toSimpleUser,
};
