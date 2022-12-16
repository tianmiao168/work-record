// dddddnnnsssss
const clean = (params) => {
  const st = {};
  const num = Array.from(params);
  num.map((i) => {
    if (!st[i]) {
      st[i] = 1;
    } else {
      st[i] = st[i]++;
    }
  });
  return st;
};
clean("wwwwwwdddddfff");
