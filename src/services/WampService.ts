interface WelcomeMessage {
  0: 0; // Welcome
  1: string; // sessionId
  2: string; // Version
  3: string; // Extra information (optional)
}

interface CallMessage {
  0: 2; // Call
  1: string; // callId
  2: string; // URI or procedure to call
  3: any[]; // Arguments (optional)
}

interface CallResultMessage {
  0: 3; // CallResult
  1: string; // callId
  2: any; // Result
}

interface CallErrorMessage {
  0: 4; // CallError
  1: string; // callId
  2: string; // Error URI
  3: string; // Error details
}

interface SubscribeMessage {
  0: 5; // Subscribe
  1: string; // subscriptionId
  2: string; // Topic URI
}

interface EventMessage {
  0: 8; // Event
  1: string; // subscriptionId
  2: any; // Event data
}

interface HeartbeatMessage {
  0: 20; // Heartbeat
  1: number; // Ping counter
}

type WampMessage =
  | WelcomeMessage
  | CallMessage
  | CallResultMessage
  | CallErrorMessage
  | SubscribeMessage
  | EventMessage
  | HeartbeatMessage;

interface LoginResponse {
  Token: string;
  Username: string;
}

export class WampService {
  private readonly websocket: WebSocket | null = null
  private sessionId: string | null = null
  private pingCounter = 0

  constructor (private url: string) {
    this.websocket = new WebSocket(this.url)
  }

  connect (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.websocket) {
        return reject(new Error('WebSocket instance not created'))
      }

      this.websocket.onopen = () => {
        console.log('Connected to WAMP server')
        this.startPing()
        resolve()
      }

      this.websocket.onmessage = (event) => {
        const message = JSON.parse(event.data)
        this.handleMessage(message)
      }

      this.websocket.onclose = (event) => {
        console.error('Disconnected from WAMP server', event)
        reject(new Error(`Connection closed: ${event.reason}`))
      }

      this.websocket.onerror = (event) => {
        console.error('WebSocket error', event)
        reject(new Error('WebSocket error occurred'))
      }
    })
  }

  private handleMessage (message: WampMessage) {
    const type = message[0]

    switch (type) {
      case 0: // Welcome message
        this.sessionId = String(message[1])
        console.log(`Session established with ID: ${this.sessionId}`)
        break

      case 8: // Event message
        console.log('Event received:', message[2])
        break

      case 3: // CallResult
        console.log('Call result received:', message[2])
        break

        // Добавьте другие кейсы для обработки других типов сообщений...

      default:
        console.warn('Unknown message type:', type)
    }
  }

  async login (username: string, password: string): Promise<LoginResponse> {
    const callId = this.generateCallId()
    const request = [2, callId, 'http://enter.local/login', username, password]
    const response = await this.sendRequest(request)
    return response as { Token: string; Username: string; }
  }

  async loginByToken (token: string): Promise<{ Token: string; Username: string; }> {
    const callId = this.generateCallId()
    const request = [2, callId, 'http://enter.local/loginByToken', token]
    const response = await this.sendRequest(request)
    return response as { Token: string; Username: string; }
  }

  async subscribeToLogs (callback: (event: any) => void): Promise<void> {
    if (!this.sessionId) throw new Error('Session is not established')
    const request = [5, 'http://enter.local/subscription/logs/list']
    this.websocket?.send(JSON.stringify(request))

    this.websocket!.onmessage = (event) => {
      const message: WampMessage = JSON.parse(event.data)
      const type = message[0] // Тип сообщения

      if (type === 8) {
        // Проверяем, что это сообщение типа EventMessage
        const eventMessage = message as EventMessage
        const data = eventMessage[2] // Теперь TypeScript знает, что `2` существует
        callback(data)
      }
    }
  }

  async logout (): Promise<void> {
    const callId = this.generateCallId()
    const request = [2, callId, 'http://enter.local/logout']
    await this.sendRequest(request)
  }

  private generateCallId (): string {
    return Math.random().toString(36).substring(2, 18)
  }

  private async sendRequest (request: any): Promise<any> {
    if (!this.websocket) throw new Error('WebSocket is not connected')

    return new Promise((resolve, reject) => {
      const callId = request[1]
      const onMessage = (event: MessageEvent) => {
        const message = JSON.parse(event.data)
        if (message[1] === callId) {
          this.websocket!.removeEventListener('message', onMessage)
          if (message[0] === 3) {
            resolve(message[2])
          } else if (message[0] === 4) {
            reject(new Error(message[3]))
          }
        }
      }
      if (this.websocket) {
        this.websocket.addEventListener('message', onMessage)
        this.websocket.send(JSON.stringify(request))
      }
    })
  }

  private startPing (): void {
    setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        const pingMessage = [20, this.pingCounter++]
        this.websocket.send(JSON.stringify(pingMessage))
      }
    }, 30000)
  }

  disconnect (): void {
    if (this.websocket) {
      this.websocket.close()
      console.log('Disconnected from WAMP server')
    }
  }
}
