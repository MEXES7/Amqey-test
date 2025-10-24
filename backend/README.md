# Backend - Product App

This is the **Node.js + Express** backend for the Product App.

## Features

- CRUD operations for products
- Image upload support (via multer)
- MongoDB database

## Setup

1. Install dependencies:

```bash
npm install
```

## Start Server

```bash
npm run start
```

## .env

DATABASE=mongodb+srv://abdulmalikolaoye80_db_user:<db_password>@cluster0.ptrt9pk.mongodb.net/
DATABASE_PASSWORD=JDOS29JKRDjOab9C

## end points

GET - http://127.0.0.1:5000/api/products/ --- to get all products
GET - http://127.0.0.1:5000/api/products/id ---- to get a product
PUT - http://127.0.0.1:5000/api/products/id ----- to update a product
DELETE - http://127.0.0.1:5000/api/products/id --- to delete a product
