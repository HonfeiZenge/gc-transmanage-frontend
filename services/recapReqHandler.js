const load = fetch('https://api-gc-transaction-management.herokuapp.com/api/transactions_recap')
  .then(res => res.json())
  .then(recapdt => {
    return recapdt.data
  })

const printLoad = async (table) => {
  const data = await load
  table.innerHTML = ''
  data.forEach(item => {
    const time = new Date(item.insertedAt).toString().slice(8, 24)
    let html = `
      <tr class="border border-gray-600">
        <td class="transaction__table__data">${item.accName}</td>
        <td class="transaction__table__data">${item.accServer}</td>
        <td class="transaction__table__data">${item.accClass}</td>
        <td class="transaction__table__data">${item.playerGain}</td>
        <td class="transaction__table__data">${item.companyGain}</td>
        <td class="transaction__table__data">${time}</td>
        <td data-id="${item._id}" id="details_recap" class="transaction__table__data">
          <span class="material-icons p-2 rounded-lg shadow-md bg-green-500 text-md text-white focus:outline-none hover:bg-green-700 cursor-pointer">mode_edit_outline</span>
        </td>
      </tr>
    `
    table.innerHTML += html
  })
}

const updateRecapData = async (request) => {
  try {
    const response = await fetch(request)
    const transaction = await response.json()
    const refresh_loc = 'https://great-class-transmanagement.netlify.app' || 'http://localhost:3000'

    if (transaction.status == 'success') {
      window.location.replace(refresh_loc)
    } else {
      alert(`${transaction.status} Gagal Edit Data`)
    }
  } catch (err) {
    return console.log(err.message)
  }
}

export default {
  printLoad,
  updateRecapData
}
