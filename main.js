import generateUI from './services/generateUI'
import requestHandler from './services/requestHandler'
import recapReqHandler from './services/recapReqHandler'
import './style.css'

const uri = 'https://api-gc-transaction-management.herokuapp.com/api/transactions'
const recap_uri = 'https://api-gc-transaction-management.herokuapp.com/api/transactions_recap'

// select every element needed to be manipulated by dom from index.html
const select_wrapper = document.getElementById('wrapper')
const wrapper_for_input = document.getElementById('wrapper_for_input')
const wrapper_recap_details = document.getElementById('wrapper_recap_details')
const select_modal_body = document.getElementById('modal_body')
const create_trans_form = document.getElementById('create_transaction_form')
const recap_details_form = document.getElementById('recap_details_form')
const dataTable = document.querySelector('.show__transaction')
const show_recap_transactions = document.getElementById('show_recap_transactions')
const input_trans = document.getElementById('input_trans')

// get all transaction
requestHandler.getAllTransactions(uri, dataTable)

// make new transaction
input_trans.addEventListener('click', () => {
  wrapper_for_input.classList.add('edit__process__bg')
  create_trans_form.classList.add('input__trans__body')
  generateUI.generateCreateTransForm(create_trans_form)

  const submit_btn = document.getElementById('submit')
  submit_btn.addEventListener( 'click', () => {
    let paidStatus = ''
    if (!create_trans_form.gold__deposited.value){
      paidStatus = 'no transaction'
    } else {
      paidStatus = 'process'
    }
    
    const transactionData = {
      accName: create_trans_form.acc__name.value,
      startGold: create_trans_form.start__gold.value,
      finishGold: create_trans_form.finish__gold.value,
      goldDeposited: create_trans_form.gold__deposited.value,
      goldRate: 0,
      paidStatus: paidStatus
    }

    const refresh_loc = 'https://great-class-transmanagement.netlify.app' || 'http://localhost:3000'
    if (parseInt(transactionData.goldDeposited, 10) > parseInt(transactionData.finishGold, 10)) {
      alert('finish gold tidak boleh kurang dari gold deposited')
    } else {
      const request = requestHandler.makeRequest(uri, 'POST', transactionData)
      requestHandler.addNewTransaction(request)
      alert('Berhasil menambahkan data baru')
      window.location.replace(refresh_loc)
    }
  })
})

// get single transaction when click edit action button
dataTable.addEventListener('click', e => {
  const trans_id = e.target.parentElement.getAttribute('data-id')
  const btn = e.target.parentElement
  
  if (btn.classList.contains('edit__btn')) {
    select_wrapper.classList.add('edit__process__bg')
    select_modal_body.classList.add('modal__body')
    
    requestHandler
      .getSingleTransaction(`${uri}/${trans_id}`)
      .then(data => {
        // generate edit form and append it to edit form
        generateUI.generateEditForm(data, select_modal_body)

        function updateTransactions() {
          const transactionData = {
            startGold: select_modal_body.start__gold.value,
            finishGold: select_modal_body.finish__gold.value,
            goldDeposited: select_modal_body.gold__deposited.value,
            goldRate: select_modal_body.gold__rate.value,
            paidStatus: select_modal_body.paid__status.value
          }
      
          if (parseInt(transactionData.goldDeposited, 10) > parseInt(transactionData.finishGold, 10)) {
            alert('finish gold tidak boleh kurang dari gold deposited')
          } else {
            const request = requestHandler.makeRequest(`${uri}/${trans_id}`, 'PUT', transactionData)
            requestHandler.updateSingletransaction(request)
          }
        }

        // update selected data
        const submit_btn = document.getElementById('submit')
        submit_btn.addEventListener('click', () => {
          updateTransactions()
          alert('Berhasil Edit Data')
          window.location.replace('http://localhost:3000')
        })
      })
  }

  // delete single data when clicking delete action button
  if (e.target.parentElement.classList.contains('delete__btn')) {
    const request =  requestHandler.makeRequest(`${uri}/${trans_id}`, 'DELETE', null)
    requestHandler.deleteSingleTransaction(e, request)
  }
})

// search by name
const search_text = document.getElementById('searchByName')
search_text.addEventListener('keyup', () => {
  if (search_text.value !== '') {
    const uri = 'http://localhost:5000/search'
    const term = search_text.value
    
    const load = async () => {
      const make = await fetch(`${uri}?term=${term}`)
      const response = await make.json()
      const data = response.data
      return data
    }

    dataTable.innerHTML = ''
    load().then(item => {
      item.map(data => {
        generateUI.generateSearchedTable(data, dataTable)
      })

      const raw_data = document.querySelectorAll('#table_trans_data')
      const idArray = []

      raw_data.forEach(data => {
        const getData = data.getAttribute('data-id')
        const result = getData.split(',')
        idArray.push({result})
      })
      
      const sva = { sva: [...idArray] }

      const ojbd = { dataRekap: [] }

      sva.sva.forEach(svad => { ojbd.dataRekap.push({...svad.result}) })

      let rekap = []
      if (ojbd.dataRekap.length) {
        const data = ojbd.dataRekap.map( data => {
          data = { 
            startGold: Number(data[0]),
            finishGold: Number(data[1]),
            goldDeposited: Number(data[2]),
            goldRate: Number(data[4]),
            createdAt: data[3] 
          }
          return data
        })
        rekap = data
      }

      document.getElementById('rekapp').addEventListener('click', () => {

        if (rekap.length >= 8) {
          const recapData = {
            accName: search_text.value,
            accServer: null,
            accClass: null,
            dataRekap: rekap,
            playerGain: null,
            companyGain: null
          }
  
          // tambah data ke transactions_recap collection
          const request = requestHandler.makeRequest(recap_uri, 'POST', recapData)
          requestHandler.addNewTransaction(request)

          rekap = []
          search_text.value = ''
        } else {
          console.log('Jumlah transaksi minimum untuk direkap adalah 8x')
        }

      })
    })
  } else if (search_text.value === ''){
    requestHandler.getAllTransactions(uri, dataTable)
  }
})

// for managing recap transactions table

// show all recap transactions
document.getElementById('route_to_recap').onclick = function showRecap() {
  const transactions_container = document.getElementById('transactions_container')
  const recap_container = document.getElementById('recap_container')

  transactions_container.setAttribute('hidden', true)
  recap_container.removeAttribute('hidden', true)

  recapReqHandler.printLoad(show_recap_transactions)
}


// get details recap transactions based on recap id
const recap_details_table = document.getElementById('recap_details_table')
show_recap_transactions.addEventListener('click', e => {
  const details_btn = e.target.parentElement
  const recap_data_id = details_btn.getAttribute('data-id')

  if(details_btn.id === 'details_recap') {
    const getRecapDetails = async () => {
      try {
        const res = await fetch(`${recap_uri}/${recap_data_id}`)
        if (!res.ok) {
          throw Error ('fail to fetch the data')
        }
        const recapData = await res.json()
        return recapData.data
      } catch (err) {
        console.log(err.message)
      }
    }

    getRecapDetails()
      .then(details => {
        const recap_table = wrapper_recap_details.querySelector('table')

        wrapper_recap_details.classList.add('edit__process__bg')
        recap_details_form.classList.add('input__trans__body')
        recap_table.classList.add('input__trans__body')
        recap_table.removeAttribute('hidden')
        
        recap_details_table.innerHTML = ''
        generateUI.generateFormRecapDetails(details, recap_details_form, recap_details_table)
      
        recap_details_form.addEventListener('submit', e => {
          e.preventDefault()

          const recapTransactionsData = {
            accServer: recap_details_form.acc__server.value,
            accClass: recap_details_form.acc__class.value,
            dataRekap: details.dataRekap,
          }

          const request = requestHandler.makeRequest(`${recap_uri}/${recap_data_id}`, 'PUT', recapTransactionsData)
          recapReqHandler.updateRecapData(request)
        })
      })
  }
})

// remove js render form edit data
select_wrapper.addEventListener('click', e => {
  if (e.target.classList.contains('edit__process__bg')) {
    select_wrapper.classList.remove('edit__process__bg')
    select_modal_body.classList.remove('modal__body')
    
    select_modal_body.innerHTML = ''
  }
})

// remove js render form create input transaction
wrapper_for_input.addEventListener('click', e => {
  if (e.target.classList.contains('edit__process__bg')) {
    wrapper_for_input.classList.remove('edit__process__bg')
    create_trans_form.classList.remove('input__trans__body')

    create_trans_form.innerHTML = ''
  }
})

// remove js render form recap details
wrapper_recap_details.addEventListener('click', e => {
  if (e.target.classList.contains('edit__process__bg')) {
    const recap_table = wrapper_recap_details.querySelector('table')

    wrapper_recap_details.classList.remove('edit__process__bg')
    recap_details_form.classList.remove('input__trans__body')
    recap_table.classList.remove('input__trans__body')
    recap_table.setAttribute('hidden', true)

    recap_details_form.innerHTML = ''
  }
})
