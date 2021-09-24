import generateUI from './generateUI'

// make a template for making new request
const makeRequest = (uri, method, objectData) => {
  const headers = new Headers({ 'Content-type': 'application/json; charset=UTF-8' })
  const request = new Request(uri, {
    method: method,
    headers: headers,
    body: JSON.stringify(objectData)
  })

  return request
}

// sorting by today date function
const sortingTransactionByToday = (transData) => {
  const td = transData;
  const today = new Date();
  const filterResult = td.filter(filteredTd => {
    const now = today.toString().slice(8, 15)
    const convertInsertedAt = new Date(filteredTd.insertedAt)
    const convertedInsertedAt = convertInsertedAt.toString()
    // const convertedInsertedAt = convertInsertedAt.toString().slice(8, 15)
    return convertedInsertedAt.includes(now)
    // return convertedInsertedAt > now
  })
  
  return filterResult;
}

// make get all transaction from server endpoint
const getAllTransactions =  async (uri, dataTable) => {
  try {
    const response = await fetch(uri)
    if (!response.ok) {
      throw Error('No Data Available')
      // window.location.replace('404.html')
    }
    const data = await response.json()
    const transactionData = data.data
    
    let i = 1
    dataTable.innerHTML = ''
    sortingTransactionByToday(transactionData).forEach(transaction => {
      generateUI.generateAllTransactionsTable(i++, transaction, dataTable)
    })
  } catch (err) {
    return console.log(err.message)
  }
}

// make get single transacion based on id from server endpoint
const getSingleTransaction = async (uri) => {
  try {
    const response = await fetch(uri)
    if (!response.ok) {
      throw Error('No Data Available')
    }
    const transactionData = await response.json()
    const data = await transactionData.data

    return data
  } catch (err) {
    return console.log(err.message)
  }
}

// make a request to add new data
const addNewTransaction = async (request) => {
  const refresh_loc = 'https://great-class-transmanagement.netlify.app' || 'http://localhost:3000'
  try {
    const response = await fetch(request)
    if (!response.ok) {
      throw Error('Failed to add transaction')
    }
    // alert('Berhasil menambahkan data baru')
    window.location.replace(refresh_loc)
  } catch (err) {
    console.log(err.message)
  }
}

// make a request to update data inside server
const updateSingletransaction = async (request) => {
  const refresh_loc = 'https://great-class-transmanagement.netlify.app' || 'http://localhost:3000'
  try {
    const response = await fetch(request)
    const transaction = await response.json()

    if (transaction.status == 'success') {
      // alert('Berhasil Edit Data')
      window.location.replace(refresh_loc)
    } else {
      alert(`${transaction.status} Gagal Edit Data`)
    }
  } catch (err) {
    return console.log(err.message)
  }
}

// feching to delete transaction in server
const deleteSingleTransaction = async (e, request) => {
  try {
    const response = await fetch(request)
    const transaction = await response.json()

    if (transaction.status == 'success') {
      alert('Berhasil Hapus Data')
      e.target.parentElement.parentElement.remove()
    } else {
      alert(`${transaction.status} Gagal Hapus Data`)
    }
  } catch (err) {
    return console.log(err.message)
  }
}

export default {
  makeRequest,
  getAllTransactions,
  getSingleTransaction,
  updateSingletransaction,
  deleteSingleTransaction,
  addNewTransaction
}
