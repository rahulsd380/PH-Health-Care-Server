import { NextFunction, Request, Response, urlencoded } from "express";
import router from "./app/routes";
import cookieParser from "cookie-parser"


const express = require('express')
const app = express()
app.use(express.json());
app.use(cookieParser())
app.use(urlencoded({ extended: true }));


app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.use("/api/v1", router);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
      success: false,
      message: "API NOT FOUND!",
      error: {
          path: req.originalUrl,
          message: "Your requested path is not found!"
      }
  })
})


export default app;