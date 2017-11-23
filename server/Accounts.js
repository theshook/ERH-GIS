var postSignUp = function (userId, info) {
  console.log(userId);
  console.log(info.profile.userType);
  Roles.addUsersToRoles(userId, ['normal-user', info.profile.userType]);
}

AccountsTemplates.configure({
  postSignUpHook: postSignUp
});
