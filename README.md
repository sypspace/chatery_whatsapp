# 🚀 Chatery WhatsApp API

![Chatery](https://sgp.cloud.appwrite.io/v1/storage/buckets/6941a5b70012d918c7aa/files/6941a69000028dec52d2/view?project=694019b0000abc694483&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbklkIjoiNjk0MWE4NjRjZGNhZGUxOTZmNTMiLCJyZXNvdXJjZUlkIjoiNjk0MWE1YjcwMDEyZDkxOGM3YWE6Njk0MWE2OTAwMDAyOGRlYzUyZDIiLCJyZXNvdXJjZVR5cGUiOiJmaWxlcyIsInJlc291cmNlSW50ZXJuYWxJZCI6IjE0NTE6MSIsImlhdCI6MTc2NTkxMDYyOH0.6DyBMKwzA6x__pQZn3vICDLdBfo0mEUlyMVAc3qEnyo)
A powerful WhatsApp API backend built with Express.js and Baileys library. Supports multi-session management, real-time WebSocket events, group management, and media handling.

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)
![Baileys](https://img.shields.io/badge/Baileys-7.x-orange.svg)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-purple.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Features

- 📱 **Multi-Session Support** - Manage multiple WhatsApp accounts simultaneously
- 🔌 **Real-time WebSocket** - Get instant notifications for messages, status updates, and more
- 👥 **Group Management** - Create, manage, and control WhatsApp groups
- 📨 **Send Messages** - Text, images, documents, locations, contacts, and more
- ↩️ **Reply to Messages** - Reply/quote specific messages with replyTo parameter
- 📊 **Poll Messages** - Send interactive polls with single or multiple choice
- 📤 **Bulk Messaging** - Send messages to multiple recipients with background processing
- 📥 **Auto-Save Media** - Automatically save incoming media to server
- 💾 **Persistent Store** - Message history with optimized caching
- 🔐 **Session Persistence** - Sessions survive server restarts
- 🎛️ **Admin Dashboard** - Web-based dashboard with real-time monitoring and API tester
- 📄 **Swagger UI** - Interactive API documentation at root URL

## 📖 Full Documentation

For complete and detailed documentation, please visit:

| 🌐 Documentation | Link                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Primary Docs** | [https://docs.chatery.app](https://docs.chatery.app/)                                                              |
| **Mirror Docs**  | [https://chatery-whatsapp-documentation.appwrite.network](https://chatery-whatsapp-documentation.appwrite.network) |

> 📚 The documentation includes complete API reference, examples, troubleshooting guides, and more.

## 📋 Table of Contents

- [Full Documentation](#-full-documentation)
- [Installation](#-installation)
  - [Standard Installation](#option-1-standard-installation)
  - [Docker Installation](#option-2-docker-installation)
- [Configuration](#-configuration)
- [API Key Authentication](#-api-key-authentication)
- [Quick Start](#-quick-start)
- [Dashboard](#-dashboard)
- [API Documentation](#-api-documentation)
  - [Sessions](#sessions)
  - [Messaging](#messaging)
  - [Bulk Messaging](#bulk-messaging-background-jobs)
  - [Chat History](#chat-history)
  - [Group Management](#group-management)
- [WebSocket Events](#-websocket-events)
- [Examples](#-examples)

## 🛠 Installation

### Option 1: Standard Installation

```bash
# Clone the repository
git clone https://github.com/farinchan/chatery_whatsapp.git
cd chatery_whatsapp

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start

# Or development mode with auto-reload
npm run dev
```

### Option 2: Docker Installation

```bash
# Clone the repository
git clone https://github.com/farinchan/chatery_whatsapp.git
cd chatery_whatsapp

# Create environment file
cp .env.example .env

# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

#### Docker Commands

| Command                           | Description                   |
| --------------------------------- | ----------------------------- |
| `docker-compose up -d`            | Start container in background |
| `docker-compose down`             | Stop and remove container     |
| `docker-compose logs -f`          | View live logs                |
| `docker-compose restart`          | Restart container             |
| `docker-compose build --no-cache` | Rebuild image                 |

#### Docker Volumes

The following data is persisted across container restarts:

| Volume             | Path                | Description           |
| ------------------ | ------------------- | --------------------- |
| `chatery_sessions` | `/app/sessions`     | WhatsApp session data |
| `chatery_media`    | `/app/public/media` | Received media files  |
| `chatery_store`    | `/app/store`        | Message history store |

## ⚙ Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
CORS_ORIGIN=*

# Dashboard Authentication
DASHBOARD_USERNAME=admin
DASHBOARD_PASSWORD=securepassword123

# API Key Authentication (optional - leave empty or 'your_api_key_here' to disable)
API_KEY=your_secret_api_key_here
```

## 🧰 Message Queue (BullMQ)

This project uses BullMQ to queue outgoing messages so you can apply delays, rate limits, and retries.

Requirements:

- Redis server available (default: localhost:6379).

Environment variables (optional):

- `REDIS_HOST` (default: `127.0.0.1`)
- `REDIS_PORT` (default: `6379`)
- `MESSAGE_QUEUE_NAME` (default: `message-queue`)
- `QUEUE_CONCURRENCY` (default: `5`) — number of concurrent worker jobs
- `RATE_LIMIT_MAX` (default: `20`) — max jobs per duration
- `RATE_LIMIT_DURATION` (default: `1000`) — duration in ms for rate limiting

Example: send a text message with a 5 second delay and high priority

```bash
curl -X POST http://localhost:3000/api/whatsapp/chats/send-text \
  -H "X-Api-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"mysession","chatId":"628123456789","message":"Hello after delay","delay":5000,"priority":1}'
```

Check job status:

```bash
curl -X GET http://localhost:3000/api/whatsapp/jobs/<jobId> -H "X-Api-Key: your_api_key"
```

Notes:

- Jobs return immediately with `jobId`. Use the job status endpoint to poll for completion or failures.
- Ensure Redis is running before starting the app: `redis-server` (default port 6379).

## 🔐 API Key Authentication

All WhatsApp API endpoints are protected with API key authentication. Include the `X-Api-Key` header in your requests.

### How to Enable

1. Set a strong API key in your `.env` file:

   ```env
   API_KEY=your_super_secret_key_12345
   ```

2. Include the header in all API requests:
   ```bash
   curl -X GET http://localhost:3000/api/whatsapp/sessions \
     -H "X-Api-Key: your_super_secret_key_12345"
   ```

### Disable Authentication

To disable API key authentication, leave `API_KEY` empty or set it to `your_api_key_here` in `.env`:

```env
API_KEY=
# or
API_KEY=your_api_key_here
```

### Error Responses

| Status | Message                  | Description                     |
| ------ | ------------------------ | ------------------------------- |
| 401    | Missing X-Api-Key header | API key not provided in request |
| 403    | Invalid API key          | API key doesn't match           |

### Dashboard Integration

When logging into the dashboard, you'll be prompted to enter your API key (optional). This allows the dashboard to make authenticated API calls.

## 🚀 Quick Start

1. **Start the server**

   ```bash
   npm start
   ```

2. **Create a session**

   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/connect \
     -H "X-Api-Key: your_api_key" \
     -H "Content-Type: application/json"
   ```

3. **Get QR Code** - Open in browser or scan

   ```
   http://localhost:3000/api/whatsapp/sessions/mysession/qr/image
   ```

   Note: QR image endpoint also requires API key. Use curl or include header.

4. **Send a message**
   ```bash
   curl -X POST http://localhost:3000/api/whatsapp/chats/send-text \
     -H "X-Api-Key: your_api_key" \
     -H "Content-Type: application/json" \
     -d '{"sessionId": "mysession", "chatId": "628123456789", "message": "Hello!"}'
   ```

---

## 🎛️ Dashboard

Access the admin dashboard at `http://localhost:3000/dashboard`

### 🔐 Authentication

Dashboard requires login with username and password configured in `.env` file.

> There is no default value for user access. User access and passwords depend on the configuration in `.env`.

### ✨ Dashboard Features

| Feature                   | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| 📊 **Real-time Stats**    | Monitor total sessions, connected/disconnected status, and WebSocket clients |
| 📱 **Session Management** | Create, connect, reconnect, and delete WhatsApp sessions                     |
| 📷 **QR Code Scanner**    | Scan QR codes directly from the dashboard                                    |
| 📡 **Live Events**        | Real-time WebSocket event viewer with filtering                              |
| 💬 **Quick Send**         | Send messages quickly to any number                                          |
| 🧪 **API Tester**         | Test all 40+ API endpoints with pre-filled templates                         |
| 📤 **Bulk Messaging**     | Send messages to multiple recipients with job tracking                       |
| 🔗 **Webhook Manager**    | Add, remove, and configure webhooks per session                              |
| 🚪 **Logout**             | Secure logout button in header                                               |

### 📸 Screenshots

![Dashboard Screenshot](./screenshot/image.png)

The dashboard provides a modern dark-themed interface:

- **Session Cards** - View all sessions with status indicators
- **QR Modal** - Full-screen QR code for easy scanning
- **Event Log** - Live scrolling event feed with timestamps
- **API Tester** - Dropdown with all endpoints and auto-generated request bodies

---

## 📚 API Documentation

Base URL: `http://localhost:3000/api/whatsapp`

### Sessions

#### List All Sessions

```http
GET /sessions
```

**Response:**

```json
{
  "success": true,
  "message": "Sessions retrieved",
  "data": [
    {
      "sessionId": "mysession",
      "status": "connected",
      "isConnected": true,
      "phoneNumber": "628123456789",
      "name": "John Doe",
      "webhooks": [
        {
          "url": "https://your-server.com/webhook",
          "events": ["message", "message_ack"]
        }
      ],
      "metadata": {
        "userId": "user123",
        "plan": "premium"
      }
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Unique session identifier |
| `status` | string | Current status: `disconnected`, `connecting`, `qr_ready`, `connected` |
| `isConnected` | boolean | Whether session is currently connected |
| `phoneNumber` | string | Connected WhatsApp phone number |
| `name` | string | WhatsApp profile name |
| `webhooks` | array | Configured webhooks for this session |
| `metadata` | object | Custom metadata associated with this session |

#### Create/Connect Session

```http
POST /sessions/:sessionId/connect
```

**Body (Optional):**

```json
{
  "metadata": {
    "userId": "user123",
    "plan": "premium",
    "customField": "any value"
  },
  "webhooks": [
    { "url": "https://your-server.com/webhook", "events": ["all"] },
    { "url": "https://backup-server.com/webhook", "events": ["message"] }
  ]
}
```

| Parameter  | Type   | Description                                            |
| ---------- | ------ | ------------------------------------------------------ |
| `metadata` | object | Optional. Custom metadata to store with session        |
| `webhooks` | array  | Optional. Array of webhook configs `[{ url, events }]` |

**Response:**

```json
{
  "success": true,
  "message": "Session created",
  "data": {
    "sessionId": "mysession",
    "status": "qr_ready",
    "qrCode": "data:image/png;base64,...",
    "metadata": { "userId": "user123" },
    "webhooks": [
      { "url": "https://your-server.com/webhook", "events": ["all"] }
    ]
  }
}
```

#### Update Session Config

```http
PATCH /sessions/:sessionId/config
```

**Body:**

```json
{
  "metadata": { "newField": "value" },
  "webhooks": [
    {
      "url": "https://new-webhook.com/endpoint",
      "events": ["message", "connection.update"]
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Session config updated",
  "data": {
    "sessionId": "mysession",
    "metadata": { "userId": "user123", "newField": "value" },
    "webhooks": [
      {
        "url": "https://new-webhook.com/endpoint",
        "events": ["message", "connection.update"]
      }
    ]
  }
}
```

#### Add Webhook

```http
POST /sessions/:sessionId/webhooks
```

**Body:**

```json
{
  "url": "https://another-server.com/webhook",
  "events": ["message", "connection.update"]
}
```

#### Remove Webhook

```http
DELETE /sessions/:sessionId/webhooks
```

**Body:**

```json
{
  "url": "https://another-server.com/webhook"
}
```

#### Get Session Status

```http
GET /sessions/:sessionId/status
```

#### Get QR Code (JSON)

```http
GET /sessions/:sessionId/qr
```

#### Get QR Code (Image)

```http
GET /sessions/:sessionId/qr/image
```

Returns a PNG image that can be displayed directly in browser or scanned.

#### Delete Session

```http
DELETE /sessions/:sessionId
```

---

### Messaging

> **💡 Typing Indicator**: All messaging endpoints support `typingTime` parameter (in milliseconds) to simulate typing before sending the message. This makes the bot appear more human-like.
>
> **↩️ Reply to Message**: All messaging endpoints support `replyTo` parameter to reply to a specific message. Pass the message ID to quote/reply to that message.

#### Send Text Message

```http
POST /chats/send-text
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "message": "Hello, World!",
  "typingTime": 2000,
  "replyTo": "3EB0B430A2B52B67D0"
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number (628xxx) or group ID (xxx@g.us)                          |
| `message`         | string     | Required. Text message to send                                                  |
| `typingTime`      | number     | Optional. Typing indicator duration in ms (default: 0)                          |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: false)                      |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Image

```http
POST /chats/send-image
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check this out!",
  "typingTime": 1500,
  "replyTo": null
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number or group ID                                              |
| `imageUrl`        | string     | Required. Direct URL to image file                                              |
| `caption`         | string     | Optional. Image caption                                                         |
| `typingTime`      | number     | Optional. Typing duration in ms (default: 0)                                    |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: false)                      |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Document

```http
POST /chats/send-document
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "documentUrl": "https://example.com/document.pdf",
  "filename": "document.pdf",
  "mimetype": "application/pdf",
  "caption": "Here is the document you requested",
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number or group ID                                              |
| `documentUrl`     | string     | Required. Direct URL to document                                                |
| `filename`        | string     | Required. Filename to display                                                   |
| `mimetype`        | string     | Optional. MIME type (default: application/pdf)                                  |
| `caption` | string | Optional. Caption text for the document |
| `typingTime`      | number     | Optional. Typing duration in ms (default: 0)                                    |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: false)                      |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Audio
```http
POST /chats/send-audio
```

> ⚠️ **Important:** Audio must be in **OGG format** (.ogg). WhatsApp only supports OGG audio files with Opus codec.
> 
> Convert audio using FFmpeg: `ffmpeg -i input.mp3 -c:a libopus output.ogg`

**Body:**
```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "audioUrl": "https://example.com/audio.ogg",
  "ptt": true,
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `sessionId` | string | Required. Session ID |
| `chatId` | string | Required. Phone number or group ID |
| `audioUrl` | string | Required. Direct URL to OGG audio file (.ogg format only) |
| `ptt` | boolean | Optional. Push to talk mode - true = voice note, false = audio file (default: false) |
| `typingTime` | number | Optional. Recording simulation in ms (default: 0) |
| `replyTo` | string | Optional. Message ID to reply to |

#### Send Location

```http
POST /chats/send-location
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "latitude": -6.2088,
  "longitude": 106.8456,
  "name": "Jakarta, Indonesia",
  "typingTime": 1000,
  "replyTo": null
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number or group ID                                              |
| `latitude`        | number     | Required. GPS latitude                                                          |
| `longitude`       | number     | Required. GPS longitude                                                         |
| `name`            | string     | Optional. Location name                                                         |
| `typingTime`      | number     | Optional. Typing duration in ms (default: 0)                                    |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: false)                      |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Contact

```http
POST /chats/send-contact
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "contactName": "John Doe",
  "contactPhone": "628987654321",
  "typingTime": 500,
  "replyTo": null
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number or group ID                                              |
| `contactName`     | string     | Required. Contact display name                                                  |
| `contactPhone`    | string     | Required. Contact phone number                                                  |
| `typingTime`      | number     | Optional. Typing duration in ms (default: 0)                                    |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: false)                      |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Poll Message

```http
POST /chats/send-poll
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "question": "What is your favorite color?",
  "options": ["Red", "Blue", "Green", "Yellow"],
  "selectableCount": 1,
  "typingTime": 2000,
  "replyTo": null
}
```

| Parameter         | Type       | Description                                                                     |
| ----------------- | ---------- | ------------------------------------------------------------------------------- |
| `sessionId`       | string     | Required. Session ID                                                            |
| `chatId`          | string     | Required. Phone number or group ID                                              |
| `question`        | string     | Required. Poll question                                                         |
| `options`         | array      | Required. Array of options (2-12 items)                                         |
| `selectableCount` | number     | Optional. Number of selectable options (default: 1)                             |
| `typingTime`      | number     | Optional. Typing duration in ms (default: 0)                                    |
| `delay`           | string/int | Optional. Delay before sending: `"auto"` (1-15s random), `0` (immediate), or ms |
| `priority`        | number     | Optional. Job priority (higher = more urgent, default: 0)                       |
| `attempts`        | number     | Optional. Retry attempts on failure (default: 3)                                |
| `skipNumberCheck` | boolean    | Optional. Skip WhatsApp number validation (default: true)                       |
| `replyTo`         | string     | Optional. Message ID to reply to                                                |

#### Send Button Message (DEPRECATED)

```http
POST /chats/send-button
```

> ⚠️ **Note:** WhatsApp deprecated button messages in 2022. This endpoint now uses **Poll** as an alternative. For actual interactive buttons, you need WhatsApp Business API (Cloud API).

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "text": "Please choose an option:",
  "footer": "Powered by Chatery",
  "buttons": ["Option 1", "Option 2", "Option 3"],
  "typingTime": 2000,
  "replyTo": null
}
```

| Parameter    | Type   | Description                                    |
| ------------ | ------ | ---------------------------------------------- |
| `sessionId`  | string | Required. Session ID                           |
| `chatId`     | string | Required. Phone number or group ID             |
| `text`       | string | Required. Poll question (combined with footer) |
| `footer`     | string | Optional. Additional text                      |
| `buttons`    | array  | Required. Array of options (poll choices)      |
| `typingTime` | number | Optional. Typing duration in ms (default: 0)   |
| `replyTo`    | string | Optional. Message ID to reply to               |

#### Send Presence Update

```http
POST /chats/presence
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "presence": "composing"
}
```

| Parameter   | Type   | Description                                                              |
| ----------- | ------ | ------------------------------------------------------------------------ |
| `sessionId` | string | Required. Session ID                                                     |
| `chatId`    | string | Required. Phone number or group ID                                       |
| `presence`  | string | Required. `composing`, `recording`, `paused`, `available`, `unavailable` |

#### Check Phone Number

```http
POST /chats/check-number
```

**Body:**

```json
{
  "sessionId": "mysession",
  "phone": "628123456789"
}
```

#### Get Profile Picture

```http
POST /chats/profile-picture
```

**Body:**

```json
{
  "sessionId": "mysession",
  "phone": "628123456789"
}
```

---

## 📊 Message Queue & Delay Control

All `send-*` endpoints support optional delay and queue parameters for reliable, scheduled message delivery.

### ⏱️ Delay Options

The `delay` parameter controls when a message is sent:

| Value            | Behavior                            | Example         |
| ---------------- | ----------------------------------- | --------------- |
| `"auto"`         | Random delay 1-15 seconds (default) | `delay: "auto"` |
| `0`              | Send immediately without delay      | `delay: 0`      |
| `{milliseconds}` | Custom delay in milliseconds        | `delay: 5000`   |

### 📋 Queue Parameters

When sending a message, include these parameters to control queueing:

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789",
  "message": "Hello!",
  "delay": "auto",
  "priority": 0,
  "attempts": 3,
  "skipNumberCheck": false
}
```

| Parameter         | Type           | Description                                                  |
| ----------------- | -------------- | ------------------------------------------------------------ |
| `delay`           | string\|number | Optional. `"auto"`, `0`, or milliseconds (default: `"auto"`) |
| `priority`        | number         | Optional. Job priority (higher = more urgent, default: 0)    |
| `attempts`        | number         | Optional. Retry attempts if delivery fails (default: 3)      |
| `skipNumberCheck` | boolean        | Optional. Skip WhatsApp number validation (default: false)   |

### 🔄 Job Response

When you send a message with queueing, the API returns immediately with a job ID:

```json
{
  "success": true,
  "message": "Message queued for delivery",
  "data": {
    "sessionId": "mysession",
    "chatId": "628123456789",
    "jobId": "msg_1234567890_abc123def",
    "status": "queued",
    "delay": 5000,
    "priority": 0,
    "attempts": 3,
    "estimatedDeliveryTime": "2024-01-06T10:30:15.000Z"
  }
}
```

### 📍 Check Job Status

Use the job ID to check delivery status:

```http
GET /jobs/:jobId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "jobId": "msg_1234567890_abc123def",
    "status": "completed",
    "progress": 100,
    "data": {
      "sessionId": "mysession",
      "chatId": "628123456789"
    },
    "result": {
      "key": "3EB0B430A2B52B67D0",
      "status": "delivered"
    },
    "failedReason": null,
    "timestamp": "2024-01-06T10:30:15.000Z"
  }
}
```

### 📈 Monitor Queue Activity

Access the Queue Monitor dashboard at `http://localhost:3000/queue-monitor` to:

- View real-time queue statistics
- Monitor active, completed, and failed jobs
- Inspect job details and error messages
- Retry failed jobs

### 💡 Example: Send with 5-Second Delay

```bash
curl -X POST http://localhost:3000/api/whatsapp/chats/send-text \
  -H "X-Api-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "mysession",
    "chatId": "628123456789",
    "message": "This message will arrive in 5 seconds",
    "delay": 5000,
    "priority": 1,
    "attempts": 5
  }'
```

### ⚠️ Important Notes

- **Immediate Response**: Jobs are queued and return immediately with a `jobId`. The actual delivery happens asynchronously.
- **Redis Required**: Message queueing requires Redis to be running (default: `localhost:6379`).
- **Job Persistence**: Jobs are stored in Redis. They persist across server restarts.
- **Auto-Retry**: Failed messages automatically retry based on the `attempts` parameter.
- **Audit Trail**: All jobs can be monitored and inspected via the Queue Monitor dashboard or API.

---

### Bulk Messaging (Background Jobs)

Bulk messaging runs in the background and returns immediately with a job ID. You can track progress using the status endpoint.

> **⚡ Background Processing**: All bulk endpoints return immediately with a `jobId`. Messages are sent in background to avoid request timeouts. Track progress with the status endpoint.

#### Send Bulk Text Message

```http
POST /chats/send-bulk
```

**Body:**

```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321", "628111222333"],
  "message": "Hello! This is a bulk message.",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

| Parameter              | Type   | Description                                            |
| ---------------------- | ------ | ------------------------------------------------------ |
| `sessionId`            | string | Required. Session ID                                   |
| `recipients`           | array  | Required. Array of phone numbers (max 100)             |
| `message`              | string | Required. Text message to send                         |
| `delayBetweenMessages` | number | Optional. Delay between messages in ms (default: 1000) |
| `typingTime`           | number | Optional. Typing indicator duration in ms (default: 0) |

**Response:**

```json
{
  "success": true,
  "message": "Bulk message job started. Check status with jobId.",
  "data": {
    "jobId": "bulk_1704326400000_abc123def",
    "total": 3,
    "statusUrl": "/api/whatsapp/chats/bulk-status/bulk_1704326400000_abc123def"
  }
}
```

#### Send Bulk Image

```http
POST /chats/send-bulk-image
```

**Body:**

```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321"],
  "imageUrl": "https://example.com/image.jpg",
  "caption": "Check out this image!",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

| Parameter              | Type   | Description                                            |
| ---------------------- | ------ | ------------------------------------------------------ |
| `sessionId`            | string | Required. Session ID                                   |
| `recipients`           | array  | Required. Array of phone numbers (max 100)             |
| `imageUrl`             | string | Required. Direct URL to image file                     |
| `caption`              | string | Optional. Image caption                                |
| `delayBetweenMessages` | number | Optional. Delay between messages in ms (default: 1000) |
| `typingTime`           | number | Optional. Typing indicator duration in ms (default: 0) |

#### Send Bulk Document

```http
POST /chats/send-bulk-document
```

**Body:**

```json
{
  "sessionId": "mysession",
  "recipients": ["628123456789", "628987654321"],
  "documentUrl": "https://example.com/document.pdf",
  "filename": "document.pdf",
  "mimetype": "application/pdf",
  "delayBetweenMessages": 1000,
  "typingTime": 0
}
```

| Parameter              | Type   | Description                                            |
| ---------------------- | ------ | ------------------------------------------------------ |
| `sessionId`            | string | Required. Session ID                                   |
| `recipients`           | array  | Required. Array of phone numbers (max 100)             |
| `documentUrl`          | string | Required. Direct URL to document                       |
| `filename`             | string | Required. Filename to display                          |
| `mimetype`             | string | Optional. MIME type (default: application/pdf)         |
| `delayBetweenMessages` | number | Optional. Delay between messages in ms (default: 1000) |
| `typingTime`           | number | Optional. Typing indicator duration in ms (default: 0) |

#### Get Bulk Job Status

```http
GET /chats/bulk-status/:jobId
```

**Response:**

```json
{
  "success": true,
  "data": {
    "sessionId": "mysession",
    "type": "text",
    "status": "processing",
    "total": 50,
    "sent": 25,
    "failed": 2,
    "progress": 54,
    "details": [
      {
        "recipient": "628123456789",
        "status": "sent",
        "messageId": "ABC123",
        "timestamp": "2026-01-04T10:00:00.000Z"
      },
      {
        "recipient": "628987654321",
        "status": "failed",
        "error": "Number not registered",
        "timestamp": "2026-01-04T10:00:01.000Z"
      }
    ],
    "createdAt": "2026-01-04T10:00:00.000Z",
    "completedAt": null
  }
}
```

| Field      | Type   | Description                          |
| ---------- | ------ | ------------------------------------ |
| `status`   | string | `processing` or `completed`          |
| `progress` | number | Progress percentage (0-100)          |
| `sent`     | number | Successfully sent count              |
| `failed`   | number | Failed count                         |
| `details`  | array  | Per-recipient status with timestamps |

#### Get All Bulk Jobs

```http
POST /chats/bulk-jobs
```

**Body:**

```json
{
  "sessionId": "mysession"
}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "jobId": "bulk_1704326400000_abc123def",
      "type": "text",
      "status": "completed",
      "total": 50,
      "sent": 48,
      "failed": 2,
      "progress": 100,
      "createdAt": "2026-01-04T10:00:00.000Z",
      "completedAt": "2026-01-04T10:02:30.000Z"
    }
  ]
}
```

---

### Chat History

#### Get Chats Overview

```http
POST /chats/overview
```

**Body:**

```json
{
  "sessionId": "mysession",
  "limit": 50,
  "offset": 0,
  "type": "all"
}
```

| Parameter   | Type   | Description                                  |
| ----------- | ------ | -------------------------------------------- |
| `sessionId` | string | Required. Session ID                         |
| `limit`     | number | Optional. Max results (default: 50)          |
| `offset`    | number | Optional. Pagination offset (default: 0)     |
| `type`      | string | Optional. Filter: `all`, `personal`, `group` |

#### Get Contacts

```http
POST /contacts
```

**Body:**

```json
{
  "sessionId": "mysession",
  "limit": 100,
  "offset": 0,
  "search": "john"
}
```

#### Get Chat Messages

```http
POST /chats/messages
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789@s.whatsapp.net",
  "limit": 50,
  "cursor": null
}
```

#### Get Chat Info

```http
POST /chats/info
```

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789@s.whatsapp.net"
}
```

#### Mark Chat as Read

```http
POST /chats/mark-read
```

Mark all unread messages in a chat as read. Works for both personal and group chats.

**Body:**

```json
{
  "sessionId": "mysession",
  "chatId": "628123456789"
}
```

| Parameter   | Type   | Description                                   |
| ----------- | ------ | --------------------------------------------- |
| `sessionId` | string | Required. Session ID                          |
| `chatId`    | string | Required. Phone number or group ID            |
| `messageId` | string | Optional. Specific message ID to mark as read |

**Response:**
```json
{
  "success": true,
  "message": "Chat marked as read",
  "data": {
    "chatId": "628123456789@s.whatsapp.net",
    "isGroup": false,
    "markedCount": 5
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `chatId` | string | Chat ID that was marked as read |
| `isGroup` | boolean | Whether the chat is a group |
| `markedCount` | number | Number of messages marked as read |

> **Note:** Messages must be received after the server starts to be in the store. If `markedCount` is 0, there were no unread messages in the store.

---

### Group Management

#### Get All Groups

```http
POST /groups
```

**Body:**

```json
{
  "sessionId": "mysession"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "count": 5,
    "groups": [
      {
        "id": "123456789@g.us",
        "subject": "My Group",
        "participantsCount": 25,
        "creation": 1609459200
      }
    ]
  }
}
```

#### Create Group

```http
POST /groups/create
```

**Body:**

```json
{
  "sessionId": "mysession",
  "name": "My New Group",
  "participants": ["628123456789", "628987654321"]
}
```

#### Get Group Metadata

```http
POST /groups/metadata
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "123456789@g.us",
    "subject": "My Group",
    "description": "Group description",
    "participants": [
      { "id": "628123456789@s.whatsapp.net", "admin": "superadmin" },
      { "id": "628987654321@s.whatsapp.net", "admin": null }
    ],
    "size": 25
  }
}
```

#### Add Participants

```http
POST /groups/participants/add
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "participants": ["628111222333", "628444555666"]
}
```

#### Remove Participants

```http
POST /groups/participants/remove
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "participants": ["628111222333"]
}
```

#### Promote to Admin

```http
POST /groups/participants/promote
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "participants": ["628111222333"]
}
```

#### Demote from Admin

```http
POST /groups/participants/demote
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "participants": ["628111222333"]
}
```

#### Update Group Subject (Name)

```http
POST /groups/subject
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "subject": "New Group Name"
}
```

#### Update Group Description

```http
POST /groups/description
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "description": "This is the new group description"
}
```

#### Update Group Settings

```http
POST /groups/settings
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "setting": "announcement"
}
```

| Setting            | Description                          |
| ------------------ | ------------------------------------ |
| `announcement`     | Only admins can send messages        |
| `not_announcement` | All participants can send messages   |
| `locked`           | Only admins can edit group info      |
| `unlocked`         | All participants can edit group info |

#### Update Group Picture

```http
POST /groups/picture
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us",
  "imageUrl": "https://example.com/group-pic.jpg"
}
```

#### Leave Group

```http
POST /groups/leave
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us"
}
```

#### Join Group via Invite

```http
POST /groups/join
```

**Body:**

```json
{
  "sessionId": "mysession",
  "inviteCode": "https://chat.whatsapp.com/AbCdEfGhIjKlMn"
}
```

#### Get Invite Code

```http
POST /groups/invite-code
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "groupId": "123456789@g.us",
    "inviteCode": "AbCdEfGhIjKlMn",
    "inviteLink": "https://chat.whatsapp.com/AbCdEfGhIjKlMn"
  }
}
```

#### Revoke Invite Code

```http
POST /groups/revoke-invite
```

**Body:**

```json
{
  "sessionId": "mysession",
  "groupId": "123456789@g.us"
}
```

---

## 🔌 WebSocket Events

Connect to WebSocket server at `ws://localhost:3000`

### Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// Subscribe to a session
socket.emit("subscribe", "mysession");

// Unsubscribe from a session
socket.emit("unsubscribe", "mysession");
```

### Events

| Event                | Description                             | Payload                                                 |
| -------------------- | --------------------------------------- | ------------------------------------------------------- |
| `qr`                 | QR code generated                       | `{ sessionId, qrCode, timestamp }`                      |
| `connection.update`  | Connection status changed               | `{ sessionId, status, phoneNumber?, name?, timestamp }` |
| `message`            | New message received                    | `{ sessionId, message, timestamp }`                     |
| `message.sent`       | Message sent confirmation               | `{ sessionId, message, timestamp }`                     |
| `message.update`     | Message status update (read, delivered) | `{ sessionId, update, timestamp }`                      |
| `message.reaction`   | Message reaction added                  | `{ sessionId, reactions, timestamp }`                   |
| `message.revoke`     | Message deleted/revoked                 | `{ sessionId, key, participant, timestamp }`            |
| `chat.update`        | Chat updated                            | `{ sessionId, chats, timestamp }`                       |
| `chat.upsert`        | New chat created                        | `{ sessionId, chats, timestamp }`                       |
| `chat.delete`        | Chat deleted                            | `{ sessionId, chatIds, timestamp }`                     |
| `contact.update`     | Contact updated                         | `{ sessionId, contacts, timestamp }`                    |
| `presence.update`    | Typing, online status                   | `{ sessionId, presence, timestamp }`                    |
| `group.participants` | Group members changed                   | `{ sessionId, update, timestamp }`                      |
| `group.update`       | Group info changed                      | `{ sessionId, update, timestamp }`                      |
| `call`               | Incoming call                           | `{ sessionId, call, timestamp }`                        |
| `labels`             | Labels updated (business)               | `{ sessionId, labels, timestamp }`                      |
| `logged.out`         | Session logged out                      | `{ sessionId, message, timestamp }`                     |

### Example: Listen for Messages

```javascript
const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Connected to WebSocket");
  socket.emit("subscribe", "mysession");
});

socket.on("message", (data) => {
  console.log("New message:", data.message);
  // {
  //   sessionId: 'mysession',
  //   message: {
  //     id: 'ABC123',
  //     from: '628123456789@s.whatsapp.net',
  //     text: 'Hello!',
  //     timestamp: 1234567890,
  //     ...
  //   },
  //   timestamp: '2024-01-15T10:30:00.000Z'
  // }
});

socket.on("qr", (data) => {
  console.log("Scan QR Code:", data.qrCode);
});

socket.on("connection.update", (data) => {
  console.log("Connection status:", data.status);
  if (data.status === "connected") {
    console.log(`Connected as ${data.name} (${data.phoneNumber})`);
  }
});
```

### WebSocket Test Page

Open `http://localhost:3000/ws-test` in your browser for an interactive WebSocket testing interface.

---

## 🪝 Webhooks

You can configure multiple webhook URLs to receive events from your WhatsApp session. Each webhook can subscribe to specific events.

### Setup Multiple Webhooks

Set webhooks when creating or updating a session:

```bash
# When creating session with multiple webhooks
curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/connect \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": { "userId": "123" },
    "webhooks": [
      { "url": "https://primary-server.com/webhook", "events": ["all"] },
      { "url": "https://analytics.example.com/webhook", "events": ["message"] },
      { "url": "https://backup.example.com/webhook", "events": ["connection.update"] }
    ]
  }'

# Add a webhook to existing session
curl -X POST http://localhost:3000/api/whatsapp/sessions/mysession/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://new-webhook.com/endpoint",
    "events": ["message", "connection.update"]
  }'

# Remove a webhook
curl -X DELETE http://localhost:3000/api/whatsapp/sessions/mysession/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://new-webhook.com/endpoint"
  }'

# Update all webhooks
curl -X PATCH http://localhost:3000/api/whatsapp/sessions/mysession/config \
  -H "Content-Type: application/json" \
  -d '{
    "webhooks": [
      { "url": "https://only-this-one.com/webhook", "events": ["all"] }
    ]
  }'
```

### Webhook Payload

All configured webhook endpoints will receive POST requests with this format:

```json
{
  "event": "message",
  "sessionId": "mysession",
  "metadata": {
    "userId": "123",
    "customField": "value"
  },
  "data": {
    "id": "ABC123",
    "from": "628123456789@s.whatsapp.net",
    "text": "Hello!",
    "timestamp": 1234567890
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Webhook Headers

| Header             | Value                  |
| ------------------ | ---------------------- |
| `Content-Type`     | `application/json`     |
| `X-Webhook-Source` | `chatery-whatsapp-api` |
| `X-Session-Id`     | Session ID             |
| `X-Webhook-Event`  | Event name             |

### Available Webhook Events

| Event               | Description                                         |
| ------------------- | --------------------------------------------------- |
| `connection.update` | Connection status changed (connected, disconnected) |
| `message`           | New message received                                |
| `message.sent`      | Message sent confirmation                           |

Set `events: ["all"]` to receive all events, or specify individual events per webhook.

### WebSocket Stats

```http
GET /api/websocket/stats
```

**Response:**

```json
{
  "success": true,
  "data": {
    "totalConnections": 5,
    "sessionRooms": {
      "mysession": 2,
      "othersession": 1
    }
  }
}
```

---

## 📁 Project Structure

```
chatery_whatsapp/
├── index.js                         # Application entry point
├── package.json                     # Project dependencies
├── .env                             # Environment variables
├── Dockerfile                       # Docker configuration
├── docker-compose.yml               # Docker Compose setup
├── README.md                        # Documentation
├── LICENSE                          # MIT License
│
├── public/                          # Static files & UI
│   ├── dashboard.html               # Admin dashboard interface
│   ├── custom-header.html           # Custom header component
│   ├── custom-footer.html           # Custom footer component
│   ├── websocket-test.html          # WebSocket testing interface
│   ├── dashboard-queues-proxy.html  # Queue monitor proxy (optional)
│   └── media/                       # Auto-saved incoming media
│       └── {sessionId}/
│           └── {chatId}/
│
├── sessions/                        # Session data storage (auto-generated)
│   └── {sessionId}/
│
├── screenshot/                      # Documentation screenshots
│
└── src/                             # Source code
    ├── config/                      # Configuration & API docs
    │   ├── swagger.js               # Swagger main config
    │   └── swagger-paths.js         # Swagger API endpoint definitions
    │
    ├── helpers/                     # Configuration & API docs
    │   └── whatsappHelpers.js       # Swagger main config
    │
    ├── middleware/                  # Express middleware
    │   └── apiKeyAuth.js            # API key authentication
    │
    ├── routes/                      # API route handlers
    │   └── whatsapp.js              # WhatsApp API endpoints
    │
    ├── helpers/                     # Utility functions
    │   └── whatsappHelpers.js       # Delay, validation, job helpers
    │
    └── services/                    # Business logic layer
        ├── queues/                  # Message queue system (BullMQ + Redis)
        │   ├── index.js             # Queue initialization
        │   ├── worker.js            # Message processing worker
        │   └── monitor.js           # Bull Board monitor UI
        │
        ├── websocket/               # Real-time WebSocket management
        │   ├── WebSocketManager.js  # Socket.IO connection handler
        │   └── events.js            # WebSocket event definitions
        │
        └── whatsapp/                # WhatsApp client management
            ├── index.js             # WhatsApp service exports
            ├── WhatsAppManager.js   # Multi-session manager
            ├── WhatsAppSession.js   # Individual session handler
            ├── BaileysStore.js      # Message store for Baileys library
            └── MessageFormatter.js  # Message formatting utilities
```

### Directory Reference

| Directory                 | Purpose                                                       |
| ------------------------- | ------------------------------------------------------------- |
| `public/`                 | Static HTML files, custom components, and media storage       |
| `sessions/`               | WhatsApp session credentials and state (auto-generated)       |
| `src/config/`             | Swagger/OpenAPI documentation configuration                   |
| `src/routes/`             | HTTP endpoint handlers and request routing                    |
| `src/helpers/`            | Reusable utility and helper functions                         |
| `src/services/`           | Core business logic and service layer                         |
| `src/services/queues/`    | BullMQ queue system, worker processor, and Bull Board monitor |
| `src/services/websocket/` | Socket.IO WebSocket management and event handling             |
| `src/services/whatsapp/`  | Baileys WhatsApp client and session management                |

### Architecture Overview

**Message Sending Flow:**

```
Client Request
    ↓
HTTP Route Handler (src/routes/whatsapp.js)
    ↓
Validate & Enqueue Job (BullMQ)
    ↓
Redis Queue Storage
    ↓
Worker Processor (src/services/queues/worker.js)
    ↓
WhatsApp Service (src/services/whatsapp/)
    ↓
Baileys Client
    ↓
Send via WhatsApp
    ↓
Return Job Status to Client
```

**Real-time Event Flow:**

```
WhatsApp Event
    ↓
Baileys Handler
    ↓
WebSocket Service (src/services/websocket/)
    ↓
Socket.IO Broadcast
    ↓
Dashboard & Clients
```

**Job Monitoring:**

- Queue Monitor: `http://localhost:3000/queue-monitor` (Bull Board UI)
- Job Status API: `GET /api/whatsapp/jobs/:jobId`
- Queue Stats: `GET /api/whatsapp/queue/stats` (optional endpoint)

---

## 📝 Examples

### Node.js Client

```javascript
const axios = require("axios");

const API_URL = "http://localhost:3000/api/whatsapp";

// Create session
async function createSession(sessionId) {
  const response = await axios.post(`${API_URL}/sessions/${sessionId}/connect`);
  return response.data;
}

// Send message
async function sendMessage(sessionId, to, message) {
  const response = await axios.post(`${API_URL}/chats/send-text`, {
    sessionId,
    to,
    message,
  });
  return response.data;
}

// Get all groups
async function getGroups(sessionId) {
  const response = await axios.post(`${API_URL}/groups`, { sessionId });
  return response.data;
}
```

### Python Client

```python
import requests

API_URL = 'http://localhost:3000/api/whatsapp'

# Create session
def create_session(session_id):
    response = requests.post(f'{API_URL}/sessions/{session_id}/connect')
    return response.json()

# Send message
def send_message(session_id, to, message):
    response = requests.post(f'{API_URL}/chats/send-text', json={
        'sessionId': session_id,
        'to': to,
        'message': message
    })
    return response.json()

# Get all groups
def get_groups(session_id):
    response = requests.post(f'{API_URL}/groups', json={
        'sessionId': session_id
    })
    return response.json()
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## ☕ Support & Donate

If you find this project helpful, consider supporting the development:

<p align="center">
  <a href="https://saweria.co/https://saweria.co/fajrichan">
    <img src="https://img.shields.io/badge/Saweria-Buy%20Me%20a%20Coffee-orange?style=for-the-badge&logo=ko-fi" alt="Saweria" />
  </a>
  <a href="https://paypal.me/farinchan">
    <img src="https://img.shields.io/badge/PayPal-Donate-blue?style=for-the-badge&logo=paypal" alt="PayPal" />
  </a>
  
</p>

<p align="center">
  <a href="https://github.com/farinchan/chatery_whatsapp">
    <img src="https://img.shields.io/github/stars/farinchan/chatery_whatsapp?style=social" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/farinchan/chatery_whatsapp/fork">
    <img src="https://img.shields.io/github/forks/farinchan/chatery_whatsapp?style=social" alt="GitHub Forks" />
  </a>
</p>

Your support helps me maintain and improve this project! ❤️

---

## 👨‍💻 Author

**Fajri Rinaldi Chan** (Farin Chan)

<p align="left">
  <a href="https://github.com/farinchan">
    <img src="https://img.shields.io/badge/GitHub-@farinchan-181717?style=for-the-badge&logo=github" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/fajri-chan">
    <img src="https://img.shields.io/badge/LinkedIn-farinchan-0077B5?style=for-the-badge&logo=linkedin" alt="LinkedIn" />
  </a>
  <a href="https://www.instagram.com/fajri_chan">
    <img src="https://img.shields.io/badge/Instagram-@farinchan-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>

---

## 🔗 Quick Links

| Resource                 | URL                                       |
| ------------------------ | ----------------------------------------- |
| 📄 Swagger UI (API Docs) | http://localhost:3000                     |
| 🎛️ Dashboard             | http://localhost:3000/dashboard           |
| 📚 API Base URL          | http://localhost:3000/api/whatsapp        |
| 🔌 WebSocket Test        | http://localhost:3000/ws-test             |
| 📊 WebSocket Stats       | http://localhost:3000/api/websocket/stats |
| 🎯 Monitoring Queue      | http://localhost:3000/queue-monitor       |
| ❤️ Health Check          | http://localhost:3000/api/health          |
| 📋 OpenAPI JSON          | http://localhost:3000/api-docs.json       |

---

## ⚠️ Disclaimer

This project is not affiliated with WhatsApp or Meta. Use at your own risk. Make sure to comply with WhatsApp's Terms of Service.
