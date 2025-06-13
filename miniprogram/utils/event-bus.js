/**
 * Event Bus for WeChat Mini Program
 * @class EventBus
 */
class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event to subscribe to
   * @param {Function} callback - Callback function to be executed when event is published
   * @param {Object} [context] - The context to bind the callback to
   * @returns {Function} - Unsubscribe function
   */
  on(eventName, callback, context = null) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set());
    }
    
    const subscription = {
      callback: context ? callback.bind(context) : callback,
      context
    };
    
    this.events.get(eventName).add(subscription);
    
    // Return unsubscribe function
    return () => this.off(eventName, callback, context);
  }

  /**
   * Subscribe to an event once (automatically unsubscribes after first trigger)
   * @param {string} eventName - Name of the event to subscribe to
   * @param {Function} callback - Callback function to be executed when event is published
   * @param {Object} [context] - The context to bind the callback to
   * @returns {Function} - Unsubscribe function
   */
  once(eventName, callback, context = null) {
    const onceCallback = (...args) => {
      this.off(eventName, onceCallback, context);
      callback.apply(context, args);
    };
    return this.on(eventName, onceCallback, context);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event to unsubscribe from
   * @param {Function} callback - The callback function to unsubscribe
   * @param {Object} [context] - The context the callback was bound to
   */
  off(eventName, callback, context = null) {
    if (!this.events.has(eventName)) return;
    
    const subscriptions = this.events.get(eventName);
    for (const subscription of subscriptions) {
      if (subscription.callback === callback && subscription.context === context) {
        subscriptions.delete(subscription);
        break;
      }
    }
    
    if (subscriptions.size === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Publish an event
   * @param {string} eventName - Name of the event to publish
   * @param {...any} args - Arguments to pass to the callback functions
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) return;
    
    const subscriptions = this.events.get(eventName);
    subscriptions.forEach(subscription => {
      try {
        subscription.callback(...args);
      } catch (error) {
        console.error(`Error in event handler for ${eventName}:`, error);
      }
    });
  }

  /**
   * Clear all subscriptions for a specific event
   * @param {string} eventName - Name of the event to clear
   */
  clearEvent(eventName) {
    this.events.delete(eventName);
  }

  /**
   * Clear all subscriptions
   */
  clearAll() {
    this.events.clear();
  }
}

// Create a singleton instance
const eventBus = new EventBus();

// Export the singleton instance
export default eventBus; 