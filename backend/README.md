# Note App Backend

This is the backend API for the Note App, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following content:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/note_app
   ```

3. Make sure MongoDB is running on your system.

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Notes

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get a single note
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note
- `GET /api/notes/search?q=query` - Search notes

### Request/Response Format

#### Create/Update Note
```json
{
  "title": "Note Title",
  "content": "Note Content"
}
```

#### Note Response
```json
{
  "_id": "note_id",
  "title": "Note Title",
  "content": "Note Content",
  "createdAt": "2024-03-23T12:00:00.000Z",
  "updatedAt": "2024-03-23T12:00:00.000Z"
}
``` 