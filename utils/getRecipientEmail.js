const getRecipientEmail = (users, userLoggedIn) => users?.filter(user => user !== userLoggedIn)[0];

export default getRecipientEmail;