const { HttpException, HttpStatus } = require('@nestjs/common');
try {
  throw new HttpException(undefined, HttpStatus.INTERNAL_SERVER_ERROR);
} catch (e) {
  console.log("Caught:", e);
}
console.log("Did not crash");
