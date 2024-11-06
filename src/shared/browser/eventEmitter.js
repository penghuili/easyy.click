class EventEmitter {
  constructor() {
    this.events = {};
  }

  // Register an event listener
  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  // Emit an event and call all listeners
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }

  // Wait for an event to be emitted once
  once(event) {
    return new Promise(resolve => {
      const listener = (...args) => {
        this.off(event, listener); // Remove listener after it's called
        resolve(...args);
      };
      this.on(event, listener);
    });
  }

  // Remove a listener from an event
  off(event, listenerToRemove) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
  }
}

export const eventEmitter = new EventEmitter();

export const eventEmitterEvents = {
  refreshed: 'refreshed',
  settingsFetched: 'settingsFetched',
  loggedIn: 'loggedIn',
  logout: 'logout',
  toast: 'toast',
};
