const getRecipientEmail = (users, userLoggedIn) =>
  users?.find((userToFilter) => userToFilter !== userLoggedIn.phoneNumber);

export default getRecipientEmail;
