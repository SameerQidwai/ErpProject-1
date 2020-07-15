/* eslint-disable prettier/prettier */

const db = require("./dbc");
var express = require('express')
  , cors = require('cors')

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ObjectId = require('mongoose').Types.ObjectId;

let models = require("./models");

const app = express();
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
app.use('/', express.static(__dirname + '/src'));

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Origin", "X-Requested-With", "Content-Type", "Accept")
  next();
});

let Supplier = models.Supplier; //suplierInfo collection
let Items = models.Items; // Item collection 
let order = models.order; // supplier Orders

let employees = models.employees; // employees array
let eAtt = models.eAttandence;
let eLeaves = models.eLeaves;
let eLoans = models.eLoans;
let Payroll = models.Payroll;

let Categories = models.Categories;
let cart = models.customerCart;
let paidCarts = models.paidCarts;
let customer = models.customer;
let customerHistory = models.customerHistory;
let AccountHead = models.AccountHead;
let AccountType = models.AccountType;
let Transaction = models.Transaction;
let Book = models.Book;
let voucher = models.voucher;

let saveBarcode = models.saveBarcode;
let creditItem = models.creditItem;
let saleCollection = models.saleCollection;
let expense = models.expense;
/**Supplier's API */

//get Supplier
app.get('/api/Supplier', function (req, res) {

  Supplier.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});

//Add Supplier
app.post('/api/Supplier', function (req, res) {
  var query = { name: req.body.name, phone: req.body.phone };
  Supplier.findOne(query, function (e, docs1) { // find if supplier already created
    if (docs1) {
      res.send(false);
    }
    else {
      Supplier.collection.insertOne(req.body, function (err, doc) {
        if (err) {
          res.send(false); //check false to addSup() to show alert if got error
        }
        else {
          res.send(true); //check false to addSup() to show alert succes
        }
      });
    }
  });
});

//update Supplier Name 
app.patch('/api/Supplier', function (req, res) {

  let query = { _id: req.body._id };

  Supplier.updateOne(query, req.body, function (err, doc) {
    if (err) {
      console.log(err);
    }
    // console.log(doc) //Removes the document
  })
});

//delete Supplier
app.delete('/api/Supplier/:id', function (req, res) {

  Supplier.findByIdAndDelete(req.params.id, function (DelErr, DelDoc) {
    if (DelDoc) {
      res.send(true)
    } else {
      res.send(false)
    }
  })
})
// get all the items belong to the supplier Here it is

//get supplier bill
app.get('/api/Supplier-bill/:id', function (req, res) {
  let id = req.params.id;
  order.aggregate([
    { $match: { 'supplierId': id } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        supplierId: { "$first": "$supplierId" },
        orderDate: { "$first": "$orderDate" },
        dueDate: { "$first": "$dueDate" },
        orderNo: { "$first": "$orderNo" },
        advance: { "$first": "$advance" },
        delivered: { "$first": "$delivered" },
        totalAmount: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemCost"] } },
        totalQty: { "$sum": "$items.itemQty" },
      }
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalAmount", "$advance"] }
      }
    },
  ], function (err, doc) {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })
});

/**End Supplier's API */
/**Item api's */
app.get('/api/items', async function (req, res) {

  Items.find(function (err, doc) {
    if (doc) {
      res.send(doc)
    }
  })
});
/** Check Thses two as soon as possible */
app.patch('/api/items', function (req, res) {
  let item = req.body;
  Items.findByIdAndUpdate(item._id, item, { new: true }, function (err, doc) {
    if (doc) {
      // console.log(doc)
      res.send(true)
    } else {
      res.send(false)
    }
  });
});

app.delete('/api/items/:id', function (req, res) {
  Items.findByIdAndDelete(req.params.id, function (DelErr, DelDoc) {
    if (DelDoc) {
      res.send(true)
    } else {
      res.send(false)
    }
  })
});

app.post('/api/items', function (req, res) {
  var data = req.body;
  Items.findOne({ itemName: data.name, code: data.code }, function (err, doc) {
    if (doc === null) {
      Items.collection.insertOne(data, function (err1, doc1) {
        res.send(true)
      });
    } else {
      res.send(doc)
    }
  });
});

/**Git */
/**Search supplier  */

// Sold Carts is he
/**Items Detail */
app.get('/api/item-detail/:id', function (req, res) {
  paidCarts.aggregate([
    { $unwind: '$product' }, { $match: { 'product.itemId': req.params.id } },
    {
      $group: {
        _id: '$_id',
        array: { $first: { itemId: '$product.itemId', itemQty: '$product.sQty', itemCost: '$product.sSale' } },
        date: { $first: '$date' },
        party: { $first: '$customerName' }
      },
    },
    {
      $addFields: { status: 'Sale', totalAmount: { "$multiply": ['$array.itemQty', '$array.itemQty'] } }
    }
  ],
    function (err, doc) {
      if (doc) {
        // console.log(doc)
        order.aggregate([
          { $unwind: '$items' }, { $match: { 'items.itemId': req.params.id } },
          {
            $group: {
              _id: '$_id',
              array: { $first: '$items' },
              date: { $first: '$dueDate' },
              party: { $first: '$supplierName' }
            },
          },
          {
            $addFields: {
              status: 'Purchase', totalAmount: { "$multiply": ['$array.itemQty', '$array.itemCost'] },
            }
          }
        ], function (err1, doc1) {
          if (doc1) {
            var merge = doc.concat(doc1)
            res.send(merge)
          } else {
            console.log(err1)
          }
        })
        // res.send(doc)
      } else {
        console.log(err)
      }
    })
});
/**ItemsDetail */
/**End of Item api */
/**Order Item */
app.post('/api/order', function (req, res) {
  data = req.body;
  var date = data.date
  delete data.date
  order.collection.insertOne(data, async function (err, doc) {
    if (doc) {
      if (data.delivered == true) {
        await delivery(data.delivered, data.items)
      }
      if (data.advance > 0 && data.advance != undefined) {
        await credit(data.act, data.advance, new Date(date), `order NO:${data.orderNo} Purchase from ${data.supplierName}`, doc.insertedId)
      }
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  })
})

app.patch('/api/order', async function (req, res) {
  let data = req.body
  let id = data._id
  delete data._id
  order.findByIdAndUpdate(id, data, async function (err, doc) {
    if (doc) {
      if (data.delivered) { // if true
        if (doc.delivered) { // then check if before it was true
          await delivery(false, doc.items) // dec 
          delivery(data.delivered, data.items) // inc
        } else { // if it was false before just incriment
          delivery(data.delivered, data.items)
        }
      } else { // if false
        if (doc.delivered) { // the check if it was not false before
          delivery(false, doc.items) // dec
        }
      }
      res.send(true)
    } else {
      console.log(err)
    }
  })
})

app.patch('/api/payment-order', function (req, res) {
  let data = req.body
  var date = data.date
  delete data.date
  let update = { $inc: { advance: data.advance }, $set: { delivered: data.delivered } }
  order.findByIdAndUpdate(data.id, update, function (err, doc) {
    if (doc) {
      if (!data.delivered == doc.delivered) { //if delivery is toggle do this
        delivery(data.delivered, doc.items)
      }
      credit(data.acct, data.advance, new Date(date), 'Payment to supplier', ObjectId(data.id))
      res.send(true)
    } else {
      console.log({ err })
    }
  })
})

app.get('/api/myAccount/find/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  Transaction.aggregate([
    { $match: { _ref: id } },
    {
      $lookup:
      {
        from: "AccountType",
        localField: "_accType",
        foreignField: "_id",
        as: "TransAccount"
      },
    },
    { $project: { 'TransAccount': 1 } }
  ], (err, doc) => {
    if (doc.length > 0) {
      var item = doc[0].TransAccount[0]
      res.send(item)
    }
  })
})
//This code is been use in 3 differnt apis hence made thle function

app.delete('/api/order/:id', function (req, res) {

  order.findByIdAndDelete(req.params.id, function (err, doc) {
    if (doc) {
      res.send(true)
      if (doc.delivered) {
        delivery(false, doc.items)
      }
    } else {
      console.log(err)
    }
  })
})

async function delivery(delivered, items) { // undo and do delivery on return Item
  var count = 0;
  items.forEach(element => {
    Items.updateOne({ _id: element.itemId }, update(element.itemQty, delivered), function (stickErr, stockdoc) {
      if (stockdoc) {
        count++;
      }
    })
    if (count === items.length) {
      res.send(true)
    } // call update function
  })

  function update(incQty, delivered) {  // Assign the Update query
    if (delivered) {
      return { $inc: { qty: incQty } }
    } else {
      return { $inc: { qty: -incQty } }
    }
  }
}


app.get('/api/order/:id', function (req, res) {

  order.find(function (err, doc) {
    if (doc) {
      res.send(doc)
    }
  });
});

/**Order Item End */
/**Stock Item add */



/**Start of Empolyee */
app.post('/api/addEmployee', function (req, res) { //add New Employee
  let data = req.body
  let query = { name: data.name, phone: data.phone }
  //check Employee if Him already in dataBase
  employees.findOne(query, function (fErr, fDoc) {
    if (fDoc === null) {
      insEmp()
    }
  })
  var date = new Date('1995-23-11')
  //insEmployee
  function insEmp() {
    employees.collection.insertOne(data, function (insErr, insDoc) {
      if (insDoc) {
        var id = insDoc.insertedId.toString()
        eAtt.collection.insertOne({eId:id,att:[{date,status:false}]},function(err,doc){
          res.send(true);
        })
      }
    })
  }

})

app.get('/api/getEmp', function (req, res) { //get All Employee TO show
  employees.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  })

});

app.patch('/api/editEmployee', function (req, res) { //EditEmpoyee
  let data = req.body
  employees.findByIdAndUpdate(data._id, data, function (upErr, upDoc) {
    if (upDoc) {
      res.send(true)
    } else {
      console.log(upErr)
    }
  })
});

app.delete('/api/editEmployee/:id', function (req, res) { //DeleteEmpoyee
  employees.findByIdAndDelete(req.params.id, function (DelErr, DelDoc) {
    if (DelDoc) {
      res.send(true)
    } else {
      res.send(false)
    }
  })
})
/**End of Employee */

/**start of Attandece */
app.get('/api/attendance', async function (req, res) {

  let count = 0;
  let array = []
  // let data = req.body;
  await employees.find(async function (err, doc) {
    if (doc) {
      console.log(doc,'find')
      let len = doc.length
      for (index = 0; index < len; index++) {
        let element = doc[0]
        let id = element._id;
        console.log(id)
        await eAtt.findOne({ eId: id }).then(doc1 => {
          if (doc1) {
            console.log(doc1)
            let size = doc1.att.length - 1
            array[index] = {
              _id: element._id,
              name: element.name,
              fName: element.fName,
              phone: element.phone,
              address: element.address,
              lastAtt: doc1.att[size],
            }
            if (index == len - 1) {
              console.log(array)
              res.send(array)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }else{
      console.log(err)
    }
  })
});


app.patch('/api/attendance', function (req, res) {
  console.log(req.body)
  let data = req.body;
  let date = new Date(data.Adate)
  let query = { eId: data.id }
  let add = { $push: { att: { date: date } } }
  let option = { upsert: true, setDefaultsOnInsert: true }

  eAtt.findOneAndUpdate(query, add, option, function (err, doc) {
    if (err) {
      console.log({ err })
    } else {
      // employees.findByIdAndUpdate(, { $set: { att: true } }, function (err1, doc1) {
      res.send(true)
      // })
    }

  })
})

app.get('/api/attendance/history/:id', function (req, res) {

  // let data = req.body;
  let query = { eId: req.params.id }

  eAtt.findOne(query, function (err, doc) {
    if (doc) {
      res.send(doc)
    }
  })
})
/**Leaves Start*/
app.post('/api/leaves', function (req, res) { //add New Employee
  let data = req.body
  var date = data.myDate
  delete data.myDate
  data.subDate = date
  //check Employee if Him already in dataBase
  eLeaves.collection.insertOne(data, function (insErr, insDoc) {
    if (insDoc) {
      res.send(true);
    }
  })

})

app.get('/api/leaves', function (req, res) { //get All Employee TO show
  eLeaves.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  })

});
/**Leaves End */

/**Loan Start*/
app.post('/api/Loans', function (req, res) { //add New Employee
  let data = req.body
  //check Employee if Him already in dataBase
  var date = data.date
  delete data.date
  var reason = `Loan is given to Mr.${data.name}`
  eLoans.collection.insertOne(data, function (insErr, insDoc) {
    if (insDoc) {
      credit(data.headAcct, data.loan, new Date(date), reason, insDoc.insertedId, ObjectId(data.eId))
      res.send(true);
    }
  })

})

app.get('/api/Loans', function (req, res) { //get All Employee TO show
  eLoans.find({}, function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  })

});

app.patch('/api/Loans', function (req, res) { //get All Employee TO show, account here
  var update = { $set: { status: true } }

  var data = req.body
  var date = data.drDate
  delete data.drDate
  var reason = `Loan paid by Mr.${data.name}`
  eLoans.findOneAndUpdate({ _id: req.body['_id'] }, update, function (err, doc) {
    if (err) {
      res.send(err);
    }
    else if (doc != null) {
      res.send(true)
      debit(data.headAcct, data.loan, new Date(date), reason, ObjectId(data._id), ObjectId(data.eId))
    } else {
      console.log(doc)
    }
  })

});
/**Loan Ends */

/**Pay starts */
app.get('/api/salary', async function (req, res) {
  var array = []
  await employees.find(async function (err, doc) {
    // res.send(doc)
    for (index in doc) {
      await Payroll.findOne({ eId: doc[index]._id }, async function (err2, doc2) {
        if (doc2 != null) {
          let arr = { info: doc[index], pay: doc2 };
          array.push(arr)
        } else if (doc2 === null) {
          array.push({ info: doc[index], pay: {} })
        }
      })
      if (index == doc.length - 1) {
        console.log(index)
        res.send(array)
      }
    }
  })
})

app.patch('/api/salary', function (req, res) {

  //data.headAcct show transsaction here 
  let data = req.body
  var date = data.date
  delete data.date
  /**FOR TRASACTION */
  var reason = `Mr.${data.emp.name} paid rent`
  var amount = 0
  /**FOR TRASACTION */

  let month = date.getMonth()
  let query = { eId: data.emp._id }
  let options = { upsert: true, setDefaultsOnInsert: true, new: true }
  if (data.bonus) {
    var add = { $push: { salary: { date: date, bouns: data.bonus } }, $set: { lastMonth: month, advance: 0 } }
    amount = data.emp.payroll + data.bonus
  } else {
    var add = { $push: { salary: { date: date } }, $set: { lastMonth: month } }
    amount = data.emp.payroll
  }
  Payroll.findOneAndUpdate(query, add, options, function (err, doc) {
    if (doc) {
      res.send(true)
      credit(data.headAcct, amount, new Date(date), reason, ObjectId(doc._id), ObjectId(data.emp._id))
    }
  })
})

app.patch('/api/salary/adv', function (req, res) {
  let data = req.body
  let query = { eId: data.eId }
  let options = { upsert: true, setDefaultsOnInsert: true, new: true }
  let set = { $set: { advance: data.advance } }
  Payroll.findOneAndUpdate(query, set, options, function (err, doc) {
    if (doc) {
      res.send(true)
    }
  })

})
/**Pay Ends */

/**category */
app.get('/api/category/:id', function (req, res) {
  if (req.params.id === 'parents') {
    var query = { parentId: { $exists: false } }
  } else {
    var query = { parentId: req.params.id }
  }
  Categories.find(query, function (err, doc) {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })
})

app.post('/api/category', function (req, res) {
  var query = req.body
  var options = { upsert: true, new: true }
  Categories.findOneAndUpdate(query, {}, options, function (err, doc) {
    if (doc) {
      res.send(true)
    } else {
      console.log(err)
    }
  })
})
/**End Category */
/**Customer Start */
app.post('/api/customer', function (req, res) {
  var data = req.body;
  var query = { name: data.name, phone: data.phone }
  delete data.name
  delete data.phone
  var options = { upsert: true }
  customer.findOneAndUpdate(query, data, options, function (err, doc) {
    if (doc === null) {
      res.send(true)
    } else if (doc.name) {
      res.send(doc)
    } else {
      res.send(false)
    }
  })
})

app.get('/api/customer', function (req, res) {

  customer.find({}, function (err, docs) {
    if (err) {
      res.send(false);
    } else {
      res.send(docs);
    }
  });

});
/**Customer End */
/**Pos stufff Start Here */

app.post('/api/cart', function (req, res) { //add item into cart
  let data = req.body;

  var d = new Date(data.newDate)
  var date = d.toDateString()
  var time = d.toLocaleTimeString();

  data.product.date = date;
  data.product.time = time;

  var query = { customerId: data.customerId }
  var update = {
    $push: { product: data.product },
    $setOnInsert: { customerName: data.customerName, date: date, time: time }
  }
  var option = { upsert: true, new: true, setDefaultsOnInsert: true }

  cart.findOneAndUpdate(query, update, option, function (err, doc) {
    if (doc) {
      let itemQuery = { _id: data.product.itemId };
      let itemUpdate = { $inc: { qty: -data.product.sQty } }
      Items.updateOne(itemQuery, itemUpdate, function (err1, doc1) {
        if (doc1) {
          // res.send(true)
          res.send(doc)
        }
      })
    } else {
      res.send(false)
    }
  })
})

app.get('/api/cart/:id', function (req, res) { //get item into cart

  var query = { customerId: req.params.id }
  cart.findOne(query, function (err, doc) {
    if (doc != null) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })
})

app.patch('/api/cart', function (req, res) { //delete item from the cart
  let data = req.body;
  let pdt = data.product;


  let itemQuery = { _id: pdt.itemId };
  let itemUpdate = { $inc: { qty: +pdt.sQty } }
  Items.updateOne(itemQuery, itemUpdate, function (err1, doc1) {
    if (doc1) {
      let query = { customerId: data.customerId }
      let update = { $pull: { product: pdt } }
      let option = { upsert: true, new: true, multi: false }
      cart.findOneAndUpdate(query, update, option, function (err, doc) {
        if (doc) {
          res.send(doc)
        } else {
          res.send(err)
        }
      })
    }
  })
})
/**POS Bounderies */
/**Payment Starts*/
app.patch('/api/payment-sales', async function (req, res) {
  let data = req.body
  var date = data.drDate
  if (data.discount) {
    var update = { $inc: { debit: +data.debit, discount: data.discount } }

  } else {
    var update = { $inc: { debit: +data.debit } }
  }
  let query = { customerId: data.customerId }
  let option = { new: true }
  await cart.findOneAndUpdate(query, update, option).then(doc => {
    if (doc) {
      debit(data.act, data.debit, new Date(date), 'Sales', doc._id)

      if (data.closed === true) {
        cart.findOneAndDelete(query, function (err1, doc1) {
          if (doc1) {
            customer.findOneAndDelete({ _id: doc1.customerId }, function (custErr, cust) {
              if (cust) {
                customerHistory.collection.insertOne(cust)
              }
            })
            paidCarts.collection.insertOne(doc1)
            res.send(true)
          }
        })
      } else {
        res.send(doc)
      }
    }
  })

})

app.delete('/api/cart/:id', function (req, res) {

  paidCarts.findByIdAndDelete(req.params.id, function (err, doc) {
    if (doc) {
      res.send(true)
      returnItems(true, doc.product)
    } else {
      console.log(err)
    }
  })
})

app.patch('/api/cart/return', function (req, res) {

  var data = req.body
  var filter = { $match: { _id: ObjectId(data.rId) } }

  var myModel
  if (data.status) {
    myModel = paidCarts
  } else {
    myModel = cart
  }

  myModel.aggregate([
    filter,
    { $unwind: "$product" },
    {
      $group: {
        _id: "$_id",
        debit: { "$first": "$debit" },
        discount: { "$first": "$discount" },
        totalAmount: { "$sum": { "$multiply": ["$product.sQty", "$product.sSale"] } },
        totalQty: { "$sum": "$product.sQty" },
        array: { '$push': '$product' },
      }
    },
  ],
    function (Serr, sale) {
      if (sale) {
        sale = sale[0]
        var pIndex = sale.array.map(function (x) {
          return x.itemId
        })
          .indexOf(data.itemId)

        var item = sale.array[pIndex]
        var itemPrice = item.sQty * item.sSale

        eachDisPer = (sale.discount / sale.totalAmount);
        var discountOnItem = Math.round(itemPrice * eachDisPer);
        var discount = sale.discount - discountOnItem;
        if (sale.debit <= 0 && discount <= 0) {
          var debit = 0;
        } else {
          var debit = sale.debit - itemPrice;
        }

        returnCart(data.rId, item, discount, debit)

      } else {
        console.log(Serr)
      }
    });
  function returnCart(rId, item, discount, debit) {
    var update = { $set: { discount: discount, debit: debit }, $pull: { product: item } }
    var option = { new: true }
    myModel.findByIdAndUpdate(rId, update, option, function (uerr, pull) {
      if (pull) {
        var array = []
        array[0] = { itemId: item.itemId, sQty: item.sQty };
        returnItems(true, array)
        res.send(true);
      } else {
        console.log(uerr)
      }
    })
  }
})

async function returnItems(delivered, items) {
  var count = 0;
  items.forEach(element => {
    Items.updateOne({ _id: element.itemId }, update(element.sQty, delivered), function (stickErr, stockdoc) {
      if (stockdoc) {
        count++;
      }
    })
    if (count === items.length) {
      res.send(true)
    } // call update function
  })

  function update(incQty, delivered) {  // Assign the Update query
    if (delivered) {
      return { $inc: { qty: incQty } }
    } else {
      return { $inc: { qty: -incQty } }
    }
  }
}

/**Payment Boundries */
/**Convert it objectId to string */

// Item Detail
/**Sold Carts is here*/
app.post('/api/sales-report', function (req, res) {
  filter = req.body
  paidCarts.aggregate([
    filter,
    { $unwind: "$product" },
    {
      $group: {
        _id: "$_id",
        customerId: { "$first": "$customerId" },
        customerName: { "$first": "$customerName" },
        date: { "$first": "$date" },
        debit: { "$first": "$debit" },
        discount: { "$first": "$discount" },
        totalAmount: { "$sum": { "$multiply": ["$product.sQty", "$product.sSale"] } },
        totalQty: { "$sum": "$product.sQty" },
        array: { '$push': '$product' },
      }
    },
    {
      $addFields: { status: true }
    }
  ],
    function (err, doc) {
      if (doc) {
        cart.aggregate([
          filter,
          { $unwind: "$product" },
          {
            $group: {
              _id: "$_id",
              customerId: { "$first": "$customerId" },
              customerName: { "$first": "$customerName" },
              date: { "$first": "$date" },
              debit: { "$first": "$debit" },
              discount: { "$first": "$discount" },
              totalAmount: { "$sum": { "$multiply": ["$product.sQty", "$product.sSale"] } },
              totalQty: { "$sum": "$product.sQty" },
              array: { '$push': '$product' },
            }
          },
          {
            $addFields: { status: false }
          }
        ], function (err1, doc1) {
          if (doc1) {
            var merge = doc.concat(doc1)
            res.send(merge)
          } else {
            console.log(err1)
          }
        })
      } else {
        console.log(err)
      }
    });
});

app.get('/api/sales-report/:id', function (req, res) {
  let id = ObjectId(req.params.id)

  var myModel
  if (req.query.status == 'true') {
    myModel = paidCarts
  } else {
    myModel = cart
  }

  myModel.aggregate([
    { $match: { '_id': id } },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$_id",
        customerId: { "$first": "$customerId" },
        customerName: { "$first": "$customerName" },
        date: { "$first": "$date" },
        debit: { "$first": "$debit" },
        discount: { "$first": "$discount" },
        totalAmount: { "$sum": { "$multiply": ["$product.sQty", "$product.sSale"] } },
        totalQty: { "$sum": "$product.sQty" },
        array: { '$push': '$product' },
      }
    },
  ], async function (err, doc) {
    if (doc) {
      if (doc.length > 0) {
        els = doc[0]
        count = els.array.length
        for (index = 0; index < count; index++) {
          let el = els.array[index];
          await Items.findById(el.itemId).then((item, itemErr) => {
            if (item) {
              el = { _id: item._id, code: item.code, name: item.name, decs: item.decs, sQty: el.sQty, sSale: el.sSale, totalPrice: (el.sQty * el.sSale) }
              els.array[index] = el
              if (index == count - 1) {
                res.send(els)
              }
            } else {
              console.log(itemErr)
            }
          });
        };
      }
    } else {
      console.log(err)
    }
  });
});
/**Sold Carts */

app.post('/api/purchase-report', function (req, res) {
  filter = req.body
  order.aggregate([
    filter,
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        supplierId: { "$first": "$supplierId" },
        supplierName: { "$first": "$supplierName" },
        orderDate: { "$first": "$orderDate" },
        deuDate: { "$first": "$dueDate" },
        orderNo: { "$first": "$orderNo" },
        advance: { "$first": "$advance" },
        delivered: { "$first": "$delivered" },
        totalAmount: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemCost"] } },
        totalQty: { "$sum": "$items.itemQty" },
      }
    },
  ],
    function (err, doc) {
      if (doc) {
        res.send(doc);
      } else {
        console.log(err)
      }
    });
});

app.get('/api/purchase-report/:id', function (req, res) {
  let id = ObjectId(req.params.id)
  order.aggregate([
    { $match: { '_id': id } },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        supplierId: { "$first": "$supplierId" },
        supplierName: { "$first": "$supplierName" },
        orderDate: { "$first": "$orderDate" },
        dueDate: { "$first": "$dueDate" },
        orderNo: { "$first": "$orderNo" },
        advance: { "$first": "$advance" },
        delivered: { "$first": "$delivered" },
        totalAmount: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemCost"] } },
        totalQty: { "$sum": "$items.itemQty" },
        array: { '$push': '$items' }
      }
    }

  ], async function (err, doc) {
    if (doc) {
      els = doc[0]
      count = els.array.length
      for (index = 0; index < count; index++) {
        let el = els.array[index];
        await Items.findById(el.itemId).then((item, itemErr) => {
          if (item) {
            el = { _id: item._id, code: item.code, name: item.name, decs: item.decs, pQty: el.itemQty, pCost: el.itemCost, totalPrice: (el.itemQty * el.itemCost) }
            els.array[index] = el
            if (index == count - 1) {
              res.send(els)
            }
          } else {
            console.log(itemErr)
          }
        });
      };
    }
  });
});
/** Sold Cart */

/**FINANCE MODEL STARTS */
app.get('/api/account/head', function (req, res) {

  AccountHead.find(function (err, doc) {
    if (doc) {
      res.send(doc)
    } else {
      consle.log(err)
    }
  })

})

app.get('/api/coa', function (req, res) {  //show all coa in only one var
  AccountType.find(function (typeErr, type) {
    res.send(type)
  })
})


app.post('/api/coa/show', async function (req, res) {  //show all coa in diff var

  var data = req.body
  var filter = []
  var array = []
  filter.push(data._id)
  if (data._lvl2) {
    filter.push(data._lvl2)
  }
  if (data._lvl1) {
    filter.push(data._lvl1)
  }

  var data = req.body
  AccountHead.findById(data._head, function (err, head) {
    if (head) {
      array.push(head)
      AccountType.find({ _id: { $in: filter } }, function (err, doc) {
        if (doc) {
          var newarray = array.concat(doc)
          res.send(newarray)
        }
      })
    }
  });
})

app.post('/api/account/type', async function (req, res) {
  var data = req.body
  // this fucntion works on what variables I get differnt  insertion on each varaible
  var type = Object.assign({}, data)
  delete type.at_name
  delete type._id
  type.name = data.at_name
  type.code = data.range.min
  if (data._lvl2) {   //first condition check
    type.range = { min: data.range.min + 1, max: data.range.min + 63 }
    type._lvl3 = ObjectId(data._id)
    type._lvl2 = ObjectId(data._lvl2)
    type._lvl1 = ObjectId(data._lvl1)
    type._head = ObjectId(data._head)
    await AccountType.collection.insertOne(type)
    await typeUpdate(data._id, update)
  } else if (data._lvl1) {  //second condition check
    var update = { $inc: { 'range.min': +63 } }
    type.range = { min: data.range.min + 1, max: data.range.min + 125 }
    type._lvl2 = ObjectId(data._id)
    type._lvl1 = ObjectId(data._lvl1)
    type._head = ObjectId(data._head)
    await AccountType.collection.insertOne(type)   //insert new Account type according to the variables
    await typeUpdate(data._id, update)   // update range which in model
  } else if (data._head) {   //third condition check
    var update = { $inc: { 'range.min': +125 } }
    type.range = { min: data.range.min + 1, max: data.range.min + 100 }
    type._lvl1 = ObjectId(data._id)
    type._head = ObjectId(data._head)
    await AccountType.collection.insertOne(type)   //insert new Account type according to the variables
    await typeUpdate(data._id, update)  // update range which in model
  } else {  //fourth condition check
    type.range = { min: data.range.min + 1, max: data.range.min + 500 }
    type._head = ObjectId(data._id)
    AccountType.collection.insertOne(type)   //insert new Account type according to the variables
    await headUpdate(data._id)  //head update range which is in diff model
  }

  async function headUpdate(id) {
    var upfilter = { _id: ObjectId(id) }
    var head = { $inc: { 'range.min': +250 } }
    AccountHead.updateOne(upfilter, head, function (upErr, upDoc) {
      if (upDoc) {
        res.send(true)
      }
    })
  }

  async function typeUpdate(id, update) {
    var typefilter = { _id: ObjectId(id) }
    AccountType.updateOne(typefilter, update, function (typeErr, typeDoc) {
      if (typeDoc) {
        res.send(true)
      }
    })
  }
})

app.patch('/api/account/type', async function (req, res) {
  /**seach filter from the list */

  var data = req.body
  if (data._lvl1) {
    var filter = { _head: ObjectId(data._head), _lvl1: ObjectId(data._lvl1), _lvl2: ObjectId(data._id) }
  } else if (data._head) {
    var filter = { _head: ObjectId(data._head), _lvl1: ObjectId(data._id), _lvl2: { $exists: false } }
  } else {
    var filter = { _head: ObjectId(data._id), _lvl2: { $exists: false }, _lvl1: { $exists: false } }
  }

  /**search filter from the list end  */
  AccountType.find(filter, async function (err, doc) {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })
})

async function credit(crAccount, amount, date, reason, ref, meta) {
  const crObj = {
    credit: amount,
    _head: ObjectId(crAccount._head),
    _accType: ObjectId(crAccount._id),
    _ref: ref,
    debit: 0.0,
    timestamp: date,
    reason: reason
  };
  if (crAccount._lvl1) {
    crObj['_lvl1'] = ObjectId(crAccount._lvl1)
    if (crObj._lvl2) {
      crObj['_lvl2'] = ObjectId(crAccount._lvl2)
      if (crAccount._lvl3) {
        crObj['_lvl3'] = ObjectId(crAccount._lvl3)
      }
    }
  }

  if (meta) {
    crObj._meta = meta
  }

  Transaction.collection.insertOne(crObj).then(tr_doc => {
    if (tr_doc) {
      console.log(tr_doc.insertedId)
    }
  })
}

async function debit(dbAccount, amount, date, reason, ref, meta) {
  const dbObj = {
    debit: amount,
    _head: ObjectId(dbAccount._head),
    _accType: ObjectId(dbAccount._id),
    _ref: ref,
    credit: 0.0,
    timestamp: date,
    reason: reason
  };

  if (dbAccount._lvl1) {
    dbObj['_lvl1'] = ObjectId(dbAccount._lvl1)
    if (dbAccount._lvl2) {
      dbObj['_lvl2'] = ObjectId(dbAccount._lvl2)
      if (dbAccount._lvl3) {
        dbObj['_lvl3'] = ObjectId(dbAccount._lvl3)
      }
    }
  }

  if (meta) {
    dbObj._meta = meta
  }

  Transaction.collection.insertOne(dbObj).then(tr_doc => {
    if (tr_doc) {
      console.log(tr_doc.insertedId)
    }
  })
}

app.get('/api/Balance', async function (req, res) {
  var head = []
  var lvl1 = []
  var lvl2 = []
  await Transaction.aggregate([
    {
      '$group': {
        _id: '$_head',
        debit: { $sum: "$debit" },
        credit: { $sum: '$credit' }
      }
    }
  ]).then(doc => {
    if (doc) {
      head = doc
      Transaction.aggregate([
        {
          '$group': {
            _id: '$_lvl1',
            debit: { $sum: "$debit" },
            credit: { $sum: '$credit' }
          }
        }
      ]).then(doc1 => {
        lvl1 = doc1
        Transaction.aggregate([
          {
            '$group': {
              _id: '$_lvl2',
              debit: { $sum: "$debit" },
              credit: { $sum: '$credit' }
            }
          }
        ]).then(doc2 => {
          lvl2 = doc2
          Transaction.aggregate([
            {
              '$group': {
                _id: '$_accType',
                debit: { $sum: "$debit" },
                credit: { $sum: '$credit' }
              }
            }
          ]).then(doc3 => {
            accType = doc3
            let array = [head, lvl1, lvl2, accType]
            res.send(array)
          })
        })
      })
    }
  })
})

app.patch('/api/Balance/filter', async function (req, res) {
  var head = []
  var lvl1 = []
  var lvl2 = []

  var data = req.body
  var date1 = new Date(data.from_date)
  var date2 = new Date(data.to_date)
  date1.setDate(date1.getDate())
  date2.setDate(date2.getDate())
  var filter = { $match: { timestamp: { $gte: date1, $lte: date2 } } }

  await Transaction.aggregate([
    filter,
    {
      '$group': {
        _id: '$_head',
        debit: { $sum: "$debit" },
        credit: { $sum: '$credit' }
      }
    }
  ]).then(doc => {
    if (doc) {
      head = doc
      Transaction.aggregate([
        {
          '$group': {
            _id: '$_lvl1',
            debit: { $sum: "$debit" },
            credit: { $sum: '$credit' }
          }
        }
      ]).then(doc1 => {
        lvl1 = doc1
        Transaction.aggregate([
          {
            '$group': {
              _id: '$_lvl2',
              debit: { $sum: "$debit" },
              credit: { $sum: '$credit' }
            }
          }
        ]).then(doc2 => {
          lvl2 = doc2
          Transaction.aggregate([
            {
              '$group': {
                _id: '$_accType',
                debit: { $sum: "$debit" },
                credit: { $sum: '$credit' }
              }
            }
          ]).then(doc3 => {
            accType = doc3
            let array = [head, lvl1, lvl2, accType]
            res.send(array)
          })
        })
      })
    }
  })

})


app.get('/api/myAccount', function (req, res) {
  var head = []
  AccountHead.find(function (err, doc) {
    if (doc) {
      head = doc
      var filter = { _lvl2: { $exists: false }, _lvl1: { $exists: false } }
      lvl1 = []
      AccountType.find(filter, function (err1, doc1) {
        if (doc1) {
          lvl1 = doc1
          var filter2 = { _lvl2: { $exists: false }, _lvl1: { $exists: true } }
          lvl2 = []
          AccountType.find(filter2, function (err2, doc2) {
            if (doc2) {
              lvl2 = doc2
              var filter3 = { _lvl2: { $exists: true }, _lvl1: { $exists: true } }
              lvl3 = []
              AccountType.find(filter3, function (err3, doc3) {
                if (doc3) {
                  lvl3 = doc3
                  var array = [head, lvl1, lvl2, lvl3]
                  res.send(array)
                }
              })
            }
          })
        }
      })
    }
  })
})

/**Payments */
app.patch('/api/payments/cash', async function (req, res) {

  data = req.body
  acct = data.paidAcct
  var date = data.date
  delete data.paidAcct.range
  delete data.paidAcct.code
  var reason = `Cash paid to ${data.recBy} ref no ${data.voucher}`
  voucher.collection.insertOne(data, function (err, doc) {
    if (doc) {
      credit(acct, data.credit, new Date(date), reason, doc.insertedId)
      res.send(true)
    }
  })
})

app.patch('/api/received/cash', async function (req, res) {

  data = req.body
  acct = data.recAcct
  var date = data.date
  delete data.recAcct.range
  delete data.recAcct.code
  var reason = `Cash received from ${data.recBy} ref no ${data.voucher}`
  voucher.collection.insertOne(data, function (err, doc) {
    if (doc) {
      debit(acct, data.debit, new Date(date), reason, doc.insertedId)
      res.send(true)
    }
  })
})

app.get('/api/vouchers', function (req, res) {
  if (res) {
    voucher.find(function (err, doc) {
      res.send(doc)
    })
  }
})
app.patch('/api/payments/bank', async function (req, res) {

  data = req.body
  paidAcct = data.paidAcct
  var date = data.date
  delete data.paidAcct.range
  delete data.paidAcct.code
  delete data.recAcct.range
  delete data.recAcct.code
  var reason = `paid to ${data.recAcct.name} ref no ${data.voucher}`
  voucher.collection.insertOne(data, function (err, doc) {
    if (doc) {
      credit(paidAcct, data.credit, new Date(date), reason, doc.insertedId)
      res.send(true)
    }
  })
})

app.patch('/api/received/bank', async function (req, res) {
  data = req.body
  recAcct = data.recAcct
  var date = data.date
  delete data.paidAcct.range
  delete data.paidAcct.code
  delete data.recAcct.range
  delete data.recAcct.code

  var reason = `Money received from ${data.paidAcct.name} ref no ${data.voucher}`
  voucher.collection.insertOne(data, function (err, doc) {
    if (doc) {
      debit(recAcct, data.debit, new Date(date), reason, doc.insertedId)
      res.send(true)
    }
  })
})

app.get('/api/voucher', function (req, res) {

  voucher.countDocuments(function (err, index) {
    console.log(index)
    var data = { index: index + 131 }
    res.send(data)
  })
})

app.get('/api/income', function (req, res) {

  array = [ObjectId('5ea7e614b6646f4210dac5fe'), ObjectId('5ea7e5dcb6646f4210dac5fd')]

  AccountHead.find({ _id: { $in: array } }, function (err, doc) {
    if (doc) {
      head = doc
      var filter = { _head: { $in: array }, _lvl2: { $exists: false }, _lvl1: { $exists: false } }
      lvl1 = []
      AccountType.find(filter, function (err1, doc1) {
        if (doc1) {
          lvl1 = doc1
          var filter2 = { _head: { $in: array }, _lvl2: { $exists: false }, _lvl1: { $exists: true } }
          lvl2 = []
          AccountType.find(filter2, function (err2, doc2) {
            if (doc2) {
              lvl2 = doc2
              var filter3 = { _head: { $in: array }, _lvl2: { $exists: true }, _lvl1: { $exists: true } }
              lvl3 = []
              AccountType.find(filter3, function (err3, doc3) {
                if (doc3) {
                  lvl3 = doc3
                  Transaction.find({ _head: { $in: array } }, function (transErr, trans) {
                    if (trans) {
                      var array = [head, lvl1, lvl2, lvl3, trans]
                      res.send(array)
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
})

app.patch('/api/rent/credit', function (req, res) {
  data = req.body
  var date = data.drDate
  var rent = parseInt(data.rent) * data.Dates.length
  var reason = `Rent paid for ${data.Dates.length} Months`
  debit(data.headAcct, rent, new Date(date), reason, ObjectId(data.rentId), data.slipId)
})

app.get('/api/general', function (req, res) {

  Transaction.aggregate([
    {

      $lookup:
      {
        from: "AccountType",
        localField: "_accType",
        foreignField: "_id",
        as: "TransAccount"
      },
    },
    { $project: { 'TransAccount': 1, 'reason': 1, 'timestamp': 1, 'credit': 1, 'debit': 1 } }
  ], (err, doc) => {
    res.send(doc)
  })
})

app.get('/api/coa/all', function (req, res) {  // genral ledger filter head with top head
  AccountHead.find(function (headErr, head) {
    AccountType.find(function (typeErr, type) {
      var array = head.concat(type)
      res.send(array)
    })
  })
})

app.patch('/api/general/filter', async function (req, res) {
  data = req.body

  var acct = data.headAcct

  var datefilter = undefined
  if (data.from_date && data.to_date) {
    var date1 = new Date(data.from_date)
    var date2 = new Date(data.to_date)
    date1.setDate(date1.getDate())
    date2.setDate(date2.getDate())
    datefilter = { timestamp: { $gte: date1, $lte: date2 } }
  } else if (data.from_date) {
    var date1 = new Date(data.from_date)
    var date2 = new Date(data.from_date)
    date1.setDate(date1.getDate()) // add -1 becuse I want that date  but we are finding $gte
    date2.setDate(date2.getDate() + 1) // add -1 becuse I want that date  but we are finding $lte

    datefilter = { timestamp: { $gte: date1, $lte: date2 } }
  }
  console.log(datefilter)
  var filter = undefined
  if (acct) {
    if (acct._lvl2) {
      var id = ObjectId(acct._id)
      filter = { _accType: id }
    } else if (acct._lvl1) {
      var id = ObjectId(acct._id)
      filter = { $or: [{ _accType: id }, { _lvl2: id }] }
    } else if (acct._head) {
      var id = ObjectId(acct._id)
      filter = { $or: [{ _accType: id }, { _lvl1: id }] }
    } else {
      var id = ObjectId(acct._id)
      filter = { _head: id }
    }
  }

  if (filter && datefilter) {
    filtered = { $match: { $and: [filter, datefilter] } }
  } else if (filter) {
    filtered = { $match: filter }
  } else {
    filtered = { $match: datefilter }
  }


  Transaction.aggregate([
    filtered,
    {
      $lookup:
      {
        from: "AccountType",
        localField: "_accType",
        foreignField: "_id",
        as: "TransAccount"
      },
    },
    { $project: { 'TransAccount': 1, 'reason': 1, 'timestamp': 1, 'credit': 1, 'debit': 1 } }
  ], (err, doc) => {
    res.send(doc)
    if (err) {
      console.log({ err })
    }
  })
})


/**FINANCE MODULE ENDS */

// app.set('port', process.env.PORT || 40005);
const PORT = process.env.PORT || 40005;

// app.listen(app.get('port'), function () {
//   console.log('Express server listening on port '  + app.get('port') + '/');
// });

app.listen(PORT, function () {
  console.log('Express server listening on port ' + PORT + '/');
});


// "heroku-postbuild": "cd client && npm install && npm run build"

//sync Loop
/**for (index = 0; index < len; index++) {
        let element = doc.product[index]
        await Items.findById(element.itemId).then(doc1 => {
          if (doc1) {
            doc.product[index] = {
              itemId: doc1._id,
              name: doc1.name,
              sQty: element.sQty,
              sSale: element.sSale,
              date: element.date,
              time: element.time,
              subtotal: element.sQty * element.sSale
            }
          }
        })
      } */