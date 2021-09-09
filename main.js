import generateUI from './services/generateUI'
import requestHandler from './services/requestHandler'
import recapReqHandler from './services/recapReqHandler'
import './style.css'

const uri = 'http://localhost:5000/api/transactions'

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

  create_trans_form.addEventListener('submit', e => {
    e.preventDefault()
    
    const transactionData = {
      accName: create_trans_form.acc__name.value,
      accServer: create_trans_form.acc__server.value,
      startGold: create_trans_form.start__gold.value,
      finishGold: create_trans_form.finish__gold.value,
      goldDeposited: create_trans_form.gold__deposited.value,
    }

    if (parseInt(transactionData.goldDeposited, 10) > parseInt(transactionData.finishGold, 10)) {
      alert('finish gold tidak boleh kurang dari gold deposited')
    } else {
      const request = requestHandler.makeRequest(uri, 'POST', transactionData)
      requestHandler.addNewTransaction(request)
    }
  })
})

// get single transaction when click edit action button
dataTable.addEventListener('click', e => {
  const trans_id = e.target.parentElement.id
  const btn = e.target.parentElement
  
  if (btn.classList.contains('edit__btn')) {
    select_wrapper.classList.add('edit__process__bg')
    select_modal_body.classList.add('modal__body')
    
    requestHandler
      .getSingleTransaction(`${uri}/${trans_id}`)
      .then(data => {
        // generate edit form and append it to edit form
        generateUI.generateEditForm(data, select_modal_body)
        // update selected data
        select_modal_body.addEventListener('submit', e => {
          e.preventDefault()

          const transactionData = {
            startGold: select_modal_body.start__gold.value,
            finishGold: select_modal_body.finish__gold.value,
            goldDeposited: select_modal_body.gold__deposited.value,
          }

          if (parseInt(transactionData.goldDeposited, 10) > parseInt(transactionData.finishGold, 10)) {
            alert('finish gold tidak boleh kurang dari gold deposited')
          } else {
            const request = requestHandler.makeRequest(`${uri}/${trans_id}`, 'PUT', transactionData)
            requestHandler.updateSingletransaction(request)
          }
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
        let html = `
          <tr id="table_trans_data" data-id="${data.startGold},${data.finishGold},${data.goldDeposited},${data.insertedAt}">
            <td class="transaction__table__data">${data.accName}</td>
            <td class="transaction__table__data">${data.accServer}</td>
            <td class="transaction__table__data">${data.startGold}</td>
            <td class="transaction__table__data">${data.finishGold}</td>
            <td class="transaction__table__data">${data.goldDeposited}</td>
            <td class="transaction__table__data">${data.insertedAt}</td>
            <td class="transaction__table__data p-2 edit__btn" id="${data._id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 p-2 rounded-lg shadow-md bg-green-500 text-md text-white font-bold focus:outline-none hover:bg-green-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </td>
            <td class="transaction__table__data p-2 delete__btn" id="${data._id}">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 p-2 rounded-lg shadow-md bg-red-500 text-md text-white font-bold focus:outline-none hover:bg-red-700 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </td>
          </tr>
        `
        dataTable.innerHTML += html
      })

      const raw_data = document.querySelectorAll('#table_trans_data')
      const idArray = []

      raw_data.forEach(data => {
        const getData = data.getAttribute('data-id')
        const result = getData.split(',')
        idArray.push({result})
      })
      
      const sva = {
        sva: [...idArray]
      }

      const ojbd = {
        dataRekap: [],
        rate: null
      }

      sva.sva.forEach(svad => {
        svad.result.push(ojbd.rate)
        ojbd.dataRekap.push({...svad.result})
      })

      let rekap = []
      if (ojbd.dataRekap.length) {
        const data = ojbd.dataRekap.map( data => {
          data = { 
            startGold: Number(data[0]),
            finishGold: Number(data[1]),
            goldDeposited: Number(data[2]),
            goldRate: data[4],
            createdAt: data[3] 
          }
          return data
        })
        rekap = data
      }

      document.getElementById('rekapp').addEventListener('click', () => {

        if (rekap.length >= 12) {
          const recapData = {
            accName: search_text.value,
            accServer: null,
            accClass: null,
            dataRekap: rekap,
            playerGain: null,
            companyGain: null
          }
          console.log(recapData)
  
          const request = requestHandler.makeRequest('http://localhost:5000/api/transactions_recap', 'POST', recapData)
          const addData = async () => {
            try {
              const res = await fetch(request)
              if(!res.ok) {
                throw new Error ('Gagal menambah data rekap')
              }
              alert('Berhasil menambah data rekap')
            } catch (err) {
              console.log(err.message)
            }
          }
          addData()

          rekap = []
          search_text.value = ''
        } else {
          console.log('Jumlah transaksi minimum untuk direkap adalah 12x')
        }

      })

    })
  } else if (search_text.value === ''){
    requestHandler.getAllTransactions(uri, dataTable)
  }
})

// for managing recap transactions table
document.getElementById('route_to_recap').onclick = function showRecap() {
  const transactions_container = document.getElementById('transactions_container')
  const recap_container = document.getElementById('recap_container')

  transactions_container.setAttribute('hidden', true)
  recap_container.removeAttribute('hidden', true)

  recapReqHandler.printLoad(show_recap_transactions)
}

show_recap_transactions.addEventListener('click', e => {
  const details_btn = e.target.parentElement
  const recap_data_id = details_btn.getAttribute('data-id')

  if(details_btn.id === 'details_recap') {
    const getRecapDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/transactions_recap/${recap_data_id}`)
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
        wrapper_recap_details.classList.add('edit__process__bg')
        recap_details_form.classList.add('input__trans__body')
        
        let html = `
        <div class="py-2">
          <label for="acc__name">Nama Player</label>
          <input type="text" name="acc__name" id="acc__name" class="text__form" value="${details.accName}" required>
        </div>
        <div class="py-2">
          <label for="acc__server">Server Player</label>
          <input type="text" name="acc_server" id="acc__server" class="text__form" value="${details.accServer}" required>
        </div> 
        <div class="py-2">
          <label for="acc__class">Player Class</label>
          <input type="text" name="acc__class" id="acc__class" class="text__form" value="${details.accClass}" required>
        </div>
        <div class="py-2">
        `
        recap_details_form.innerHTML = html

        details.dataRekap.forEach(data => {
          let table = `
          <table class="table w-full border border-gray-600 bg-white">
            <thead class="bg-gray-400">
              <tr class="border-b-2 border-gray-600">
                <th class="transaction__table__head">Start Gold</th>
                <th class="transaction__table__head">Finish Gold</th>
                <th class="transaction__table__head">Pick up</th>
                <th class="transaction__table__head">Gold Rate</th>
                <th class="transaction__table__head">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border border-gray-600">
                <td class="transaction__table__data">${data.startGold}</td>
                <td class="transaction__table__data">${data.finishGold}</td>
                <td class="transaction__table__data">${data.goldDeposited}</td>
                <td class="transaction__table__data">${data.goldRate}</td>
                <td class="transaction__table__data">${data.createdAt.toString().slice(0, 7)}</td>
              </tr>
              </tbody>
          </table>
          `
          recap_details_form.innerHTML += table
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
    wrapper_recap_details.classList.remove('edit__process__bg')
    recap_details_form.classList.remove('input__trans__body')

    recap_details_form.innerHTML = ''
  }
})
