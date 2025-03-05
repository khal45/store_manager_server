import bcrypt from "bcrypt";
const saltRounds = 12;
const userPassword = "henrykelvin@attendant";

const returnHash = () => {
  const hash = bcrypt.hashSync(userPassword, saltRounds);
  return hash;
};

const hashedPassword = returnHash();
console.log(hashedPassword);

let passwords = [
  "johndoe@admin",
  "vanessasatone@attendant",
  "boblious@attendant",
  "josephjoestar@attendant",
  "henrykelvin@attendant",
];
