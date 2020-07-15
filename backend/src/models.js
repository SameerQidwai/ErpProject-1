var mongoose = require("mongoose");
let Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);
/**New dataBase for erp */

/**Items And category And Unit*/
exports.Items = mongoose.model('Items', // new item collection
  new Schema({
    barcode: Number, name: String, decs: String, qty: Number,
    sPrice: Number, pPrice: Number, code: String, categories: [{ _id: String, category: String, }],
    unit: [{ qty: Number, unit: String }]
  }),
  'Items');

exports.Categories = mongoose.model('Categories',
  new Schema({ parentId: String, category: String }),
  'Categories');

exports.Units = mongoose.model('Units',
  new Schema({ name: String, acronym: String }),
  'Units');

/**Items And category an Unit*/

/**Supplier And Orders */
exports.Supplier = mongoose.model('Supplier',
  new Schema({ name: String, email: String, phone: String, address: String, about: String }),
  'Supplier');

exports.order = mongoose.model('order',
  new Schema({
    supplierId: {type: Schema.Types.ObjectId, ref: "Supplier"}, 
    supplierName: String, 
    items: [{ itemId: {type: Schema.Types.ObjectId, ref: "Items"}, itemQty: Number, itemCost: Number, 
      itemUnit: { unit: String, qty: Number } ,delivered:Boolean}],
    orderDate: Date, 
    requestDate: Date, 
    reqActDate: Date,
    paymentDate:Date,
    appDate:Date,
    deliveryDate:Date,
    orderAppDate: Date,
    dueDate: Date, 
    orderNo: String, 
    requestNo: String, 
    advance: {type: Number, default:0},
    Tax:{type: Number, default:0},
    stage:String
  }),
  'order');
/**Supplier and order */
/**Employess and payroll */
exports.employees = mongoose.model('employees', //salesman name need some work n it
  new Schema({
    name: String, fName: String, address: String, phone: String,
    att: { type: Boolean, default: false }, payroll: Number,
  }),
  'employees');

exports.eAttandence = mongoose.model('eAttandence',  //attendance change
  new Schema({
    eId: { type: Schema.Types.ObjectId, ref: "employees" }, att: [{ date: Date, status: { type: Boolean, default: true } }]
  }),
  'eAttandence');

exports.eLeaves = mongoose.model('eLeaves',
  new Schema({
    eId: String, name: String, dateFrom: String, dateTill: String, reason: String,
  }),
  'eLeaves');

exports.eLoans = mongoose.model('eLoans',
  new Schema({
    eId: String, name: String, idate: String, rdate: String, loan: Number, status: Boolean, lReason: String,
  }),
  'eLoans');

exports.Payroll = mongoose.model('Payroll',
  new Schema({
    eId: String, salary: [{ date: String, bouns: Number, }], advance: { type: Number, default: 0 }, lastMonth: Number,
  }),
  'Payroll');
/**Employess and payroll */
/**customer and sales */
exports.customer = mongoose.model('customer',
  new Schema({ name: String, email: String, phone: String, address: String, }),

  'customer');

exports.customerHistory = mongoose.model('customerHistory',
  new Schema({ name: String, email: String, phone: String, address: String }),
  'customerHistory');


exports.customerCart = mongoose.model('customerCart',
  new Schema({
    customerId: {type: Schema.Types.ObjectId, ref: "customer"}, 
    customerName: String, 
    debit: { type: Number, default: 0 }, 
    discount: { type: Number, default: 0 }, 
    date: Date, 
    items: [{
      itemId: {type: Schema.Types.ObjectId, ref: "Items"}, 
      sQty: Number, 
      sSale: Number, 
      sUnit: { 
        unit: String, 
        qty: Number 
      },
      index: Number
    }]
  }),
  'customerCart');

exports.paidCarts = mongoose.model('paidCarts',
  new Schema({
    customerId: {type: Schema.Types.ObjectId, ref: "customer"}, 
    customerName: String, 
    debit: { type: Number, default: 0 }, 
    discount: { type: Number, default: 0 }, 
    date: Date, time: String, items: [{
      itemId: {type: Schema.Types.ObjectId, ref: "Items"}, 
      sQty: Number, 
      sSale: Number, 
      sUnit: { 
        unit: String, 
        qty: Number 
      },
      index: Number
    }]
  }),
  'paidCarts');
/**customer and sales */
/**Accounts */
exports.Book = mongoose.model('Book',
  new Schema({
    datetime: Date, book: String, type: String, head: String,
    reason: String,
    _transactions: [{
      type: Schema.Types.ObjectId,
      ref: "transactions"
    }
    ],
  }),
  'Book')

exports.Transaction = mongoose.model('Transaction',
  new Schema({

    credit: Number, debit: Number,
    timestamp: { type: Date, default: Date.now },
    type: String,
    /**refs to tsansaction */
    _ref: { type: Schema.Types.ObjectId, ref: "ref" },
    /**extra item use for like extra ref key */
    _meta: { type: Schema.Types.Mixed },
    /**Accounts ids*/
    _accType: { type: Schema.Types.ObjectId, ref: "type" },

    _head: { type: Schema.Types.ObjectId, ref: "head" },
    _lvl1: { type: Schema.Types.ObjectId, ref: "lvl1" },
    _lvl2: { type: Schema.Types.ObjectId, ref: "lvl2" },
    /**Account Ids */
    reason: String,
    _journal: {
      type: Schema.Types.ObjectId,
      ref: "Journal"
    },
  }),
  'Transaction');

exports.AccountHead = mongoose.model('AccountHead',
  new Schema({
    name: String, code: String
  }),
  'AccountHead');

exports.AccountType = mongoose.model('AccountType',
  new Schema({
    name: String, code: String,
    _head: { type: Schema.Types.ObjectId, ref: "head" },
    _lvl1: { type: Schema.Types.ObjectId, ref: "lvl1" },
    _lvl2: { type: Schema.Types.ObjectId, ref: "lvl2" },
    _lvl3: { type: Schema.Types.ObjectId, ref: "lvl3" },  /* Just incase if we need further more categories we can use that and add these more */
  }),
  'AccountType');

exports.voucher = mongoose.model('voucher',
  new Schema({
    _accType: { type: Schema.Types.ObjectId, ref: "type" },
    voucher: Number,
    credit: Number,
    debit: Number,
    date: Date,
    recBy: String,
    paidAcct: {
      _id: { type: Schema.Types.ObjectId },
      name: String,
      _head: { type: Schema.Types.ObjectId },
      _lvl1: { type: Schema.Types.ObjectId },
      _lvl2: { type: Schema.Types.ObjectId }
    },
    recAcct: {
      _id: { type: Schema.Types.ObjectId },
      name: String,
      _head: { type: Schema.Types.ObjectId },
      _lvl1: { type: Schema.Types.ObjectId },
      _lvl2: { type: Schema.Types.ObjectId }
    },
  }),
  'voucher');

  /** Start Property model */
  exports.ownerShip = mongoose.model('ownerShip',
  new Schema({
    bldgId:{ type: Schema.Types.ObjectId, ref: "property_details" },
    ownerId:[{ type: Schema.Types.ObjectId, ref: "tennat_details" }],
    purchaseAmount: Number,
    ownerRent:Number,
    signDate: Date,
    lastDate: Date,
    agreement: String,
    paidAmount:Number,
    process:String,
    paymnets: {
      date: Date,
      amount: Number
    }
  }),
  'ownerShip');

exports.propertyHistory = mongoose.model('propertyHistory',//Proper histroy sublet push
  new Schema({
    bldgId:{ type: Schema.Types.ObjectId, ref: "property_details" },

    ownership: [{
      ownerId:[{ type: Schema.Types.ObjectId, ref: "tennat_details" }],
      purchaseAmount: Number,
      tenantRent:Number,
      signDate: Date,
      endDate:Date,
    }],

    sublet: [{
      subletName : String,
      subletPhone: String,
      subletNIC: String,
      acceptedRent: Number,
      leaseStartDate: Date,
      leaseEndDate: Date,
    }]
  }),
  'propertyHistory');

exports.transfer_details = mongoose.model('transfer_details',
  new Schema({
    bldgId: { type: Schema.Types.ObjectId, ref: "property_details" },
    // tenantId: { type: Schema.Types.ObjectId, ref: "tennat_details" },
    leaseStartDate: Date,
    subletName : String,
    subletPhone: String,
    subletNIC: String,
    acceptedRent: Number,
  }),
  'transfer_details');
  
exports.property_details = mongoose.model('property_details',
  new Schema({
    available: Boolean,
    forsale:Boolean,
    owner: String,
    address: String,
    type: String,
    bedroom: Number,
    bathroom: Number,
    sqft: Number,
    rent: Number,
    detail: String,
    mant: Number
  }),
'property_details');

exports.tenant_details = mongoose.model('tenant_details',
  new Schema({
    tenantName : String,
    tenantPhone: String,
    tenantNIC: String,
    tenantAddress: String,
    familyMember: Number,
    tenantDetail: String,
    tenantEmail: String
  }),
'tenant_details');

exports.rent_details  = mongoose.model('rent_details',
  new Schema({
      tenantId: String,
      bldgId: { type: Schema.Types.ObjectId, ref: "property_details" },
      transferId: { type: Schema.Types.ObjectId, ref: "transfer_details" },
      ownerId: { type: Schema.Types.ObjectId, ref: "ownerShip" },
      deposit: {type:Number, default:0}, 
      subAdv: {type:Number, default:0},
      ownerAdv: {type:Number, default:0},
      subMonth: Date,
      curMonth: Date,
      rent: [{month:String,amount:Number,lessDeposit:Number,mant:Number,OChrg:Number,id:String,date: Date,}],
      subRent: [{month:String,amount:Number,id:String,date: Date,}]
  }),
'rent_details');
exports.property_types  = mongoose.model('property_types',
  new Schema({
      type:String,
      amount: {type:Number, default: 0},
  }),
'property_types');
exports.save_Account  = mongoose.model('save_Account',
  new Schema({
      acc_name:String,
      purpose:String,
  }),
'save_Account');


  /** End Property model */
/* exports.AccountType = mongoose.model('AccountType',
new Schema( {
  name:  String, code: Number, range:{ min: Number, max: Number, },
  _head1: { type: Schema.Types.ObjectId, ref: "head" },
}),
'AccountType'); */

/**New dataBase end for ERp */
/*
* You may think you know what the following code does.
* But you don't. Tsameer us her efor usrust me.
* Fiddle with it, and you'll spend many a sleepless
* night cursing the moment you thought you'd be clever
* enough to "optimize" the code below.
* Now close this file and go play with something else.
*/


