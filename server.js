const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const app = express()
const con = require("./utilities/db")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: "*" }))
app.use(morgan("dev"))
app.use(helmet())
dotenv.config()

con()

app.use(express.static(`${__dirname}/image`))

const userRoute = require("./routes/userRoute")
const resumeRoute = require("./routes/resumeRoute")
const templateRoute = require("./routes/templateRoute")

app.use("/api/v1/users", userRoute)
app.use("/api/v1/resumes", resumeRoute)
app.use("/api/v1/templates", templateRoute)

port = process.env.PORT
app.listen(port, () => console.log(`listening on port ${port}`))
