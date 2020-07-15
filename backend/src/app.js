/* eslint-disable prettier/prettier */

const db = require("./dbc");
var express = require('express')
  , cors = require('cors')

var cron = require('node-cron');
const fs = require("fs");

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var ObjectId = require('mongoose').Types.ObjectId;



let models = require("./models");
const { Console } = require("console");

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
let AccountHead = models.AccountHead;
let AccountType = models.AccountType;
let Transaction = models.Transaction;
let voucher = models.voucher;
let Units = models.Units;
let ownerShip = models.ownerShip;
let tenant_details = models.tenant_details;
let property_details = models.property_details;
let transfer_details = models.transfer_details;
let rent_details = models.rent_details;
let propertyHistory = models.propertyHistory;
let expense = models.expense;
let property_types = models.property_types;
let save_account =models.save_Account
/**Supplier's API */

cron.schedule("* * 1 * *", async function() {
// cron.schedule("*/10 * * * * *", async function () {
  // console.log('sameer')
  var date = new Date()
  var m = date.getMonth().toString()
  var y = date.getFullYear().toString()

  var varDate = `${m} 01 ${y} 00:00:00 GMT`
  var mydate = new Date(varDate)

  let TRI = undefined; let SRI = undefined; let SUR = undefined; let TUR = undefined; let SRR = undefined;
  let TRR = undefined; let MANT_AB = undefined; let MANT_AM = undefined; let MANT_A = undefined;
  let MANT_B = undefined; let MANT_C = undefined; let ORI = undefined; let DEPOSIT_AB = undefined;
  let DEPOSIT_AM = undefined; let DEPOSIT_A = undefined; let DEPOSIT_B = undefined; 
  let DEPOSIT_C = undefined
  await AccountType.find({
    $or: [
      { name: 'Tenant Rent Income' }, { name: 'Sublet Rent Income' }, { name: 'Sublet Advance Rent' },
      { name: 'Tenant Advance Rent' }, { name: 'Sublet Rent Receivable' }, { name: 'Tenant Rent Receivable' },
      { name: 'Tenant Unearned Rent' }, { name: 'Sublet Unearned Rent' }, { name: 'Other Rent Income' },
      { name: 'Arcade Building' }, { name: 'Arcade Market' }, { name: 'Circle Building - A' },
      { name: 'Circle Building - B' }, { name: 'Circle Building - C' }, { name: 'Occupancy Deposit' },
      { name: 'Repair And Maintenance'}
    ]
  }, async function (erErr, erdoc) {
    if (erdoc.length > 0) {
      const DEPOSIT = erdoc.find(el => el.name == 'Occupancy Deposit');
      const RM = erdoc.find(el => el.name == 'Repair And Maintenance');
      erdoc.forEach((obj, index) => {
        if (obj.name === "Tenant Rent Income") {
          TRI = obj
        }
        if (obj.name === "Other Rent Income") {
          ORI = obj
        }
        if (obj.name === "Sublet Rent Income") {
          SRI = obj
        }
        if (obj.name === "Sublet Unearned Rent") {
          SUR = obj
        }
        if (obj.name === "Tenant Unearned Rent") {
          TUR = obj
        }
        if (obj.name === "Sublet Rent Receivable") {
          SRR = obj
        }
        if (obj.name === "Tenant Rent Receivable") {
          TRR = obj
        }
        if (obj.name === 'Arcade Building' && obj._lvl2.toString() == RM._id.toString()) {
          MANT_AB = obj
        }
        if (obj.name === 'Arcade Market' && obj._lvl2.toString() == RM._id.toString()) {
          MANT_AM = obj
        }
        if (obj.name === 'Circle Building - A' && obj._lvl2.toString() == RM._id.toString()) {
          MANT_A = obj
        }
        if (obj.name === 'Circle Building - B' && obj._lvl2.toString() == RM._id.toString()) {
          MANT_B = obj
        }
        if (obj.name === 'Circle Building - C' && obj._lvl2.toString() == RM._id.toString()) {
          MANT_C = obj
        }
        if (obj.name === 'Arcade Building' && obj._lvl2.toString() == DEPOSIT._id.toString()) {
          DEPOSIT_AB = obj
        }
        if (obj.name === 'Arcade Market' && obj._lvl2.toString() == DEPOSIT._id.toString()) {
          DEPOSIT_AM = obj
        }
        if (obj.name === 'Circle Building - A' && obj._lvl2.toString() == DEPOSIT._id.toString()) {
          DEPOSIT_A = obj
        }
        if (obj.name === 'Circle Building - B' && obj._lvl2.toString() == DEPOSIT._id.toString()) {
          DEPOSIT_B = obj
        }
        if (obj.name === 'Circle Building - C' && obj._lvl2.toString() == DEPOSIT._id.toString()) {
          DEPOSIT_C = obj
        }
      })
    }
  })
  var filter = { $match: { curMonth: { $gte: mydate } } }
  rent_details.aggregate([
    // filter,
    {
      $lookup: {
        from: "property_details",
        localField: "bldgId",
        foreignField: "_id",
        as: "pro"
      }
    },
    { $unwind: '$pro' },
    {
      $lookup: {
        from: "ownerShip",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: '$owner' },
    {
      $lookup: {
        from: "tenant_details",
        localField: "owner.ownerId",
        foreignField: "_id",
        as: "tenant"
      }
    },
    {
      $unwind: {
        path: '$tenant',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "transfer_details",
        localField: "transferId",
        foreignField: "_id",
        as: "trans"
      }
    },
    {
      $unwind: {
        path: '$trans',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$_id',
        deposit: { '$first': '$deposit' },
        mant: { '$first': '$pro.mant' },
        type: { '$first': '$pro.type' },
        owner_id: { '$first': '$owner.ownerId' },
        ownerRent: { '$first': '$owner.ownerRent' },
        ownerName: { '$first': '$tenant.tenantName' },
        ownDate: { '$first': '$curMonth' },
        subDate: { '$first': '$subMonth' },
        sub_id: { '$first': '$trans._id' },
        subRent: { '$first': '$trans.acceptedRent' },
        subName: { '$first': '$trans.subletName' },
      },
    },
    // { $project: {'_id':1, 'deposit':1 } }
  ], async function (err, doc) {
    let b = await doc.forEach(async (el,index) => {
      console.log(index)
      var ownDate = new Date(el.ownDate)
      if (ownDate.getTime() > mydate.getTime()){
        var deb =  await tenant(el,true)
      }else if (ownDate.getTime() <= mydate.getTime()){
        var cre = await tenant(el,false)
      }
      if (el.sub_id){
        var subDate = new Date(el.subDate)
        console.log({subDate})
        if (subDate.getTime() > mydate.getTime()){
          var deb =  await sublet(el,true)
        }else if (subDate.getTime() <= mydate.getTime()){
          var cre = await sublet(el,false)
        }
      }
     
      return true
    });
    console.log( {TRI}  ,  {SRI}  ,  {SUR}  ,  {TUR}  ,  {SRR}  ,{TRR}  ,  {MANT_AB}  ,  {MANT_AM}  ,  {MANT_A}  ,
      {MANT_B}  ,  {MANT_C}  ,  {ORI}  ,  {DEPOSIT_AB}  ,  {DEPOSIT_AM}  ,  {DEPOSIT_A}  ,  {DEPOSIT_B}  , 
      {DEPOSIT_C}  )
    var indiaTime = new Date()
  })
  
  async function tenant(item,Tstatus) {
    var rent = item.ownerRent
    var perD = Math.round((10 / 100) * rent || 0)
    var deposit = item.deposit
    var OD = deposit >= perD ? perD : deposit
    var mant = item.mant
    var OC = Math.round(((15 / 100) * rent) || 0)
    var totalRent = rent - OD + mant + OC

    console.log('advance', date, { rent }, { OD }, { mant }, { OC }, { totalRent }, item.type)

    if (totalRent){
      if (Tstatus){
        var tur = await debit(TUR,totalRent,date,`Tenant Advance Rent ${item.ownerName}`,item._id,item.owner_id)
      }else{
        var trr = await debit(TRR,totalRent,date, `Monthly Rent Recevible ${item.ownerName}`,item._id,item.owner_id)
      }
    }
    if (OD){ 
      var Odeposit = undefined
      if (item.type == 'Arcade Building'){
        Odeposit = DEPOSIT_AB
      }else if (item.type== 'Arcade Market'){
        Odeposit = DEPOSIT_AM
      }else if (item.type == 'Circle Building - A'){
        Odeposit = DEPOSIT_A
      }else if (item.type == 'Circle Building - B'){
        Odeposit = DEPOSIT_B
      }else if (item.type == 'Circle Building - C'){
        Odeposit = DEPOSIT_C
      }
      if(Odeposit){
        var min = await debit(Odeposit,OD ,date,`Monthly Deposit Rent ${item.ownerName}`,item._id,item.owner_id)
      }
    }
    if (rent){
      var tri = await credit(TRI,rent,date,`Monthly Rent Income ${item.ownerName}` ,item._id,item.owner_id)
    }
    if (OC){ 
      var ori = await credit(ORI,OC,date,`Monthly Rent Other Charges ${item.ownerName}`,item._id,item.owner_id)
    }
    if (mant){ 
      var MANT = undefined
      if (item.type == 'Arcade Building'){
        MANT = MANT_AB
      }else if (item.type== 'Arcade Market'){
        MANT = MANT_AM
      }else if (item.type == 'Circle Building - A'){
        MANT = MANT_A
      }else if (item.type == 'Circle Building - B'){
        MANT = MANT_B
      }else if (item.type == 'Circle Building - C'){
        MANT = MANT_C
      }
      if(MANT){
        var min = await credit(MANT,mant,date,`Monthly Mantianance Rent${item.ownerName}` ,item._id,item.owner_id)
      }
    }
  }

  async function sublet(item,S_status) {
    var subRent = item.subRent
    if (S_status){
      var deb = await debit(SUR,subRent,date,`Monthly sublet Receivable ${item.subName}`,item._id,item.sub_id)
    }else{
      var deb = debit(SRR,subRent,date,`Monthly sublet Receivable ${item.subName}`,item._id,item.sub_id)
    }
      var cre = await credit(SRI,subRent,date,`Monthly Rent Income ${item.subName}` ,item._id,item.sub_id)
     return true
  }
});

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

app.get('/api/units', function (req, res) {

  Units.find(function (err, doc) {
    if (err) {
      res.send(false);
    }
    else {
      res.send(doc);
    }
  });

});
app.post('/api/units', function (req, res) {

  var unit = { name: req.body.name.toUpperCase(), acronym: req.body.acronym.toUpperCase() }

  Units.findOneAndUpdate(unit, unit, { upsert: true }, function (err, doc) {
    if (doc == null) {
      res.send(true)
    } else if (doc.name) {
      res.send(doc)
    } else {
      res.send(false)
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

  let data = req.body
  let query = { _id: data._id };

  Supplier.updateOne(query, data, function (err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.send(true)
    }
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


app.get('/api/supplier/detail', function (req, res) {

  Supplier.aggregate([
    {
      $lookup: {
        from: "Transaction",
        localField: "_id",
        foreignField: "_meta",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: '$_id',
        name: { '$first': '$name' },
        email: { '$first': '$email' },
        phoneNo: { '$first': '$phone' },
        address: { '$first': '$address' },
        about: { '$first': '$about' },
        debit: { "$sum": "$detail.debit" },
        credit: { "$sum": '$detail.credit' },
      },
    },
    {
      $addFields: {
        amount: { $subtract: ["$debit", "$credit"] }
      }
    }
  ], (err, doc) => {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })

});

app.get('/api/supplier/detail/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  order.aggregate([
    {
      $match: { 'supplierId': id }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$_id',
        orderDate: { '$first': '$orderDate' },
        dueDate: { '$first': '$dueDate' },
        orderNo: { '$first': '$orderNo' },
        credit: { '$first': "$advance" },
        totalPrice: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemUnit.qty", '$items.itemCost'] } },
        totalQty: { "$sum": "$items.itemQty" },
      },
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalPrice", "$credit"] }
      }
    }
  ], (err, doc) => {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })

})

app.post('/api/supplier/payment', function (req, res) {

  var data = req.body
  var reason = `Payment to Mr.${data.sup.name}`
  credit(data.headAcct, data.credit, new Date(data.date), reason, undefined, ObjectId(data.sup._id)).then(() => {
    res.send(true)
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
app.post('/api/items/cat', async function (req, res) {
  Items.find({ categories: { $all: req.body } }, function (err, doc) {
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

app.post('/api/items', async function (req, res) {
  var data = req.body;
  if (!data.code || data.code == '') {

    await Items.countDocuments(function (err, index) {
      cat = data.categories
      var char = data.name.substr(0, 1)
      char = char + cat[cat.length - 1].category.substr(0, 1)
      char = char + '-'
      char = char + index.toString().substr(index.length - 1)
      data.code = char
    })
  }

  Items.findOne({ itemName: data.name }, function (err, doc) {
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
  var id = ObjectId(req.params.id)
  paidCarts.aggregate([
    { $unwind: '$items' }, { $match: { 'items.itemId': id } },
    {
      $group: {
        _id: '$_id',
        item: { $first: { itemId: '$items.itemId', itemQty: '$items.sQty', itemCost: '$items.sSale', itemUnit: '$items.sUnit' } },
        date: { $first: '$date' },
        party: { $first: '$customerName' }
      },
    },
    {
      $addFields: { status: 'Sale', totalAmount: { "$multiply": ['$item.itemQty', '$item.itemCost', '$item.itemUnit.qty'] } }
    }
  ],
    function (err, doc) {
      if (doc) {
        order.aggregate([
          { $unwind: '$items' }, { $match: { 'items.itemId': id } },
          {
            $group: {
              _id: '$_id',
              item: { $first: '$items' },
              date: { $first: '$dueDate' },
              party: { $first: '$supplierName' }
            },
          },
          {
            $addFields: {
              status: 'Purchase', totalAmount: { "$multiply": ['$item.itemQty', '$item.itemCost', '$item.itemUnit.qty'] },
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
/**ORder Approval System Api */
app.patch('/api/request-order/get', function (req, res) {
  order.find(req.body, async function (err, doc) {
    if (doc) {
      res.send(doc);
    } else {
      res.send({ status: false });
    }
  })
})

app.get('/api/request-order/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  order.aggregate([
    { $match: { '_id': id } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "Items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: '$_id',
        requestDate: { '$first': '$requestDate' },
        supplierId: { '$first': '$supplierId' },
        supplierName: { '$first': '$supplierName' },
        items: {
          $push: {
            '_id': '$detail._id',
            'name': '$detail.name',
            'code': '$detail.code',
            'decs': '$detail.decs',
            'unit': '$detail.unit',
            'qty': '$detail.qty',
            'pPrice': '$items.itemCost',
            'sPrice': '$detail.sPrice',
            'pQty': '$items.itemQty',
            'selectUnit': '$items.itemUnit'
          }
        },
        totalPrice: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemUnit.qty", '$items.itemCost'] } },
        totalQty: { "$sum": "$items.itemQty" },
      }
    },
  ], (err, doc) => {
    if (doc) {
      res.send(doc[0])
    } else {
      console.log(err)
    }
  })
})

app.get('/api/request-order/payment/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  order.aggregate([
    { $match: { '_id': id } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "Items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: '$_id',
        requestDate: { '$first': '$requestDate' },
        supplierId: { '$first': '$supplierId' },
        supplierName: { '$first': '$supplierName' },
        items: {
          $push: {
            '_id': '$detail._id',
            'name': '$detail.name',
            'code': '$detail.code',
            'decs': '$detail.decs',
            'unit': '$detail.unit',
            'qty': '$detail.qty',
            'pPrice': '$items.itemCost',
            'sPrice': '$detail.sPrice',
            'pQty': '$items.itemQty',
            'delivery': '$items.delivered',
            'selectUnit': '$items.itemUnit'
          }
        },
        totalPrice: {
          "$sum": {
            "$cond": [{ "$eq": ["$items.delivered", true] },
            { "$multiply": ["$items.itemQty", "$items.itemUnit.qty", '$items.itemCost'] }, 0]
          }
        },
        totalQty: {
          "$sum": {
            "$cond": [{ "$eq": ["$items.delivered", true] },
              "$items.itemQty", 0]
          },
        }
      },
    }
  ], (err, doc) => {
    if (doc) {
      res.send(doc[0])
    } else {
      console.log(err)
    }
  })
})

app.post('/api/request-order', function (req, res) {
  data = req.body;
  data.requestDate = new Date(data.requestDate)
  data.items.forEach((el, index) => {
    el.itemId = ObjectId(el.itemId)
    if (index == data.items.length - 1) {
      order.collection.insertOne(data, async function (err, doc) {
        if (doc) {
          res.send({ status: true });
        } else {
          res.send({ status: false });
        }
      })
    }
  });
})

app.patch('/api/request-order', function (req, res) {
  let data = req.body
  data._id = ObjectId(data._id)
  if (data.items.length > 0) {
    order.findByIdAndUpdate(data._id, data, function (err, doc) {
      if (doc) {
        res.send(true)
      } else {
        console.log(err)
      }
    })
  } else {
    order.findByIdAndDelete(data._id, function (err, doc) {
      if (doc) {
        res.send(true)
      } else {
        console.log(err)
      }
    })
  }
})

app.patch('/api/request-action', function (req, res) {
  let data = req.body
  data._id = ObjectId(data._id)
  order.findByIdAndUpdate(data._id, data, function (err, doc) {
    if (doc) {
      res.send(true)
    } else {
      console.log(err)
    }
  })
})
/**End ORder Approval System Api */

app.post('/api/order', function (req, res) {
  var total = 0;
  data = req.body;
  var date = data.date
  delete data.date
  data.supplierId = ObjectId(data.supplierId)
  // console.log(data.items)
  data.items.forEach((el, index) => {
    el.itemId = ObjectId(el.itemId)
    total += (el.itemCost * el.itemQty * el.itemUnit.qty)

    if (index == data.items.length - 1) { // make it run at the very last iteration of loop. cuz of async 
      order.collection.insertOne(data, async function (err, doc) {
        if (doc) {
          if (data.delivered == true) {
            await delivery(data.delivered, data.items)
          }
          await debit(data.act, total, new Date(date), `order NO:${data.orderNo} Purchase from ${data.supplierName}`, doc.insertedId, data.supplierId)
          if (data.advance > 0 && data.advance != undefined) {
            await credit(data.act, data.advance, new Date(date), `order NO:${data.orderNo} Purchase from ${data.supplierName}`, doc.insertedId, data.supplierId)
          }
          res.send({ status: true });
        } else {
          res.send({ status: false });
        }
      })
    }
  });

})

app.patch('/api/order', async function (req, res) {
  let data = req.body
  let id = data._id
  let total = data.total
  delete data.total
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
  var supplierId = data.supplierId
  var creditreason = `Payment to supplier Mr.${data.supplierName}`
  var debitreason = `Added into Inventory from supplier Mr.${data.supplierName}`
  var Taxreason = `Tax paid over Inventory`
  let update = { $inc: { advance: data.advance }, $set: { stage: data.stage } }
  delete data.supplierId
  delete data.supplierName

  order.findByIdAndUpdate(ObjectId(data._id), update, function (err, doc) {
    if (doc) {
      debit(data.invenHead, data.total + data.tax, new Date(date), creditreason, ObjectId(data._id), ObjectId(supplierId))
      if (data.advance > 0) {
        credit(data.acct, data.advance, new Date(date), creditreason, ObjectId(data._id), ObjectId(supplierId))
      }
      if (data.tax > 0) {
        credit(data.taxHead, data.tax, new Date(date), Taxreason, ObjectId(data._id), ObjectId(supplierId))
      }
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

  var id = ObjectId(req.params.id)
  order.findByIdAndDelete(id, function (err, doc) {
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

app.patch('/api/request-order/approval', function (req, res) {
  let data = req.body
  data._id = ObjectId(data._id)
  data.supplierId = Object(data.supplierId)
  console.log(data)
  order.findByIdAndUpdate(data._id, data, function (err, doc) {
    if (doc) {
      if (data.stage == 'Delivered') {
        delivery(true, data.items)
      }
      res.send(true)
    } else {
      console.log(err)
    }
  })
})

async function delivery(delivered, items) {
  var count = 0;
  items.forEach(element => {
    Items.updateOne({ _id: element.itemId }, update(element.itemQty * element.itemUnit.qty, delivered), function (stickErr, stockdoc) {
      if (stockdoc) {
        count++;
      }
    })
    if (count === items.length) {
      // res.send(true)
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
        // var id = insDoc.insertedId.toString() 
        var id = insDoc.insertedId
        eAtt.collection.insertOne({ eId: id, att: [{ date, status: false }] }, function (err, doc) {
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
      let len = doc.length
      for (index = 0; index < len; index++) {
        let element = doc[index]
        // let id = element._id.toString() // attendance change from 
        let id = element._id // attendance change to
        await eAtt.findOne({ eId: id }).then(doc1 => {
          if (doc1) {
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
              res.send(array)
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  })
});

app.patch('/api/attendance', function (req, res) {

  // let data = req.body;
  let data = req.body;
  let date = new Date(data.Adate)
  let query = { eId: data.id }
  let add = { $push: { att: { date: date } } }
  let option = { upsert: true, setDefaultsOnInsert: true }

  eAtt.findOneAndUpdate(query, add, option, function (err, doc) {
    if (err) {
      console.log({ err })
    } else {
      // employees.findByIdAndUpdate(req.params.id, { $set: { att: true } }, function (err1, doc1) {
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
  var date = new Date()
  date = date.toDateString()
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
      // console.log(doc)
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
        res.send(array)
      }
    }
  })
})

app.patch('/api/salary', function (req, res) {

  //data.headAcct show transsaction here 
  let data = req.body
  var date = new Date(data.date)
  delete data.date
  /**FOR TRASACTION */
  var reason = `Mr.${data.emp.name} paid rent`
  var amount = 0
  /**FOR TRASACTION */

  let month = date.getMonth()
  date = date.toDateString()
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
app.patch('/api/customer', function (req, res) {
  var data = req.body
  customer.updateOne({ _id: ObjectId(data._id) }, data, function (err, doc) {
    if (doc) {
      res.send(true)
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

app.post('/api/customer/payment', function (req, res) {

  var data = req.body
  var reason = `Payment by ${data.cust.name}`
  // console.log(data,reason)
  debit(data.headAcct, data.debit, new Date(data.date), reason, undefined, ObjectId(data.cust._id)).then(() => {
    res.send(true)
  })

});

app.get('/api/customer/detail', function (req, res) {

  customer.aggregate([
    {
      $lookup: {
        from: "Transaction",
        localField: "_id",
        foreignField: "_meta",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: '$_id',
        name: { '$first': '$name' },
        email: { '$first': '$email' },
        phoneNo: { '$first': '$phone' },
        address: { '$first': '$address' },
        debit: { "$sum": "$detail.debit" },
        credit: { "$sum": '$detail.credit' },
      },
    },
    {
      $addFields: {
        amount: { $subtract: ["$debit", "$credit"] }
      }
    }
  ], (err, doc) => {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })

});

app.get('/api/customer/detail/order/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  paidCarts.aggregate([
    {
      $match: { 'customerId': id }
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$_id',
        date: { '$first': '$date' },
        debit: { '$first': "$debit" },
        discount: { "$first": '$discount' },
        totalPrice: { "$sum": { "$multiply": ["$items.sQty", "$items.sUnit.qty", '$items.sSale'] } },
        totalQty: { "$sum": "$items.sQty" },
      },
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalPrice", "$debit"] }
      }
    }
  ], (err, doc) => {
    if (doc) {
      res.send(doc)
    } else {
      console.log(err)
    }
  })

})
/**Customer End */
/**Pos stufff Start Here */

app.post('/api/cart', function (req, res) { //add item into cart
  let data = req.body;

  data.customerId = ObjectId(data.customerId)
  data.items.itemId = ObjectId(data.items.itemId)
  data.date = new Date(data.date)
  var query = { customerId: data.customerId }
  var update = {
    $push: { items: data.items },
    $setOnInsert: { customerName: data.customerName, date: data.date }
  }
  var option = { upsert: true, new: true, setDefaultsOnInsert: true }

  cart.findOneAndUpdate(query, update, option, function (err, doc) {
    if (doc) {
      let itemQuery = { _id: data.items.itemId };
      let itemUpdate = { $inc: { qty: -(data.items.sQty * data.items.sUnit.qty) } }
      Items.updateOne(itemQuery, itemUpdate, function (err1, doc1) {
        if (doc1) {
          res.send(true)
        }
      })
    } else {
      res.send(false)
    }
  })
})

app.get('/api/cart/:id', function (req, res) { //get item into cart

  var id = ObjectId(req.params.id)
  console.log(id)
  cart.aggregate([
    { $match: { 'customerId': id } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "Items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: '$_id',
        date: { '$first': '$date' },
        customerId: { '$first': '$customerId' },
        customerName: { '$first': '$customerName' },
        items: {
          $push: {
            '_id': '$detail._id',
            'name': '$detail.name',
            'code': '$detail.code',
            'decs': '$detail.decs',
            'qty': '$detail.qty',
            'sPrice': '$detail.sPrice',
            'sSale': '$items.sSale',
            'sQty': '$items.sQty',
            'sUnit': '$items.sUnit',
            'index': '$items.index'
          }
        },
        totalPrice: { "$sum": { "$multiply": ["$items.sQty", "$items.sUnit.qty", '$items.sSale'] } },
        totalQty: { "$sum": "$items.sQty" },
      }
    },
  ], (err, doc) => {
    if (doc) {
      res.send(doc[0])
    } else {
      console.log(err)
    }
  })
})

app.patch('/api/cart', function (req, res) { //delete item from the cart
  let data = req.body;
  let pdt = data.items;

  let itemQuery = { _id: pdt.itemId };
  let itemUpdate = { $inc: { qty: +pdt.sQty } }
  Items.updateOne(itemQuery, itemUpdate, function (err1, doc1) {
    if (doc1) {
      let query = { customerId: ObjectId(data.customerId) }
      let update = { $pull: { items: pdt } }
      let option = { upsert: true, new: true, multi: false }
      cart.findOneAndUpdate(query, update, option, function (err, doc) {
        if (doc) {
          res.send(true)
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
  var customer = data.customerName
  delete data.customerName
  if (!data.debit) {
    data.debit = 0
  }
  if (data.discount) {
    var update = { $inc: { debit: +data.debit, discount: data.discount } }

  } else {
    var update = { $inc: { debit: +data.debit } }
  }
  let query = { customerId: data.customerId }
  let option = { new: true }
  await cart.findOneAndUpdate(query, update, option).then(doc => {
    if (doc) {
      if (data.debit) {
        debit(data.act, data.debit, new Date(date), `Sale to ${customer}`, doc._id, ObjectId(data.customerId))
      }
      if (data.closed === true) {
        cart.findOneAndDelete(query, function (err1, doc1) {
          if (doc1) {
            paidCarts.collection.insertOne(doc1)
            credit(data.act, data.total, new Date(date), `Sale to ${customer}`, doc._id, ObjectId(data.customerId))
            res.send(true)
          }
        })
      }
      else {
        res.send(false)
      }
    }
  })
})

app.delete('/api/cart/:id', function (req, res) {

  paidCarts.findByIdAndDelete(ObjectId(req.params.id), function (err, doc) {
    if (doc) {
      // res.send(true)
      returnItems(true, doc.items)
    } else {
      console.log(err)
    }
  })
})

app.delete('/api/cart/returnSale/:id', async function (req, res) {
  var id = ObjectId(req.params.id)
  cart.findByIdAndDelete(id, async function (err, doc) {
    if (doc) {
      await returnItems(true, doc.items)
      res.send(true)
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
    Items.updateOne({ _id: element.itemId }, update(element.sQty * element.sUnit.qty, delivered), function (stickErr, stockdoc) {
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
  console.log(filter)
  paidCarts.aggregate([
    filter,
    { $unwind: "$items" },
    {
      $group: {
        _id: "$_id",
        customerId: { "$first": "$customerId" },
        customerName: { "$first": "$customerName" },
        date: { "$first": "$date" },
        debit: { "$first": "$debit" },
        discount: { "$first": "$discount" },
        totalAmount: { "$sum": { "$multiply": ["$items.sQty", "$items.sSale", "$items.sUnit.qty"] } },
        totalQty: { "$sum": "$items.sQty" },
        array: { '$push': '$items' },
      }
    },
    {
      $addFields: { status: true }
    }
  ],
    function (err, doc) {
      if (doc) {
        res.send(doc)
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
    { $unwind: "$items" },
    {
      $lookup: {
        from: "Items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
    {
      $group: {
        _id: "$_id",
        customerId: { "$first": "$customerId" },
        customerName: { "$first": "$customerName" },
        date: { "$first": "$date" },
        debit: { "$first": "$debit" },
        discount: { "$first": "$discount" },
        items: {
          $push: {
            '_id': '$detail._id',
            'name': '$detail.name',
            'code': '$detail.code',
            'decs': '$detail.decs',
            'unit': '$detail.unit',
            'qty': '$detail.qty',
            'sSale': '$items.sSale',
            'sPrice': '$detail.sPrice',
            'sQty': '$items.sQty',
            'selectUnit': '$items.sUnit',
            'total': { "$multiply": ["$items.sQty", "$items.sUnit.qty", '$items.sSale'] },
          }
        },
        totalPrice: { "$sum": { "$multiply": ["$items.sQty", "$items.sUnit.qty", '$items.sSale'] } },
        totalQty: { "$sum": "$items.sQty" },
      }
    },
  ], async function (err, doc) {
    if (doc) {
      res.send(doc[0])
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
        totalAmount: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemCost", "$items.itemUnit.qty"] } },
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
      $lookup: {
        from: "Items",
        localField: "items.itemId",
        foreignField: "_id",
        as: "detail"
      }
    },
    { $unwind: '$detail' },
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
        items: {
          $push: {
            '_id': '$detail._id',
            'name': '$detail.name',
            'code': '$detail.code',
            'decs': '$detail.decs',
            'unit': '$detail.unit',
            'qty': '$detail.qty',
            'pCost': '$items.itemCost',
            'pPrice': '$detail.pPrice',
            'pQty': '$items.itemQty',
            'selectUnit': '$items.itemUnit',
            'total': { "$multiply": ["$items.itemQty", "$items.itemUnit.qty", '$items.itemCost'] },
          }
        },
        totalPrice: { "$sum": { "$multiply": ["$items.itemQty", "$items.itemUnit.qty", '$items.itemCost'] } },
        totalQty: { "$sum": "$items.itemQty" },
      }
    },
    {
      $addFields: {
        balance: { $subtract: ["$totalPrice", "$advance"] }
      }
    }
  ], async function (err, doc) {
    if (doc) {
      res.send(doc[0])
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
  AccountType.find({ '_lvl2': { $exists: true } }, function (typeErr, type) {
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
  console.log(data)
  var type = { name: data.at_name, code: data.code }
  if (data._lvl1) {  //second condition check
    console.log('lvl1')
    var filter = { _lvl2: data._id }
    type._lvl2 = ObjectId(data._id)
    type._lvl1 = ObjectId(data._lvl1)
    type._head = ObjectId(data._head)
    await addType(filter, type)
  } else if (data._head) {   //third condition check
    console.log('lvl2')

    var filter = { _lvl1: data._id, _lvl2: { $exists: false } }
    type._lvl1 = ObjectId(data._id)
    type._head = ObjectId(data._head)
    await addType(filter, type)
  } else {  //fourth condition check
    console.log('lvl3')
    var filter = { _head: data._id, _lvl1: { $exists: false } }
    type._head = ObjectId(data._id)
    await addType(filter, type)
  }

  async function addType(filter, type) {
    // AccountType.findOne({ name: data.at_name }, function (finE, fin) {
    //   if (!fin) {
    AccountType.countDocuments(filter, function (ierr, index) {
      if (index >= 0) {
        index++;
        type.code = type.code + '-' + index
        AccountType.collection.insertOne(type, function (insE, ins) {
          if (ins) {
            res.send(true)
          }
        })
      }
    })
    // } else {
    //   res.send(false)
    // }
    // })
  }
})

app.post('/api/account/head', async function (req, res) {
  var data = req.body
  data.at_name = data.at_name.charAt(0).toUpperCase() + data.at_name.slice(1)
  console.log(data)
  AccountHead.findOne({ name: data.at_name }, function (finE, fin) {
    console.log(fin)
    if (!fin) {
      AccountHead.countDocuments(function (ierr, index) {
        if (index >= 0) {
          var saveObj = { name: data.at_name, code: index + 1 }
          AccountHead.collection.insertOne(saveObj, function (insE, ins) {
            if (ins) {
              res.send(true)
            }
          })
        }
      })
    } else {
      console.log(fin)
      res.send(false)
    }
  })
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
      return true
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
      return true
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
    var data = { index: index + 131 }
    res.send(data)
  })
})

app.get('/api/income', function (req, res) {

  // array = [ObjectId('5eae4a04c34d7b14e05e8199'), ObjectId('5eae4a1567a6743e2ce9fb91')]

  AccountHead.find({ $or: [{ name: 'Income' }, { name: 'income' }, { name: 'Expenses' }, { name: 'Expense' }] }, function (erErr, erdoc) {
    if (erdoc) {
      var array = [erdoc[0]._id, erdoc[1]._id]
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
    }
  })


})

app.patch('/api/rent/credit', async function (req, res) {
  data = req.body
  // console.log(data)

  await AccountType.find({
    $or: [
      { name: 'Tenant Rent Income' }, { name: 'Sublet Rent Income' }, { name: 'Sublet Advance Rent' },
      { name: 'Tenant Advance Rent' }, { name: 'Sublet Rent Receivable' }, { name: 'Tenant Rent Receivable' },
      { name: `${data.bank}` }, { name: 'Cash in Hand' }, { name: 'Tenant Unearned Rent' },
      { name: 'Sublet Unearned Rent' }, { name: `${data.type}` } //, {name:'deposit}
    ]
  }, async function (erErr, erdoc) {
    if (erdoc.length > 0) {
      erdoc.forEach((obj, index) => {
        if (obj.name === "Tenant Rent Income") {
          TRI = obj
        }
        if (obj.name === "Sublet Rent Income") {
          SRI = obj
        }
        if (obj.name === "Sublet Unearned Rent") {
          SUR = obj
        }
        if (obj.name === "Tenant Unearned Rent") {
          TUR = obj
        }
        if (obj.name === "Sublet Rent Receivable") {
          SRR = obj
        }
        if (obj.name === "Tenant Rent Receivable") {
          TRR = obj
        }
        if (obj.name === "Soneri Bank Ltd") {
          BANK = obj
        }
        if (obj.name === "Cash in Hand") {
          CASH = obj
        }
        if (obj.name === `${data.type}`) {
          MANT = obj
        }

        if (index == erdoc.length - 1) {
          see(index)
        }
      });

      async function see(index) {
        if (data.method == 'Bank') {
          var method = BANK
          var checqueId = data.checqueId
        } else {
          var method = CASH
          var checqueId = 'CASH'
        }

        // var ownerPay = data.ownerPay + data.ownerAdv + data.subletPay 
        let Advdeb = await debit(method, data.GTotal, new Date(data.payDate), `Rent paid for`, ObjectId(data.rentId), checqueId)


        if (data.ownerMonths.curr) {
          data.ownerMonths.pre.push(data.ownerMonths.curr)
        }

        if (data.subletMonths.curr) {
          data.subletMonths.pre.push(data.subletMonths.curr)
        }

        if (data.Dates) {
          await ownerTrans(method, checqueId)
        }
        if (data.subDates) {
          await subTrans(method, checqueId)
        }
      }


      async function ownerTrans(method, checqueId) {

        if (data.oldAdv > 0) {
          let addDeb = await debit(TUR, data.oldAdv, new Date(data.payDate), 'Tenant Advance liability', ObjectId(data.rentId), checqueId)
        }
        if (data.ownerAdv) {
          let addcre = await credit(TUR, data.ownerAdv, new Date(data.payDate), 'Tenant Advance liability', ObjectId(data.rentId), checqueId)
        }
        if (data.own.relief) {
          let refdr = await debit(TRI, data.own.ref, new Date(data.payDate), 'Relief On Tenant Rent', ObjectId(data.rentId))
        }
        if (data.own.panelty) {
          let refCr = await credit(TRI, data.own.pan, new Date(data.payDate), 'Penalty On Tenant Rent', ObjectId(data.rentId), checqueId)
        }
        if (data.ownerMonths.pre.length > 0) {

          if (data.ownerMonths.pre.length == 1) {
            var TRreason = `Tenant Rent for ${data.ownerMonths.pre[0]}`
          } else if (data.ownerMonths.pre.length > 1) {
            var TRreason = `Tenant Rent for ${data.ownerMonths.pre[0]} to ${data.ownerMonths.pre[data.ownerMonths.pre.length - 1]}`
          }

          // var ownerRent = data.ownerRent  * data.ownerMonths.pre.length
          let cer = await credit(TRR, data.RRPay, new Date(data.payDate), TRreason, ObjectId(data.rentId), checqueId)
        }

        if (data.ownerMonths.adv.length > 0) {

          if (data.ownerMonths.adv.length == 1) {
            var TUreason = `Advance Tenant Rent for ${data.ownerMonths.adv[0]}`
          } else if (data.ownerMonths.pre.length > 1) {
            var TUreason = `Advance Tenant Rent for ${data.ownerMonths.adv[0]} to ${data.ownerMonths.adv[data.ownerMonths.adv.length - 1]}`
          }

          // var ownerRent = data.ownerRent  * data.ownerMonths.adv.length
          let cer = await credit(TUR, data.URPay, new Date(data.payDate), TUreason, ObjectId(data.rentId), checqueId)
        }
        return true
      }

      async function subTrans(method, checqueId) {

        if (data.oldSubAdvance > 0) {
          let addDeb = await debit(SUR, data.oldSubAdvance, new Date(data.payDate), 'Sublet Advance liability', ObjectId(data.rentId), checqueId)
        }
        if (data.SubAdv > 0) {
          let addcre = await credit(SUR, data.SubAdv, new Date(data.payDate), 'Sublet Advance liability', ObjectId(data.rentId), checqueId)
        }
        if (data.sub.relief) {
          let refdr = await debit(TRI, data.sub.ref, new Date(data.payDate), 'Relief On Sublet Rent', ObjectId(data.rentId))
        }
        if (data.sub.panelty) {
          let refCr = await credit(TRI, data.sub.pan, new Date(data.payDate), 'Penalty On Sublet Rent', ObjectId(data.rentId), checqueId)
        }
        if (data.subletMonths.pre.length > 0) {

          if (data.subletMonths.pre.length == 1) {
            var SRreason = `Sublet Rent for ${data.subletMonths.pre[0]}`
          } else if (data.subletMonths.pre.length > 1) {
            var SRreason = `Sublet Rent for ${data.subletMonths.pre[0]}-${data.subletMonths.pre[data.subletMonths.pre.length - 1]}`
          }

          var subRent = data.subletRent * data.subletMonths.pre.length
          let cer = await credit(SRR, subRent, new Date(data.payDate), SRreason, ObjectId(data.rentId), checqueId)
        }
        if (data.subletMonths.adv.length > 0) {

          if (data.subletMonths.adv.length == 1) {
            var SUreason = `Advance Sublet Rent for ${data.subletMonths.adv[0]}`
          } else if (data.subletMonths.pre.length > 1) {
            var SUreason = `Advance Sublet Rent  for ${data.subletMonths.adv[0]}-${data.subletMonths.adv[data.subletMonths.adv.length - 1]}`
          }

          var subRent = data.subletRent * data.subletMonths.adv.length
          let cer = await credit(SUR, subRent, new Date(data.payDate), SUreason, ObjectId(data.rentId), checqueId)
        }
      }
      return true
    }
    res.send(true)
  })

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
    /* {
      $lookup:
      {
        from: "AccountType",
        localField: "_lvl2",
        foreignField: "_id",
        as: "lvl"
      },
    }, */
    { $project: { 'TransAccount': 1, 'reason': 1, 'timestamp': 1, 'credit': 1, 'debit': 1, /**'lvl1':1*/ } }
  ], (err, doc) => {
    console.log(doc)
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

app.patch('/api/payments/supplier', async function (req, res) {

  let data = req.body
  let acct = data.headAcct
  var date = new Date(data.date)

  data.supplierName = data.supplierId.name
  let orderNo = data.orderNo
  data.supplierId = data.supplierId._id
  var reason = `Amount paid to ${data.supplierName} ref no ${orderNo}`
  order.collection.insertOne(data, function (err, doc) {
    if (doc) {
      credit(acct, data.credit, date, reason, doc.insertedId, ObjectId(data.supplierId))
      res.send(true)
    }
  })
})

/**Property APi's */
app.get('/property-details',function(req,res){
  property_details.find(function(err,doc){
    res.send(doc)
  })
})

app.post('/property-details',function(req,res){  
  var data = req.body
  property_details.collection.insertOne(data,function(err,doc){
    if(doc){
      res.sendStatus(200)
    }
  })
})

app.patch('/property-details',function(req,res){  
  var data = req.body
  var filter = {'_id' : ObjectId(data._id)}
  delete data._id
  property_details.updateOne(filter,data,function(err,doc){
    if(doc.nModified=1){
      res.sendStatus(200)
    }
  })
})

app.delete('/property-details/:id',function(req,res){  
  let id = req.params.id
  var filter = {'bldgId': ObjectId(id)}
  ownerShip.findOne(filter,function(o_err,o_doc){
    if(!o_doc){
      property_details.findByIdAndRemove(ObjectId(id),function(p_err,p_doc){
        if(p_doc){
          res.sendStatus(202)
        }
      })
    }else if(o_doc) {
      res.sendStatus(200)
    }
  })
})
/**Property Api's */

/**tenant Api's */
app.get('/tenant-details',function(req,res){
  tenant_details.find(function(err,doc){
    res.send(doc)
  })
})

app.post('/tenant-details',function(req,res){  
  var data = req.body
  tenant_details.collection.insertOne(data,function(err,doc){
    if(doc){
      res.sendStatus(200)
    }
  })
})

app.patch('/tenant-details',function(req,res){  
  var data = req.body
  var filter = {'_id' : ObjectId(data._id)}
  delete data._id
  tenant_details.updateOne(filter,data,function(err,doc){
    if(doc.nModified=1){
      res.sendStatus(200)
    }
  })
})

app.delete('/tenant-details/:id',function(req,res){  
  let id = req.params.id
  var filter = {'ownerId' : { $in : [ObjectId(id)]}}
  ownerShip.findOne(filter,function(o_err,o_doc){
    if(!o_doc){
      tenant_details.findByIdAndRemove(ObjectId(id),function(p_err,p_doc){
        if(p_doc){
          res.sendStatus(202)
        }
      })
    }else if(o_doc) {
      res.sendStatus(200)
    }
  })
})

/**Tenant Api's */

/**FINANCE MODULE ENDS */
/**Rent APi owner ship */
app.post('/property/ownership', function (req, res) {
  var data = req.body
  var bldgId = data.bldgId
  data.bldgId = ObjectId(data.bldgId)
  data.ownerId = ObjectId(data.ownerId)
  var filter = { bldgId: ObjectId(data.bldgId) }
  var option = { upsert: true, new: true }

  ownerShip.findOneAndDelete(filter, function (err, doc) {
    if (doc) {
      delete doc._id
      delete doc.bldgId
      doc.endDate = data.signDate
      var update = { $push: { ownership: doc } }
      propertyHistory.findOneAndUpdate(filter, update, option, function (uperr, upDoc) {
        if (upDoc) {
          changeOwner(data)
        }
      })
    } else {
      changeOwner(data)
    }
  })

  function changeOwner(obj) {
    obj.paidAmount = 0;
    obj.process = 'Signed';
    ownerShip.collection.insertOne(obj, function (iErr, iDoc) {
      if (iDoc) {
        property_details.findByIdAndUpdate(ObjectId(obj.bldgId), { $set: { forsale: false } }, function (opErr, opDoc) {
        })
        // rent_details.findOneAndUpdate({ bldgId: ObjectId(bldgId) }, { $set: { ownerId: iDoc.insertedId.toString() } }, option, function (jErr, jDOc) {
        // })
        console.log(iDoc.insertedId)
        res.send(true)
      }
    })
  }

})

app.get('/property/ownership/approval/:process', function (req, res) {
  var process = req.params.process
  if (process == 'Approved') {
    var filter = {
      '$match': {
        '$or': [
          { process: process },
          {
            '$and': [
              { process: 'Transfer' },
              { $expr: { $lt: ["$paidAmount", "$purchaseAmount"] } }]
          }]
      }
    }
  } else {
    var filter = { $match: { process: process } }
  }

  ownerShip.aggregate([
    filter,
    {
      $lookup: {
        from: "tenant_details",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: '$owner' },
    {
      $lookup: {
        from: "property_details",
        localField: "bldgId",
        foreignField: "_id",
        as: "bldg"
      }
    },
    { $unwind: '$bldg' },
    {
      $group: {
        _id: '$_id',
        signDate: { '$first': '$signDate' },
        lastDate: { '$first': '$lastDate' },
        purchaseAmount: { '$first': '$purchaseAmount' },
        ownerRent: { '$first': '$ownerRent' },
        paidAmount: { '$first': '$paidAmount' },
        process: { '$first': '$process' },
        owner: { '$first': '$owner' },
        bldg: { '$first': '$bldg' }
      },
    },
  ], (err, doc) => {
    if (doc) {
      console.log(doc)
      res.send(doc)
    } else {
      console.log(err)
    }
  })
})

app.patch('/property/ownership/approval', async function (req, res) {
  var data = req.body
  var filter = { _id: ObjectId(data.id) }
  var query = { "$set": { process: data.status } }

  if (data.status == 'Approved') {
    ownerShip.updateOne(filter, query, function (err, doc) {
      if (doc) {
        res.send(true)
      }
    });
  } else if (data.status == 'Rejected') {
    ownerShip.deleteOne(filter, function (err, doc) {
      if (doc) {
        res.send(true)
      }
    })
  } else if (data.status == 'Transfer') {
    await rent_details.findOneAndUpdate(
      { bldgId: ObjectId(data.bldgId) },    //ownMonth
      { $set: { ownerId: ObjectId(data.id), curMonth: new Date(data.date), deposit: data.deposit } },
      { upsert: true }, async (fishyE, fishD) => {
        if (fishD) {
          await ownerShip.findOneAndUpdate(filter, query, async function (err, doc) {
            if (doc) {
              var filterAc = { $or: [{ name: 'Property Transfer Fee' }, { name: 'Soneri Bank Ltd' }, { name: 'Occupancy Deposit' },{name: data.type}] }
              await AccountType.find(filterAc, async function (erErr, erdoc) {
                if (erdoc.length > 0) {/* console.log(erdoc) */
                  const OD = erdoc.find(el => el.name == 'Occupancy Deposit');
                  erdoc.forEach(async (obj, index) => {
                    if (data.paidAmount){
                      if (obj.name === "Property Transfer Fee") {
                        let deb = await credit(obj, data.paidAmount, new Date(data.date), `OwnerShip Transfer To  ${data.owner}`, ObjectId(data.bldgId), ObjectId(data.id))
                      } else if (obj.name === 'Soneri Bank Ltd') {
                        let cre = await debit(obj, data.paidAmount + data.deposit, new Date(data.date), `Transfer Fee & deposit from ${data.owner}`, ObjectId(data.bldgId), ObjectId(data.id))
                      } else if (obj.name== data.type && obj._lvl2.toString() === OD._id.toString()) {
                        if (data.deposit){
                          let cre = await credit(obj, data.deposit, new Date(data.date), `OwnerShip Deposit by ${data.owner}`, ObjectId(data.bldgId), ObjectId(data.id))
                        }                     
                      }
                    }
                  })
                }
              })
              res.send(true)
            }
          });
        } else {
          // console.log(fishyE)
        }
      }
    )
  }
})

app.patch('/property/ownership/payment', function (req, res) {
  var data = req.body
  console.log(data)
  var filter = { '_id': ObjectId(data.id) }
  var update = {
    '$inc': { 'paidAmount': data.amount },
    '$addToSet': { 'paymnets': { 'date': data.today, 'amount': data.amount } }
  }
  if (data.method == 'BANK') {
    var methodAc = 'Soneri Bank Ltd'
    var cehqueId = data.chequeId
  } else {
    var methodAc = 'Cash in Hand'
    var cehqueId = 'CASH'
  }
  var filterAc = { $or: [{ name: 'Property Transfer Fee' }, { name: methodAc }] }
  ownerShip.updateOne(filter, update, async function (err, doc) {
    if (doc) {
      await AccountType.find(filterAc, async function (erErr, erdoc) {
        if (erdoc.length > 0) {
          erdoc.forEach(async (obj, index) => {
            if (data.amount) {
              if (obj.name === "Property Transfer Fee") {
                let deb = await debit(obj, data.amount, data.today, `payment for Ownerhip by ${data.owner}`, ObjectId(data.bldgId), cehqueId)
              } else {
                let cre = await credit(obj, data.amount, data.today, `payment for Ownerhip by ${data.owner}`, ObjectId(data.bldgId), cehqueId)
              }
            }
          })
        }
      })
      res.send(true)
    }
  })
});

app.get('/property/ownership/:id', function (req, res) {
  var id = ObjectId(req.params.id)
  var cond = { bldgId: id }
  ownerShip.findOne(cond, function (err, doc) {
    if (doc) {
      console.log(doc)
      res.send(doc)
    }
  })
})

app.patch('/property/deposit', function (req, res) {
  var data = req.body
  data.deposit = parseInt(data.deposit)
  console.log(data)
  var filter = { _id: ObjectId(data._id) }
  var update = { '$inc': { deposit: data.deposit } }
  rent_details.updateOne(filter, update, function (err, doc) {
    if (doc.nModified == 1) {
      res.send(true)
      console.log(true)
    } else {
      res.send(false)
      console.log(false)

    }
  })
})

app.post('/property/type', function (req, res) {
  var data = req.body

  var options = { upsert: true }
  property_types.findOneAndUpdate(data, data, options, function (err, doc) {
    res.send(true)
  })
});

app.get('/property/type', function (req, res) {

  property_types.find(function (err, doc) {
    if (doc.length > 0) {
      res.send(doc)
    }
  })
})

app.patch('/property/type', async function (req, res) { //this api is t mantance on every type this peroperty
  var data = req.body

  console.log(data)

  await property_types.updateOne({ type: data.newtypeMant }, { amount: data.amount }, async function (err, doc) {
    // console.log(doc)
  })

  await property_details.updateMany({ type: data.newtypeMant }, { mant: data.amount }, async function (err, doc) {
    if (doc.nModified > 0) {
      res.send(true)
    }
  });
});

app.get('/rent/transfer-history', function(req,res){
  rent_details.aggregate([
    {
      $lookup: {
        from: "property_details",
        localField: "bldgId",
        foreignField: "_id",
        as: "pro"
      }
    },
    { $unwind: '$pro' },
    {
      $lookup: {
        from: "ownerShip",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: '$owner' },
    { $lookup: {
      from: 'tenant_details',
      let: { 'oid': '$owner.ownerId' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$oid'] } } }
        // Add additional stages here 
      ],
      as:"tenant"
      }
    },
    {
      $lookup: {
        from: "transfer_details",
        localField: "transferId",
        foreignField: "_id",
        as: "trans"
      }
    },
    {
      $unwind: {
        path: '$trans',
        preserveNullAndEmptyArrays: true
      }
    },
    { $group: {
      _id: "$_id",
      pro: { $first: "$pro" },
      tenant: {$first: "$tenant" },
      owner: {$first: "$owner"},
      trans: {$first: { $cond: [ '$trans', '$trans', {} ]}},
      curMonth: {$first: "$curMonth"},
      subMonth: {$first: "$subMonth"},
      deposit: {$first: "$deposit"}
      }
    }
  ],function(err,doc){
    if (doc.length>0){
      res.send(doc)
    }
  })
})

app.post('/rent/transfer-history', function(req,res){
  let data = req.body
  let cond = {'bldgId': ObjectId(data['bldgId'])}
  delete data['bldgId']
  let options = {upsert: true, new: true}

  transfer_details.findOneAndUpdate(cond,data,options,function(sub_err,sub_doc){
    if (sub_doc){
      var rentData = {transferId: sub_doc._id , subMonth: data['leaseStartDate']}
      rent_details.findOneAndUpdate(cond, rentData,options,function(rent_err,rent_doc){
        if (rent_doc){
        attr = {"$set": {'available': false}}
        property_details.findByIdAndUpdate(cond['bldgId'],attr,options,function(pro_err,pro_doc){
          if (pro_doc){
            res.send(true)
          }
        })
      }
      })
    }
  }) 
})

app.patch('/rent/transfer-history', function(req,res){
  var data = req.body
  var rent_filter = {'_id': ObjectId(data.id)}
  var option = {upsert:true}
  rent_details.findOne(rent_filter,function(f_err,f_doc){
    if (f_doc){
      var tenant_filter = {'_id': f_doc.ownerId}
      console.log({f_doc})
      ownerShip.findOne(tenant_filter,function(o_err,o_doc){ //findOneandDelete
        if (o_doc){
          delete o_doc
          var owner_filter = {'bldgId':o_doc.bldgId}
          propertyHistory.findOneAndUpdate(owner_filter,o_doc,option,function(h_err,h_doc){
            
            if (data.perIs== 'Owner'){
       
            }else if (data.perIs == 'Tenant'){
      
            }else if (data.perIs == 'Sublet'){
      
            }
          })
        }
      })
    } 
  })
})

app.get('/rent/rent-details', function(req,res){
  rent_details.aggregate([
    {
      $lookup: {
        from: "property_details",
        localField: "bldgId",
        foreignField: "_id",
        as: "pro"
      }
    },
    { $unwind: '$pro' },
    {
      $lookup: {
        from: "ownerShip",
        localField: "ownerId",
        foreignField: "_id",
        as: "owner"
      }
    },
    { $unwind: '$owner' },
    { $lookup: {
      from: 'tenant_details',
      let: { 'oid': '$owner.ownerId' },
      pipeline: [
        { $match: { $expr: { $in: ['$_id', '$$oid'] } } }
        // Add additional stages here 
      ],
      as:"tenant"
      }
    },
    {
      $lookup: {
        from: "transfer_details",
        localField: "transferId",
        foreignField: "_id",
        as: "trans"
      }
    },
    {
      $unwind: {
        path: '$trans',
        preserveNullAndEmptyArrays: true
      }
    },
    { $group: {
      _id: "$_id",
      bldgId : {$first: "$bldgId"},
      ownerId: {$first: "$ownerId"},
      transferId: {$first: "$transferId"},
      ownerId: {$first: "$ownerId"},
      tenant: {$first: "$tenant.tenantName" },
      ownerRent: {$first: "$owner.ownerRent"},
      subletName: {$first : "$trans.subletName"},
      acceptedRent: {$first : "$trans.acceptedRent"},
      address: {$first : "$pro.address"},
      type: {$first : "$pro.type"},
      mant: {$first : "$pro.mant"},
      deposit: {$first : "$deposit"},
      subAdv: {$first : "$subAdv"},
      ownerAdv: {$first : "$ownerAdv"},
      subMonth: {$first : "$subMonth"},
      curMonth: {$first : "$curMonth"},
      }
    }
  ],function(err,doc){
    if (doc.length>0){
      res.send(doc)
    }
  })
})

app.patch('/rent/rent-details', function (req, res) {
  var data = req.body
  // console.log(data)
  rent_id = {'_id': ObjectId(data['rentId'])}
  console.log({rent_id})
  if (data.Dates){
    var O_dates = data['Dates']
    var olen = O_dates.length -1
    OL_Date = O_dates[olen]
    OL_Date = OL_Date.split("-")
    OL_Date = `${OL_Date[0]} 01 ${OL_Date[1]} 00:00:00 GMT`
  }else {
    O_dates =[]
    OL_Date = undefined
  }
  if (data.subDates){
    var S_dates = data['subDates']
    var slen = S_dates.length -1
    SL_Date = S_dates[slen]
    SL_Date = SL_Date.split("-")
    SL_Date = `${SL_Date[0]} 01 ${SL_Date[1]} 00:00:00 GMT`
  }else{
    S_dates = []
    SL_Date = undefined
  }

  var length = O_dates.length > S_dates.length ? O_dates.length : S_dates.length

  for (var i = 0 ; i < length ; i++){
    if (i < O_dates.length){
      var new_obj = {}
      new_obj['month'] = O_dates[i]
      new_obj['amount'] = data['ownerRent']
      new_obj['lessDeposit'] = data['lessDeposit']
      new_obj['mant'] = data['mant']
      new_obj['date'] = data['payDate']
      new_obj['OChrg'] = data['OChrg']
      rent_details.findOneAndUpdate(rent_id, {'$push': {'rent': new_obj}},{upsert:true},function(err,doc){
        // console.log('rent',{i},new_obj['month'])
      })
    }

    if (i < S_dates.length){
      var new_obj = {}
      new_obj['month'] = S_dates[i]
      new_obj['date'] = data['payDate']
      new_obj['amount'] = data['subRent']

      rent_details.findOneAndUpdate(rent_id, {'$push': {'subRent': new_obj}}, {upsert:true},function(err,doc){
        // console.log('subRent',{i},new_obj['month'])
      })
    }
    if (i == length -1){
      // console.log({i},length-1)
      if (OL_Date && SL_Date){
        new_values = {"$set": {'curMonth': OL_Date, 'subMonth':SL_Date , 'advance': data['ownerAdv'],
            'subAdv': data['subAdv']}, "$inc": {'deposit': - (data['lessDeposit'] * O_dates.length )}}
      } else if (OL_Date){
          new_values = {"$set": {'curMonth': OL_Date, 'advance': data['ownerAdv']}, "$inc": {'deposit': -(data['lessDeposit'] * O_dates.length)}}
      }else if (SL_Date){
          new_values = {"$set": {'subMonth': SL_Date, 'subAdv': data['subAdv']}}
      }
      // console.log({new_values})
      rent_details.findOneAndUpdate(rent_id, new_values,{upsert:true},function(err,doc){
        res.sendStatus(200)
      })
    }
  }
})

app.get('/api/myAccount/type-banks',function(req,res){
  AccountType.find({ $or: [{ name: 'Bank' }, { name: 'Banks' }]},function(h_err,h_doc){
    if (h_doc.length>0){
      AccountType.find({_lvl2: h_doc[0]['_id']},function(t_err,t_doc){
        if(t_doc){
          res.send(t_doc)
        }
      })
    }
  })
})

app.patch('/api/myAccount/type-banks',function(req,res){
  var data = req.body
  let purpose = {purpose: data.purpose}
  let options = {upsert:true, new:true}
  save_account.findOneAndUpdate(purpose,data,options,function(err,doc){
    if(doc){
      res.send(doc)
    }
  })
})

app.post('/api/myAccount/type-banks',function(req,res){
  var data = req.body
  save_account.findOne(data,function(err,doc){
    if(doc){
      res.send(doc)
    }
  })
  
})

/** End Rent APi owner ship */
// app.set('port', process.env.PORT || 40005);
const PORT = process.env.PORT || 40005;

// app.listen(app.get('port'), function () {
//   console.log('Express server listening on port '  + app.get('port') + '/');
// });

app.listen(PORT, function () {
  console.log('Express server listening on port localhost:' + PORT + '/');
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