import Elysia, { t } from "elysia";
import UserService from "../service/user.service";
import { hashPassword } from "../helpers";
import jwt from "@elysiajs/jwt";
import MessagerService from "../service/messager.service";

export const userController = new Elysia();
const userService = new UserService();


userController.group("v1/user", userController => userController
    .use(jwt({
        name: 'jwt',
        secret: 'kunikuzushi',
        exp: '7d'
    }))
    .model({
        'user.sign': t.Object({
            email: t.String(),
            password: t.String({
                minLength: 8
            }),
            name: t.String()
        })
    },
    )
    .post("/create", async (req) => {
        const { email, password, name }: any = req.body;
        return await userService.createUser(email, password, name)
    },
        {
            body: 'user.sign',
            detail: { tags: ['User'] }
        }

    )
    .model(
        {
            'user.login': t.Object({
                email: t.String(),
                password: t.String()
            })
        }
    )
    .post('/login', async ({ jwt, set, body, cookie: { access_token } }: any) => {
        const { email, password } = body;

        try {
            const checkEmail = await userService.findUserByEmail(email);

            if (checkEmail) {
                if (checkEmail.password === hashPassword(password)) {
                    const jwts = await jwt.sign({
                        email: checkEmail.email,
                        name: checkEmail.name,
                        id: checkEmail.id
                    })
                    access_token.value = jwts
                    return {
                        jwts,
                        profile: await jwt.verify(jwts)
                    }

                } else {
                    set.status = 401
                    return {
                        error: "password wrong"
                    }
                }
            } else {
                return {
                    error: "email not found"
                }
            }
        } catch (e) {
            return e
        }

    }, {
        body: 'user.login',
        detail: { tags: ['User'] }
    })
    .onBeforeHandle(async ({ set, jwt, headers }: any) => {
        try {
            const access_token = headers['authorization']
            if (access_token != null) {
                const profile = await jwt.verify(access_token.split(" ")[1]);
                if (profile) {
                    set.status = 200
                    return
                } else {
                    set.status = 401;
                    return {
                        error: "authorization not found"
                    }
                }
            } else {
                set.status = 401;
                return {
                    error: "authorization"
                }
            }
        } catch (e) {
            return e;
        }
    })
    .post("/addFriend", async ({body}) => {
        const {id, userId}: any = body;
       
        return await userService.addFriend(id, userId)
    })
    .get("/getAll", async () => {
        try {
            const user = await userService.getAllUser();
            return user;
        } catch (e) {
            return e;
        }
    },
        {
            detail: { tags: ['User'] },
        },
    )
    .get("/userByid/:id", async ({params}) => {
        try {
            const user = await userService.getUserById(params.id)
            return user;
        } catch (error) {
            return error;
        }
    })
    .get("/user", async ({headers, jwt}: any) => {
        try {
            const access_token = headers['authorization']
            const profile = await jwt.verify(access_token?.split(" ")[1]);
            return userService.getUserById(profile.id);
        } catch (error) {
            console.log(error);   
        }
    })
)
