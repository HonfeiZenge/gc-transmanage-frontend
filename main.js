import generateUI from './services/generateUI'
import RequestHandler from './services/RequestHandler'
import './style.css'

const uri = 'http://localhost:5000/api/transactions'

const select_wrapper = document.getElementById('wrapper')
const wrapper_for_input = document.getElementById('wrapper_for_input')
const select_modal_body = document.getElementById('modal_body')
const create_trans_form = document.getElementById('create_transaction_form')
const dataTable = document.querySelector('.show__transaction')
const input_trans = document.getElementById('input_trans')

// get all transaction
RequestHandler.getAllTransactions(uri, dataTable)

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
      const request = RequestHandler.makeRequest(uri, 'POST', transactionData)
      RequestHandler.addNewTransaction(request)
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
    
    RequestHandler
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
            const request = RequestHandler.makeRequest(`${uri}/${trans_id}`, 'PUT', transactionData)
            RequestHandler.updateSingletransaction(request)
          }
        })
      })
  }

  // delete single data when clicking delete action button
  if (e.target.parentElement.classList.contains('delete__btn')) {
    const request =  RequestHandler.makeRequest(`${uri}/${trans_id}`, 'DELETE', null)
    RequestHandler.deleteSingleTransaction(e, request)
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
          <tr>
            <td class="transaction__table__data">${data.accName}</td>
            <td class="transaction__table__data">${data.accServer}</td>
            <td class="transaction__table__data">${data.startGold}</td>
            <td class="transaction__table__data">${data.finishGold}</td>
            <td class="transaction__table__data">${data.goldDeposited}</td>
            <td class="transaction__table__data">${data.updatedAt}</td>
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
    })
  } else if (search_text.value == ''){
    RequestHandler.getAllTransactions(uri, dataTable)
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
