import app from "./app"
const port = 5000

async function main() {
    const server = app.listen(port, () => {
        console.log("Server is running on port", port);
    })
  }
  
  main();