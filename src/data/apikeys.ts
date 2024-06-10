const { KEY1, KEY2, KEY3, KEY4, KEY5, KEY6, KEY7 } = process.env;

export const apiKeys: string[] = [
  KEY1 || "",
  KEY2 || "",
  KEY3 || "",
  KEY4 || "",
  KEY5 || "",
  KEY6 || "",
  KEY7 || "",
];
