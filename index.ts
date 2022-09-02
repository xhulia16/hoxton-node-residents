import express from 'express'
import {houses, residents} from './data'
const app=express()
const port=5000
app.use(express.json())
