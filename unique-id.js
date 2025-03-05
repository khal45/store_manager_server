const idGenerator = () => {
  let str = "#";
  for (let i = 0; i < 6; i++) {
    let randomNum = Math.floor(Math.random() * 10);
    str += randomNum;
  }
  return str;
};

export default idGenerator;
