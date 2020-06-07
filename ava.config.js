export default {
  babel: {
    compileEnhancements: false
  },
  files: ["./ava/*.ts"],
  require: ['ts-node/register'],
  extensions: ['ts']
};