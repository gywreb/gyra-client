export const extractKeyFromNameTxt = name => {
  const nameArray = name.includes('-') ? name.split('-') : name.split(' ');
  if (nameArray.length === 1) {
    if (name.length > 4) return name.slice(0, 3).toUpperCase();
    else return name.toUpperCase();
  } else if (nameArray.length > 1) {
    if (nameArray.length > 4)
      return nameArray
        .slice(0, 4)
        .reduce((acc, text) => (acc += text.slice(0, 1).toUpperCase()), '');
    else
      return nameArray.reduce(
        (acc, text) => (acc += text.slice(0, 1).toUpperCase()),
        ''
      );
  } else return '';
};
