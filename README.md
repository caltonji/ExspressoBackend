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

`POST /order/new` (Create a new order)
* Input

  * `items`: [{MenuItem ObjectId, size}, ...]
  * `location`: string, meeting location for delivery
  * `tip`: number in cents. min 50.

* Output (JSON)

  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success
  * SavedOrder": {
      "__v": 0,
      "tip": 50,
      "location": "clough",
      "customer": "56065f187400040b388e0a96",
      "_id": "5606752679240c1d3c951def",
      "reviews": [],
      "notes": "",
      "items": [
        null,
        "5606752679240c1d3c951dee"
      ],
      "dateLastStatusChange": "2015-09-26T10:36:22.965Z",
      "dateCreated": "2015-09-26T10:36:22.965Z",
      "status": "Created"
    }


`GET /order/` (View recent orders)
* Input
  * `numOrders`: optional. Default 20. Number of items to return
  * `statusType`: optional. Type of status order you want. (Created Accepted InProgress Completed CanceledUser CanceledSys Failed)
  * `customer`: optional. ObjectId of a user you want orders for
  * `deliverer`: optional. ObjectId of a user you want orders for

* Output (JSON)

  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success
  * orders: [{`_id`: of the objectId
              `tip`: in cents
               location": "clough",
               "reviews": [],
               "dateLastStatusChange": "2015-09-26T10:36:22.965Z",
               "status":}]


`POST /order/cancel` (Cancel a particular order)
* Input
  * `orderID`: id of the order to cancel
* Output (JSON)
  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success
 
`POST /order/accept` (Accept a particular order to deliver)
* Input
  * `orderID`: id of the order to accept
* Output (JSON)
  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success

`POST /order/start` (Start delivering a particular order )
* Input
  * `orderID`: id of the order to start
* Output (JSON)
  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success

`POST /order/confirm` (Confirm delivery of a particular order)
* Input
  * `orderID`: id of the order to confirm
* Output (JSON)
  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success

`POST /order/submitReview` (Submit a review of peer for a particular order)
* Input
  * `orderID`: id of the order to start
  * `stars`: number of stars (5 is best)
  * `comment`: comment on quality
* Output (JSON)
  * `error`: whether an error occured (boolean)
  * `body`: description of the error or success



Install
-------
`npm install`


Deploy
------
Defaults to port `3003`. Modify in `server.js`

`npm start`
