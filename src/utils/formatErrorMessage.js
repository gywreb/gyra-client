export const formatErrorMessage = messageObject => {
  let errorMessage = '';
  for (let prop in messageObject) {
    errorMessage += `${messageObject[prop]}\n`;
  }
  return errorMessage;
};
