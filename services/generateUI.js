// generate all transactions table
const generateAllTransactionsTable = (i, data, dataTable) => {
  const time = new Date(data.updatedAt);
  const html = `
  <tr class="border border-gray-600">
    <td class="transaction__table__data">${i}</td>
    <td class="transaction__table__data">${data.accName}</td>
    <td class="transaction__table__data">${data.accServer}</td>
    <td class="transaction__table__data">${data.startGold}</td>
    <td class="transaction__table__data">${data.finishGold}</td>
    <td class="transaction__table__data">${data.goldDeposited}</td>
    <td class="transaction__table__data">${time.toString().substr(7, 18)}</td>
    <td data-id="${data._id}" class="transaction__table__data edit__btn py-2">
      <span class="material-icons p-2 rounded-lg shadow-md bg-green-500 text-md text-white focus:outline-none hover:bg-green-700 cursor-pointer">mode_edit_outline</span>
    </td>
    <td data-id="${data._id}" class="transaction__table__data delete__btn py-2">
      <span class="material-icons p-2 rounded-lg shadow-md bg-red-500 text-md text-white focus:outline-none hover:bg-red-700 cursor-pointer">delete</span>
    </td>
  </tr>
  `
  dataTable.innerHTML += html
}

// generate create transaction form
const generateCreateTransForm = (create_trans) => {
  let html = `
    <div class="py-2">
      <label for="acc__name">Nama Player</label>
      <input type="text" name="acc__name" id="acc__name" class="text__form" required>
    </div>
    <div class="py-2">
      <label for="acc__server">Nama Server Player</label>
      <input type="text" name="acc_server" id="acc__server" class="text__form" required>
    </div> 
    <div class="py-2">
      <label for="start__gold">Starting Gold</label>
      <input type="number" name="start__gold" id="start__gold" class="text__form" required>
    </div>
    <div class="py-2">
      <label for="finish__gold">Finish Gold</label>
      <input type="number" name="finish__gold" id="finish__gold" class="text__form" required>
    </div>
    <div class="py-2">
      <label for="gold__deposited">Jumlah Gold di pick-up</label>
      <input type="number" name="gold__deposited" id="gold__deposited" class="text__form" required>
    </div>
    <div class="py-2">
      <input type="submit" value="Simpan" class="my-2 p-3 rounded-lg shadow-md bg-red-500 cursor-pointer text-md text-white font-bold">
    </div>
  `
  create_trans.innerHTML += html
}

// generate edit form
const generateEditForm = (data, select_modal_body) => {
  let html = `
  <div class="py-2">
    <label for="start__gold">Starting Gold</label>
    <input type="number" name="start__gold" id="start__gold" class="text__form" value="${data.startGold}" required>
  </div>
  <div class="py-2">
    <label for="finish__gold">Finish Gold</label>
    <input type="number" name="finish__gold" id="finish__gold" class="text__form" value="${data.finishGold}" required>
  </div>
  <div class="py-2">
    <label for="gold__deposited">Gold Deposited</label>
    <input type="number" name="gold__deposited" id="gold__deposited" class="text__form" value="${data.goldDeposited}" required>
  </div>
  <div class="py-2">
    <label>Gold Rate</label>
    <input type="number" name="gold__rate" class="text__form" value="${data.goldRate}" required>
  </div>
  <div class="py-2">
    <button id="submit" class="my-2 p-3 rounded-lg shadow-md bg-green-500 cursor-pointer text-md text-white font-bold">
      Simpan
    </button>
  </div>
  `
  select_modal_body.innerHTML = html
}

// generate table search by name
const generateSearchedTable = (data, dataTable) => {
  const makeRow = document.createElement('tr')
  const makeData1 = document.createElement('td')
  const makeData2 = document.createElement('td')
  const makeData3 = document.createElement('td')
  const makeData4 = document.createElement('td')
  const makeData5 = document.createElement('td')
  const makeData6 = document.createElement('td')
  const makeData7 = document.createElement('td')
  const makeData8 = document.createElement('td')
  const makeSpan1 = document.createElement('span')
  const makeSpan2 = document.createElement('span')

  makeRow.setAttribute('id', 'table_trans_data')
  makeRow.setAttribute('data-id', `${data.startGold},${data.finishGold},${data.goldDeposited},${data.insertedAt},${data.goldRate}`)
  makeData1.setAttribute('class', 'transaction__table__data')
  makeData2.setAttribute('class', 'transaction__table__data')
  makeData3.setAttribute('class', 'transaction__table__data')
  makeData4.setAttribute('class', 'transaction__table__data')
  makeData5.setAttribute('class', 'transaction__table__data')
  makeData6.setAttribute('class', 'transaction__table__data')
  makeData7.setAttribute('class', 'transaction__table__data edit__btn py-2')
  makeData7.setAttribute('data-id', data._id)
  makeData8.setAttribute('class', 'transaction__table__data delete__btn py-2')
  makeData8.setAttribute('data-id', data._id)
  makeSpan1.setAttribute('class', 'material-icons p-2 rounded-lg shadow-md bg-green-500 text-md text-white focus:outline-none hover:bg-green-700 cursor-pointer')
  makeSpan2.setAttribute('class', 'material-icons p-2 rounded-lg shadow-md bg-red-500 text-md text-white focus:outline-none hover:bg-red-700 cursor-pointer')

  makeData1.innerText = data.accName
  makeData2.innerText = data.accServer
  makeData3.innerText = data.startGold
  makeData4.innerText = data.finishGold
  makeData5.innerText = data.goldDeposited
  makeData6.innerText = data.insertedAt
  makeSpan1.innerText = 'mode_edit_outline'
  makeSpan2.innerText = 'delete'

  makeData7.append(makeSpan1)
  makeData8.append(makeSpan2)
  makeRow.append(makeData1, makeData2, makeData3, makeData4, makeData5, makeData6, makeData7, makeData8)
  dataTable.append(makeRow)
}

const generateFormRecapDetails = (details, recap_details_form, recap_details_table) => {
  // make form recap details
  const makeDiv1 = document.createElement('div')
  const makeDiv2 = document.createElement('div')
  const makeDiv3 = document.createElement('div')
  const makeLabel1 = document.createElement('label')
  const makeLabel2 = document.createElement('label')
  const makeLabel3 = document.createElement('label')
  const makeInputText1 = document.createElement('input')
  const makeInputText2 = document.createElement('input')
  const makeInputText3 = document.createElement('input')

  makeDiv1.setAttribute('class', 'py-2')
  makeDiv2.setAttribute('class', 'py-2')
  makeDiv3.setAttribute('class', 'py-2')
  makeInputText1.setAttribute('type', 'text')
  makeInputText2.setAttribute('type', 'text')
  makeInputText3.setAttribute('type', 'text')
  makeInputText1.setAttribute('class', 'text__form')
  makeInputText2.setAttribute('class', 'text__form')
  makeInputText3.setAttribute('class', 'text__form')
  makeInputText1.setAttribute('name', 'acc__name')
  makeInputText2.setAttribute('name', 'acc__server')
  makeInputText3.setAttribute('name', 'acc__class')
  makeInputText1.setAttribute('required', '')
  makeInputText2.setAttribute('required', '')
  makeInputText3.setAttribute('required', '')

  makeLabel1.innerText = 'Nama Player'
  makeLabel2.innerText = 'Player Server'
  makeLabel3.innerText = 'Player Class'
  makeInputText1.value = details.accName
  makeInputText2.value = details.accServer
  makeInputText3.value = details.accClass

  makeDiv1.append(makeLabel1, makeInputText1)
  makeDiv2.append(makeLabel2, makeInputText2)
  makeDiv3.append(makeLabel3, makeInputText3)
  recap_details_form.append(makeDiv1, makeDiv2, makeDiv3)

  // make table recap details dataRekap
  details.dataRekap.forEach(data => {
    const time = new Date(data.createdAt)
    let table = `
        <tr class="border border-gray-600">
          <td class="transaction__table__data">${data.startGold}</td>
          <td class="transaction__table__data">${data.finishGold}</td>
          <td class="transaction__table__data">${data.goldDeposited}</td>
          <td class="transaction__table__data">${data.goldRate}</td>
          <td class="transaction__table__data">${time.toString().slice(4, 16)}</td>
        </tr>
    `
    recap_details_table.innerHTML += table
  })

}

export default {
  generateAllTransactionsTable,
  generateEditForm,
  generateCreateTransForm,
  generateSearchedTable,
  generateFormRecapDetails
}
