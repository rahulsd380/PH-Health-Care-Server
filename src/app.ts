import { Request, Response, urlencoded } from "express";
import { UserRoutes } from "./app/modules/user/user.routes"
import { AdminRoutes } from "./app/modules/admin/admin.route";


const express = require('express')
const app = express()
app.use(express.json());
app.use(urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use("/api/v1/user", UserRoutes)
app.use("/api/v1/admin", AdminRoutes)


export default app;