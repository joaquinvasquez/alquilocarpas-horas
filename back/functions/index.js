import * as functions from 'firebase-functions/v2'
import express from 'express'
import { corsMiddleware, corsPreflightMiddleware } from './middlewares/cors.js'
import admin from 'firebase-admin'
import * as nodemailer from 'nodemailer'

import serviceAccount from './firebase/permissions.json' with { type: 'json' }

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'joaquinvasquez20@gmail.com',
    pass: 'clqk hpnz gayd owbm',
  },
})

const app = express()
const db = admin.firestore()

// PARA DESHABILITAR EL HEADER X-POWERED-BY
app.disable('x-powered-by')

// PARA PARSEAR EL BODY
app.use(express.json())

// PARA LOS CORS
app.use(corsMiddleware)

// PARA LOS CORS PREFLIGHT
app.options('*', corsPreflightMiddleware)

app.post('/new', async (req, res) => {
  try {
    await db
        .collection('users')
        .doc()
        .create({
          name: req.body.name,
          key: req.body.key,
          initial_date: new Date(Date.now()),
          is_active: false,
          minutes: 0,
          weekly_hours: req.body.weekly_hours,
          last_reading: new Date(Date.now()),
          enabled: true,
        })
    return res.status(200).send('created')
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = []
    const querySnapshot = await db.collection('users').get()
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
        initial_date: doc.data().initial_date.toDate(),
        last_reading: doc.data().last_reading.toDate(),
      })
    })
    return res.status(200).send(users.filter((user) => user.enabled))
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.get('/user/:id', async (req, res) => {
  try {
    const user = await db.collection('users').doc(req.params.id).get()
    return res.status(200).send({
      id: user.id,
      ...user.data(),
      initial_date: user.data().initial_date.toDate(),
      last_reading: user.data().last_reading.toDate(),
    })
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.get('/last-readed', async (req, res) => {
  try {
    const lastReaded = await db
        .collection('last-readed')
        .doc('last-readed')
        .get()
    return res.status(200).send(lastReaded.data())
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.put('/read/:key', async (req, res) => {
  try {
    await db.collection('last-readed').doc('last-readed').set({
      last_read: req.params.key,
    })
    const user = await db
        .collection('users')
        .where('key', '==', req.params.key)
        .get()
    if (user.empty) {
      return res.status(400).send('user not found')
    }
    const userData = user.docs[0].data()
    if (userData.is_active) {
      await db
          .collection('users')
          .doc(user.docs[0].id)
          .update({
            is_active: false,
            minutes:
            userData.minutes +
            Math.floor(
                (Date.now() - userData.last_reading.toDate().getTime()) / 60000,
            ),
            last_reading: new Date(Date.now()),
          })
      return res.status(200).send('deactivated')
    } else {
      await db
          .collection('users')
          .doc(user.docs[0].id)
          .update({
            is_active: true,
            last_reading: new Date(Date.now()),
          })
      return res.status(200).send('activated')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.put('/update/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({
      name: req.body.name,
      key: req.body.key,
      weekly_hours: req.body.weekly_hours,
    })
    return res.status(200).send('updated')
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.put('/delete/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).update({
      enabled: false,
    })
    return res.status(200).send('deleted')
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

app.get('/mail', async (req, res) => {
  const user = await db.collection('users').doc('3xizo4TkTWVRWATKSTl5').get()
  const mailOptions = {
    from: 'joaquinvasquez20@gmail.com',
    to: 'joaquinvasquez20@gmail.com',
    subject: `LectorID - ${user.data().name} se fue sin fichar`,
    text: `El usuario [${user.data().name}] quedó activado hoy, se olvidó de fichar al salir. Hay que restar manualmente el tiempo que pasó desde que se fue hasta las 00:00.`,
  }
  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
      } else {
        console.log('Email sent: ' + info.response)
      }
    })
    return res.status(200).send('email sent')
  } catch (err) {
    console.log(err)
    return res.status(500).send('error')
  }
})

export const api = functions.https.onRequest(app)


export const scheduledFunction = functions.scheduler.onSchedule(
    '59 23 * * 1-5', // at 23:59 from Monday to Friday
    async (event) => {
      const users = []
      const querySnapshot = await db.collection('users').get()
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
          initial_date: doc.data().initial_date.toDate(),
          last_reading: doc.data().last_reading.toDate(),
        })
      })
      users.forEach(async (user) => {
        if (user.is_active) {
          await db.collection('users').doc(user.id).update({
            is_active: false,
          })
          const mailOptions = {
            from: 'joaquinvasquez20@gmail.com',
            to: 'joaquinvasquez20@gmail.com',
            subject: `LectorID - ${user.name} se fue sin fichar`,
            text: `El usuario [${user.name}] quedó activado hoy, se olvidó de fichar al salir. Hay que restar manualmente el tiempo que pasó desde que se fue hasta las 00:00.`,
          }
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
        } else {
          if (
            Math.floor((Date.now() - user.last_reading.getTime()) / 60000) > 1440
          ) {
            await db
                .collection('users')
                .doc(user.id)
                .update({
                  minutes: user.minutes - user.weekly_hours * 60,
                })
            const mailOptions = {
              from: 'joaquinvasquez20@gmail.com',
              to: 'joaquinvasquez20@gmail.com',
              subject: `LectorID - ${user.name} hoy no trabajó`,
              text: `El usuario [${user.name}] hoy no fichó. Ya se le descontaron las horas de hoy, en caso de que sea un error, hay que sumar manualmente el tiempo que trabajó hoy.`,
            }
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error)
              } else {
                console.log('Email sent: ' + info.response)
              }
            })
          }
        }
      })
    },
)
