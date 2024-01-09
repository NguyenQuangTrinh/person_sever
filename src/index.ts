import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { userController } from "../controllers/user.controller";
import { todoController } from "../controllers/todo.controller";
import { webSocketController } from "../controllers/websocket";
import { CollectionController } from "../controllers/collection.controller";
import { cors } from "@elysiajs/cors";
import { messagerController } from "../controllers/messager.controller";

const app = new Elysia();

import mongoose from "mongoose";

const windowsIpAddress = '192.168.1.14'; // Replace with the actual IP address of Windows
const port = '27017'; // Default MongoDB port

// MongoDB connection string
const connectionString = `mongodb://${windowsIpAddress}:${port}/elysia`;

// Connect to MongoDB
mongoose.connect(connectionString);

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB on Windows from WSL');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use(swagger({
  documentation: {
    info: {
      title: 'Elysia',
      version: '0.7.0'
    },
    tags: [
      { name: "User" },
      { name: "Todo" },
      { name: "Collection" }
    ]
  }
})
).use(cors({
  allowedHeaders: "*"
}))


app.use(userController)
app.use(todoController)
app.use(CollectionController)
app.use(webSocketController);
app.use(messagerController);


app.get('/', () => {
  return "welcome to my app"
})


app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
