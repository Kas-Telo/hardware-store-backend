import {app, json} from './app.js'
import {productsRouter} from "./routes/products.js";
import keys from './config/keys.js'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import {categoryRouter} from "./routes/category.js";
import {searchParamsRouter} from "./routes/search-params-by-category.js";

mongoose.set('strictQuery', true)

const port = process.env.PORT || 7542

mongoose.connect(keys.mongoURI)
  .then(() => {
    console.log('Connected to mongodb')
  })
  .catch((err) => {
    console.log(`mongodb error: ${err}`)
  })

app.use(json)
app.use(cors({}))
app.use(morgan('dev'))

app.use('/product', productsRouter)
app.use('/category', categoryRouter)
app.use('/params', searchParamsRouter)

app.listen(port, (err) => {
  if (err) {
    return console.log(err)
  }
  console.log(`Server has been started on PORT: ${port}`)
})