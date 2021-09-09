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
    <input type="submit" value="Simpan" class="my-2 p-3 rounded-lg shadow-md bg-green-500 cursor-pointer text-md text-white font-bold">
  </div>
  `
  select_modal_body.innerHTML = html
}

export default {
  generateAllTransactionsTable,
  generateEditForm,
  generateCreateTransForm
}
