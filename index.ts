import express from 'express'
import { houses, residents } from './data'

const app = express()
const port = 5000
app.use(express.json())

app.get("/", (req, res) => {
    res.send(`
<h1>Available resources:<h1>
<ul>
<li>
<a href="/houses"> Houses </a>
</li>
<li>
<a href="/residents"> Residents </a>
</li>
</ul>
`)
})

app.get("/houses", (req, res) => {
   let housesToSend=houses.map(house=>{
    let residentsOfHouse=residents.filter(resident=> resident.houseId===house.id)
    return{...house, residents: residentsOfHouse}
   })
   res.send(housesToSend)
})

app.get("/residents", (req, res) => {
  let residentsToSend=residents.map(resident=>{
    let house=houses.find(house=>house.id===resident.houseId)
    return{...resident, house}
  })
  res.send(residentsToSend)
})

app.listen(port)