import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import { auth, requiresAuth } from 'express-openid-connect';

export const app = express();
const port = 3001;
dotenv.config();


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'bUVwgaCUGWYKQUh9syUJqknsE6i2kWMJ',
  issuerBaseURL: 'https://pl3lee.us.auth0.com',
};

app.use(express.json());
app.use(cors());
app.use(auth(config));


app.get('/api', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});