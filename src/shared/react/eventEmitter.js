export const eventEmitter = {
  emit: (type, data) => {
    document.dispatchEvent(new CustomEvent(type, { detail: data }));
  },
  once: (type, callback) => {
    const handleEvent = event => {
      callback(event.detail);
      document.removeEventListener(type, handleEvent);
    };
    document.addEventListener(type, handleEvent);
  },
  on: (type, callback) => {
    const handleEvent = event => {
      callback(event.detail);
    };
    document.addEventListener(type, handleEvent);
  },
  off: (type, callback) => {
    document.removeEventListener(type, callback);
  },
  wait: async type => {
    return new Promise(resolve => {
      const handleEvent = event => {
        resolve(event.detail);
        document.removeEventListener(type, handleEvent);
      };
      document.addEventListener(type, handleEvent);
    });
  },
};

export const eventEmitterEvents = {
  refreshed: 'refreshed',
  settingsFetched: 'settingsFetched',
  loggedIn: 'loggedIn',
};
