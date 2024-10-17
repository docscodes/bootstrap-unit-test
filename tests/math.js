function square(n) {
  return n * n;
}

function mockSquare(n, multiply) {
  return multiply(n,n);
}


module.exports = {
  square,
  mockSquare
};
