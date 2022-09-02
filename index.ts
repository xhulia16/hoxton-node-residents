import express from 'express'
import cors  from 'cors'
import { houses, residents } from './data'

const app = express()
const port = 5000
app.use(express.json())
app.use(cors())

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
    let housesToSend = houses.map(house => {
        let residentsOfHouse = residents.filter(resident => resident.houseId === house.id)
        return { ...house, residents: residentsOfHouse }
    })
    res.send(housesToSend)
})

app.get("/houses/:id", (req, res)=>{
    const id=Number(req.params.id)
    let houseToSend=houses.find(house=>house.id===id)
    let residentsOfHouse = residents.filter(resident => resident.houseId === id)
    if(houseToSend) {
        res.send({ houseToSend, residents: residentsOfHouse }) 
    }
    else res.status(404).send("House not found!")
})

app.get("/residents/:id", (req, res)=>{
    const id=Number(req.params.id)
    let resident=residents.find(resident=>resident.id===id)
    let house = houses.find(house => house.id === resident?.houseId)
    if(resident) {
        res.send({ resident, house }) 
    }
    else res.status(404).send("House not found!")
})

app.get("/residents", (req, res) => {
    let residentsToSend = residents.map(resident => {
        let house = houses.find(house => house.id === resident.houseId)
        return { ...resident, house }
    })
    res.send(residentsToSend)
})

app.post('/houses', (req, res) => {
    let errors: string[] = []
    if (typeof req.body.address !== "string") {
        errors.push("Please enter a valid address")
    }

    if (typeof req.body.type !== "string") {
        errors.push("Please enter a valid house type")
    }

    if (errors.length === 0) {
        const newHouse = {
            id: houses[houses.length - 1].id + 1,
            address: req.body.address,
            type: req.body.type
        }
        houses.push(newHouse)
        res.send(newHouse)
    }
    else{
        res.status(400).send({errors: errors})
    }
    

})

app.post('/residents', (req, res)=>{
    let errors:string[]=[]

    if(typeof req.body.name !== "string"){
        errors.push("Please enter a valid name")
    }
    if(typeof req.body.age !== "number"){
        errors.push("Please enter a valid age")
    }
    if(typeof req.body.gender !== "string"){
        errors.push("Please enter a valid gender")
    }
    if(typeof req.body.houseId !== "number"){
        errors.push("Please enter a valid house id")
    }

    if(errors.length===0){
        const newResident={
            id: residents[residents.length-1].id +1,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            houseId: req.body.houseId
        }
        residents.push(newResident)
        res.send(newResident)
    }
    else{
        res.status(400).send({errors: errors})
    }
})

app.patch('/houses/:id', (req, res)=>{
const id=Number(req.params.id)
const newAddress=req.body.address
const newType=req.body.type

let match=houses.find(house=>house.id===id)
if(match){
    if(newAddress){
        match.address=newAddress
    }
    if(newType){
        match.type=newType
    }
    res.send(match)
}
else{
    res.status(404).send("House not found!")
}
})


app.patch('/residents/:id', (req, res)=>{
    const id=Number(req.params.id)
    const newName=req.body.name
    const newAge=Number(req.body.age)
    const gender=req.body.gender

const residentToSend=residents.find(resident=> resident.id===id)
if(residentToSend){
    if(newName){
        residentToSend.name=newName
    }
    if(newAge){
        residentToSend.age=newAge
    }
    if(gender){
        residentToSend.gender=gender
    }
    res.send(residentToSend)
}
else{
    res.status(404).send("Resident not Found!")
}
})


app.listen(port)