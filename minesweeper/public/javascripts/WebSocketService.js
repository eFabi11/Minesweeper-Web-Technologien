export default class WebSocketService {
    constructor(url, handlers) {
      this.url = url;
      this.handlers = handlers;
      this.socket = null;
    }
  
    connect() {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => console.log('WebSocket connected');
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.handlers[data.action]) {
          this.handlers[data.action](data);
        }
      };
      this.socket.onclose = () => console.log('WebSocket closed');
      this.socket.onerror = (error) => console.error('WebSocket error:', error);
    }
  
    send(action, data) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ action, data }));
      } else {
        console.warn('WebSocket not connected');
      }
    }
  
    close() {
      if (this.socket) this.socket.close();
    }
  }
  