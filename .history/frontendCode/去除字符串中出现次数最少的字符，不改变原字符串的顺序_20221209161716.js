// dddddnnnsssss
const clean = (params) => {
  const st = {};
  const num = Array.from(params);
  num.map((i) => {
    if (!st.st[i]) {
      st[i] = 1;
    }
  });
};
