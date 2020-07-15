const SCHOLARSHIP_FORM = [
  { label: 'Applicant First Name', field: 'fname' },
  { label: 'Applicant Last Name', field: 'lname' },
  { label: 'Applicant Sur Name', field: 'surname' },
  { label: 'Address', field: 'address' },
  { label: 'Email', field: 'email' },
  { label: 'ITS No', field: 'its' },
  { label: 'HOF ITS', field: 'hof' },
  { label: 'CNIC No', field: 'cnic' },
  { label: 'SF No', field: 'sf' },
  { label: 'Last Qualification', field: 'lastQual' },
  {
    label: 'Last Qualification Grade',
    field: 'lastQualGrade'
  },
  {
    label: 'Total Family Members',
    field: 'totalMemb'
  },
  {
    label: 'Working Members in family - Count',
    field: 'totalWork'
  },
  { label: 'Monthly Earning', field: 'totalEarn' },
  {
    label: 'Total Scholarship Amount',
    field: 'schAmt'
  },
  {
    label: 'Total Scholarship Months',
    field: 'schMnth'
  },
  {
    label: 'Monthly Installment Amount',
    field: 'mnthAmnt'
  }
]

const SCHOLARSHIP_HEADERS = [
  { sortable: false, value: 'id' },
  { sortable: false, text: 'First Name', value: 'fname' },
  { sortable: false, text: 'Last Name', value: 'lname' },
  { sortable: false, text: 'ITS', value: 'its' },
  { sortable: false, text: 'CNIC', value: 'cnic' },
  { sortable: false, text: 'Action', align: 'right' }
]

const amakin_FORM = [
  { label: 'Applicant First Name', field: 'fname' },
  { label: 'Applicant Last Name', field: 'lname' },
  { label: 'Applicant Sur Name', field: 'surname' },
  { label: 'Address', field: 'address' },
  { label: 'Email', field: 'email' },
  { label: 'ITS No', field: 'its' },
  { label: 'HOF ITS', field: 'hof' },
  { label: 'CNIC No', field: 'cnic' },
  { label: 'SF No', field: 'sf' }
]

const amakin_HEADERS = [
  { sortable: false, value: 'id' },
  { sortable: false, text: 'First Name', value: 'fname' },
  { sortable: false, text: 'Last Name', value: 'lname' },
  { sortable: false, text: 'ITS', value: 'its' },
  { sortable: false, text: 'CNIC', value: 'cnic' },
  { sortable: false, text: 'Action', align: 'right' }
]

const typeheaders = [
  // ITem table th
  { sortable: false, text: 'ID', value: 'id', align: 'center' },
  {
    sortable: false,
    text: 'Account Type',
    value: 'accountType',
    align: 'center'
  },
  {
    sortable: false,
    text: 'Account Head',
    value: 'accountHead',
    align: 'center'
  },
  { sortable: false, text: 'Actions', value: 'actions', align: 'right' }
]

const coaheaders = [
  { sortable: false, text: 'COA Code', value: 'code', align: 'center' },
  {
    sortable: false,
    text: 'COA Name',
    value: 'coaName',
    align: 'center'
  },
  {
    sortable: false,
    text: 'Account Head',
    value: 'accHead',
    align: 'center'
  },
  {
    sortable: false,
    text: 'Account Type',
    value: 'accType',
    align: 'center'
  },
  { sortable: false, text: 'Actions', value: 'actions', align: 'right' }
]

const accType_array = [
  {
    type: 'Sales Parties',
    head: 'Assets'
  },
  {
    type: 'Cash & Bank Account',
    head: 'Assets'
  },
  {
    type: 'Purchases',
    head: 'Revenue'
  },
  {
    type: 'Sales',
    head: 'Revenue'
  },
  {
    type: 'Purchase Parties',
    head: 'Liability'
  },
  {
    type: 'Daily Expense',
    head: 'Expense'
  },
  {
    type: 'Captial Account',
    head: 'Capital'
  },
  {
    type: 'Partner Capital',
    head: 'Capital'
  },
  {
    type: 'Fixed Assets',
    head: 'Liability'
  }
]

const coa_array = [
  {
    coa_code: '01',
    acc_name: 'Capital',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '01-01',
    acc_name: 'Capital Account',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '01-02',
    acc_name: 'Partner Capital',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '02',
    acc_name: 'Liability',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '02-01',
    acc_name: 'Purchase Parties',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '03',
    acc_name: 'Assets',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '03-01',
    acc_name: 'Sales Parties',
    acc_head: '',
    acc_type: ''
  },
  {
    coa_code: '03-02',
    acc_name: 'Cash & Bank Account',
    acc_head: 'Assets	',
    acc_type: ''
  },
  {
    coa_code: '03-02-0001',
    acc_name: 'Cash in hand',
    acc_head: 'Assets',
    acc_type: 'Cash & Bank Account'
  }
]

const accHeads = [
  { id: 1, name: 'Capital', ah_code: '01' },
  { id: 2, name: 'Liability', ah_code: '02' },
  { id: 3, name: 'Assets', ah_code: '03' },
  { id: 4, name: 'Revenue', ah_code: '04' },
  { id: 5, name: 'Expense', ah_code: '05' }
]

const accTypes = [
  'Sales Parties',
  'Cash & Bank Account',
  'Purchases',
  'Sales',
  'Purchase Parties',
  'Daily Expense',
  'Captial Account',
  'Partner Capital',
  'Fixed Assets'
]

const POS_HEADERS = [
  { sortable: false, text: 'Name', value: 'name', align: 'center' },
  { sortable: false, text: 'Description', value: 'decs' },
  { sortable: false, text: 'Quantity', value: 'quantity', align: 'center', width: '13%' },
  { sortable: false, text: 'Unit', value: 'Unit', align: 'center', width: '12%' },
  { sortable: false, text: 'Price/Unit', value: 'price', align: 'center', width: '12%' },
  { sortable: false, text: '....', value: 'action', align: 'right' }
]

const POS_SALES_HEADERS = [
  { sortable: false, text: 'Name', value: 'name', align: 'left' },
  { sortable: false, text: 'Description', value: 'decs' },
  { sortable: false, text: 'Qty', value: 'quantity', align: 'left', width: '13%' },
  { sortable: false, text: 'Unit', value: 'Unit', align: 'left', width: '12%' },
  { sortable: false, text: 'Price', value: 'Price', align: 'left', width: '12%' },
  { sortable: false, text: 'Total', value: 'subTotal', align: 'left' },
  { sortable: false, text: '....', value: 'action', align: 'center' }
]

const LOANS_ITEM_HEADERS = [
  { sortable: false, text: 'ID', value: 'id' },
  { sortable: false, text: 'Name', value: 'name' },
  { sortable: false, text: 'Issue Date', value: 'idate' },
  { sortable: false, text: 'Return Date', value: 'rdate' },
  { sortable: false, text: 'Loan', value: 'loan' },
  { sortable: false, text: 'Late', value: 'late' },
  { sortable: false, text: 'Paid/Unpdaid', value: 'Actions' },
  { sortable: false, text: 'Account', width: '15%' }
]

const LOAN_GET_EMP = [
  {
    _id: '5e7b065b0584e92e5c355133',
    name: 'nida',
    fName: 'khan',
    address: 'navi',
    phone: '00000',
    att: true
  },
  {
    _id: '5e7b06be0584e92e5c355134',
    name: 'murtaza',
    fName: 'farhan',
    address: 'dehli',
    phone: '+913828',
    att: false
  },
  {
    _id: '5e7b06eb0584e92e5c355135',
    name: 'Shabir Ahmed',
    fName: 'Murtaza',
    address: 'Not remeber',
    phone: '88888',
    att: false
  }
]

const LOAN_GET_LOAN = [
  {
    name: 'sameer',
    idate: '2/10/2019',
    rdate: '3/1/2020',
    loan: 5000000,
    late: '-',
    status: true
  },
  {
    name: 'hassan',
    idate: '1/1/2020',
    rdate: '3/1/2020',
    loan: 8000,
    late: '-',
    status: false
  }
]
const APPROVE_HEADER = [
  { sortable: false, text: 'Address', value: 'name' },
  { sortable: false, text: 'Type', value: 'type' },
  { sortable: false, text: 'Owner Ship', value: 'name' },
  { sortable: false, text: 'Month Rent', value: 'idate' },
  { sortable: false, text: 'Purchase Amount', value: 'rdate' },
  { sortable: false, text: 'Last Date', value: 'loan' },
  { sortable: false, text: 'Action', value: 'Actions' }
]
const PAYMENT_HEADER = [
  { sortable: false, text: 'Address', value: 'name' },
  { sortable: false, text: 'Type', value: 'type' },
  { sortable: false, text: 'Owner Ship', value: 'name' },
  { sortable: false, text: 'Month Rent', value: 'idate' },
  { sortable: false, text: 'Purchase Amount', value: 'rdate' },
  { sortable: false, text: 'Paid Amount', value: 'rdate' },
  { sortable: false, text: 'Last Date', value: 'loan' },
  { sortable: false, text: 'Action', value: 'Actions' }
]

const MONTHS_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const SECLECT_METHODS = [
  { id: 0, name: 'Auto' },
  { id: 1, name: '1 Month' },
  { id: 2, name: '2 Month' },
  { id: 3, name: '3 Month' },
  { id: 4, name: '4 Month' },
  { id: 5, name: '5 Month' },
  { id: 6, name: '6 Month' },
  { id: 7, name: '7 Month' },
  { id: 8, name: '8 Month' },
  { id: 9, name: '9 Month' },
  { id: 10, name: '10 Month' },
  { id: 11, name: '11 Month' },
  { id: 12, name: '12 Month' }
]

const NUM_WORD = [
  '',
  'one ',
  'two ',
  'three ',
  'four ',
  'five ',
  'six ',
  'seven ',
  'eight ',
  'nine ',
  'ten ',
  'eleven ',
  'twelve ',
  'thirteen ',
  'fourteen ',
  'fifteen ',
  'sixteen ',
  'seventeen ',
  'eighteen ',
  'nineteen '
]
const TENTH_WORD = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety'
]

const RENT_HEADER = [
  { sortable: false, text: 'Tenant Name'},
  { sortable: false, text: 'Sublet Name', value: 'subletName' },
  { sortable: false, text: 'Address', value: 'address' },
  { sortable: false, text: 'Tenant Rent', value: 'ownerRent' },
  { sortable: false, text: 'Sublet Rent', value: 'acceptedRent' },
  { sortable: false, text: 'Pay', align: 'right' },
  { sortable: false, text: 'Tenant Rent', align: 'center' },
  { sortable: false, text: 'Sublet Rent', align: 'center' }
]

const RENT_HISTORY = [
  { sortable: false, text: 'Month' },
  { sortable: false, text: 'Paid Date', value: 'pDate' },
  { sortable: false, text: 'Rent', value: 'amount' },
  { sortable: false, text: 'Mantainance', value: 'amount' },
  { sortable: false, text: 'Others', value: 'amount' },
  { sortable: false, text: 'Deposit', value: 'amount' },
  { sortable: false, text: 'Total', value: 'amount' }
]
const SUB_RENT_HISTORY = [
  { sortable: false, text: 'Month' },
  { sortable: false, text: 'Paid Date', value: 'pDate' },
  { sortable: false, text: 'Rent', value: 'amount' }
]


const NODE_DOMAIN = 'http://localhost:40005'
// const NODE_DOMAIN = 'https://five-cube-erp-backend.herokuapp.com'

const PYTHON_DOMAIN = 'http://localhost:5000/api/v1/'
// const PYTHON_DOMAIN = 'https://erp-backend.herokuapp.com/api/v1/'

export default {
  SCHOLARSHIP_FORM: SCHOLARSHIP_FORM,
  SCHOLARSHIP_HEADERS: SCHOLARSHIP_HEADERS,
  amakin_FORM: amakin_FORM,
  amakin_HEADERS: amakin_HEADERS,
  accTypes: accTypes,
  accHeads: accHeads,
  coa_array: coa_array,
  accType_array: accType_array,
  coaheaders: coaheaders,
  typeheaders: typeheaders,
  POS_HEADERS: POS_HEADERS,
  POS_SALES_HEADERS: POS_SALES_HEADERS,
  LOANS_ITEM_HEADERS: LOANS_ITEM_HEADERS,
  LOAN_GET_EMP: LOAN_GET_EMP,
  LOAN_GET_LOAN: LOAN_GET_LOAN,
  NODE_DOMAIN: NODE_DOMAIN,
  PYTHON_DOMAIN: PYTHON_DOMAIN,
  APPROVE_HEADER: APPROVE_HEADER,
  PAYMENT_HEADER: PAYMENT_HEADER,
  MONTHS_NAMES: MONTHS_NAMES,
  SECLECT_METHODS: SECLECT_METHODS,
  NUM_WORD: NUM_WORD,
  TENTH_WORD: TENTH_WORD,
  RENT_HEADER: RENT_HEADER,
  RENT_HISTORY: RENT_HISTORY,
  SUB_RENT_HISTORY: SUB_RENT_HISTORY,
}
