import { Elysia, t } from "elysia";
import { swagger } from '@elysiajs/swagger'
import { PrismaClient } from '@prisma/client'
import { userController } from "../controllers/user.controller";
import jwt from "@elysiajs/jwt";
import { todoController } from "../controllers/todo.controller";
import { webSocketController } from "../controllers/websocket";
import { CollectionController } from "../controllers/collection.controller";

const app = new Elysia();

const db = new PrismaClient();

app.use(swagger({
  documentation: {
    info: {
      title: 'Elysia',
      version: '0.7.0'
    },
    tags: [
      { name: "User" },
      {name: "Todo"},
      {name: "Collection"}
    ]
  }
})
)


app.use(userController)
app.use(todoController)
app.use(CollectionController)
app.use(webSocketController);

// app.group("v1/user", app => app
//   .get("/getAll", async () => {
//     const user = await db.user.findMany();
//     return user;
//   }, { detail: { tags: ['User'] } })
//   .model({
//     'user.sign': t.Object({
//       email: t.String(),
//       hashpassword: t.String({
//         minLength: 8
//       }),
//       name: t.String()
//     })
//   },
//   )
//   .post("/create", async (req) => {
//     const { email, hashpassword, name }: any = req.body;
//     const password = hashPassword(hashpassword);

//     const user = await db.user.create({
//       data: {
//         email, password, name
//       },
//       select: {
//         id: true,
//         email: true
//       }
//     })

//   },
//     {
//       body: 'user.sign',
//       detail: { tags: ['User'] }
//     }

//   )
//   .model(
//     {
//       'user.login': t.Object({
//         email: t.String(),
//         password: t.String()
//       })
//     }
//   )
//   .post('/login', (req) => {
//     const {email, password} = req.body;
//     const emailFind = db.user.findUnique({
//       where: {email}
//     })

//     if(emailFind){

//     }else{

//     }


//   },{
//     body: 'user.login',
//     detail: {tags: ['User']}
//   })
// )

app.post('/', ({ body, set }) => {
  const signed = body
  console.log(signed);
  if (signed)
    return 'Welcome back'

  set.status = 403
  return 'Invalid username or password'
})


app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
