
const UserName = document.querySelector('#name')
const Email = document.querySelector('#email')
const Password = document.querySelector('#password')
const DataOfBirth = document.querySelector('#date')
const PhoneNumber = document.querySelector('#phone')
const Address = document.querySelector('#address')
const Description = document.querySelector('#description')
const btnUpdate = document.querySelector('#btn-update')
const btnSubmit = document.querySelector('#btn-submit')
const Elements = [UserName, Email, Password, DataOfBirth, PhoneNumber, Address, Description]
const messageErr = (element, mes) => { element.parentElement.querySelector('.err-message').innerHTML = mes;; element.focus() }
Elements.map(element => {
  element.oninput = () => {
    messageErr(element, '')
    switch (element.name) {
      case 'phoneNumber':
        if (element.value.trim().length >= 10) {
          element.value = element.value.slice(0, 10);
        }
        break
      case 'email':
        if (element.value.trim().length >= 40) {
          element.value = element.value.slice(0, 40);
        }
        break
      case 'password':
        if (element.value.trim().length >= 20) {
          element.value = element.value.slice(0, 20);
        }
        break
      case "description":
        if (element.value.trim().length >= 100) {
          element.value = element.value.slice(0, 100);
        }
    }
  }
})
function Validate() {
  if (!UserName.value.trim()) {
    messageErr(UserName, 'Vui lòng nhập vào trường này!')
    return
  } else if (UserName.value.trim().length < 6) {
    messageErr(UserName, 'Vui lòng nhập ít nhất 6 ký tự!')
    return
  } else if (UserName.value.trim().length > 20) {
    messageErr(UserName, 'Vui lòng nhập tối đa 20 ký tự!')
    return
  }
  if(!Email.value.trim()){
    messageErr(Email, 'Vui lòng nhập vào trường này!')
    return
  }
  if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(Email.value.trim()))) {
    messageErr(Email, 'Email không hợp lệ!')
    return
  }
  if (!Password.value.trim()) {
    messageErr(Password, 'Vui lòng nhập vào trường này!')
    return
  } else if (Password.value.trim().length < 8) {
    messageErr(Password, 'Vui lòng nhập ít nhất 8 ký tự!')
    return
  } else if (Password.value.trim().length > 20) {
    messageErr(Password, 'Vui lòng chỉ nhập tối đa 20 ký tự!')
    return
  }
  if (!DataOfBirth.value) {
    messageErr(DataOfBirth, 'Vui lòng nhập trường này!')
    return
  }
  if (!(/^(1\s|1|)?((\(\d{3}\))|\d{3})(\-|\s)?(\d{3})(\-|\s)?(\d{4})$/.test(PhoneNumber.value.trim()))) {
    messageErr(PhoneNumber, 'Phone number không hợp lệ!')
    return
  }
  if (!Address.value) {
    messageErr(Address, 'Vui lòng chọn trường này!')
    return
  }
  let list = document.querySelectorAll('input[name="gender"]')
  let gender = Array.from(list).filter(element => {
    if (element.checked) {
      return element
    }
  })
  let dataUsers = {
    UserName: UserName.value,
    Email: Email.value,
    Password: Password.value,
    DataOfBirth: DataOfBirth.value,
    PhoneNumber: PhoneNumber.value,
    Address: Address.value,
    Description: Description.value,
    gender: gender[0].value
  }
  return dataUsers
}


function HandleSubmit() {
  if (Validate()) {
    let user = Validate()
    user.id = Math.random().toFixed(5)
    const preUsers = JSON.parse(localStorage.getItem('listUsers'))
    if (preUsers) {
      localStorage.setItem('listUsers', JSON.stringify([...preUsers, user]))
    } else {
      localStorage.setItem('listUsers', JSON.stringify([user]))
    }
    ResetValue()
    renderUsers()
  }

}
function renderUsers() {
  let dataLocalStorage = JSON.parse(localStorage.getItem("listUsers"));
  if (dataLocalStorage && dataLocalStorage.length > 0) {
    let itemchildren = Object.keys(dataLocalStorage[0]);
    let th = itemchildren.map((item) => `<th>${item}</th>`);
    let td = dataLocalStorage.map((user) => {
      let keys = Object.keys(user);
      let htmltd = keys.map((item) => `<td>${user[item]}</td>`);
      return `<tr>${htmltd.join("")} <td>
                  <button type="button" class="btn-edit" onclick="editUser(${user.id
        })">edit</button></td>
                   <td><button class="btn-remove" type="button" onclick="removeUser(${user.id
        })">remove</button></td<tr/>`;
    });
    document.getElementById("root").innerHTML = `<table>
                  <tr>${th.join("")}</tr>
                  <tr>${td.join("")}</tr>
          </table>`;
  } else {
    document.getElementById("root").innerHTML = "";
  }

}
renderUsers()


function editUser(id) {
  let dataLocalStorage = JSON.parse(localStorage.getItem("listUsers"));
  let userEdit = dataLocalStorage.filter(user => {
    return user.id == id
  })
  const objUser = userEdit[0]
  UserName.value = objUser.UserName
  Email.value = objUser.Email
  Password.value = objUser.Password
  DataOfBirth.value = objUser.DataOfBirth
  Description.value = objUser.Description
  Address.value = objUser.Address
  PhoneNumber.value = objUser.PhoneNumber
  let list_radio = document.querySelectorAll('input[name="gender"]')
  Array.from(list_radio).filter(element => {
    if (element.value == objUser.gender) {
      element.checked = true
    } else {
      element.checked = false
    }
  })

  btnUpdate.disabled = false
  btnSubmit.disabled = true
  btnUpdate.onclick = () => {
    if (Validate()) {
      var newdataLocalStorage = dataLocalStorage.map(user => {
        if (user.id == id) {
          user = { ...Validate(), id: id }
        }
        return user
      })
      localStorage.setItem('listUsers', JSON.stringify(newdataLocalStorage))
      renderUsers()
      ResetValue()
      btnUpdate.disabled = true
      btnSubmit.disabled = false
    }
  }

}
function ResetValue() {
  Elements.map(element => {
    element.value = ''
  })
  let list_radio = document.querySelectorAll('input[name="gender"]')
  Array.from(list_radio).filter(element => {
    if (element.value == 'female') {
      element.checked = true
    } else {
      element.checked = false
    }
  })
}




function removeUser(id) {
  let dataLocalStorage = JSON.parse(localStorage.getItem("listUsers"));
  const newDataLocalStorage = dataLocalStorage.filter(user => user.id != id)
  localStorage.setItem('listUsers', JSON.stringify(newDataLocalStorage))
  renderUsers()
}
