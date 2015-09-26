# ExspressoBackend

API
---



`POST /login` (Login to the Application)

* Input

  * `email`: Gatech Email address
  * `password`: associated password
  
* Output (JSON)

  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success
  * `token`: token for auth purposes if successful login






`POST /register` (Create an account)
* Input

  * `email`: Gatech Email Address
  * `password`: associated password for this account
  * `firstName`: user first name
  * `lastName`: user last name
  * `phoneNumber`: in the form (XXX) - XXX - XXXX
  
* Output (JSON)

  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success
  * `token`: token for auth purposes if successful registration




Install
-------
`npm install`

Deploy
------
Defaults to port `3003`. Modify in `server.js`

`npm start`
