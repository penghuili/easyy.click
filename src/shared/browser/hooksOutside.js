const hooks = {};
const hooksReturnValues = {};

export function setHook(name, hook) {
  hooks[name] = { name, hook };
}

export function getHook(name) {
  return hooksReturnValues[name];
}

export function HooksOutsieWrapper() {
  Object.values(hooks).forEach(({ name, hook }) => (hooksReturnValues[name] = hook()));
  return null;
}
