class Student {
    constructor(id, name, age, phone) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.phone = phone;
        this.hobbies = [];
    }
    getPhone() {
        return this.phone.substring(0, 8) + 'xxx';
    }
    setAge(age) {
        if (age < 0 || age > 120) {
            throw new Error('Tuoi ko hop le');
        } else {
            this.age = age;
        }

    }
}
let s1 = new Student(1, 'Quang', 31, '0399578134');
let s2 = new Student(2, 'Nhan', 13, '0399578134');
let s3 = new Student(3, 'Anh', 14, '0399578134');

let KEY_STUDENTS = "KEY_STUDENTS";
let students = [];      // object => JSON
readData();



function readData() {

    if (localStorage.getItem(KEY_STUDENTS)) {
        students = JSON.parse(localStorage.getItem(KEY_STUDENTS)); // JSON
    } else {
        students = [s1, s2, s3];
        localStorage.setItem(KEY_STUDENTS, JSON.stringify(students));
    }

}

function saveData(data) {
    localStorage.setItem(KEY_STUDENTS, JSON.stringify(data));
}


function renderStudents() {
    let studentsHtml = "";
    for (let i = 0; i < students.length; i++) {
        let item = `
            <tr id='${students[i].id}'>
                <td>${students[i].id}</td>
                <td>${students[i].name}</td>
                <td>${students[i].age}</td>
                <td>${students[i].phone}</td>
                <td>
                </td>
                <td class='cell-action'>
                    <i onclick="handleShowEditStudent(${students[i].id})"class="fa-solid fa-pen-to-square"></i>
                    
                </td>
            </tr>
        `;
        studentsHtml += item;
    }

    document.getElementById("stb").innerHTML = studentsHtml;
}

renderStudents();

var modal = document.getElementById("modal");
function handleBtnModalClose() {
    modal.style.display = "none";
}

window.onclick = function (evt) {
    if (evt.target == modal) {
        modal.style.display = "none";
    }
}
function handleShowModalCreate() {
    modal.style.display = "flex";
    document.getElementById("mTxtName").value = "";
    document.getElementById("mTxtAge").value = "";
    document.getElementById("mTxtPhone").value = "";
    document.getElementById("mTxtHobbies").value = "";

    document.getElementById("btnModalUpdate").classList.add("hide");
    document.getElementById("btnModalCreate").classList.remove("hide");
}
function handleBtnModalCreate() {
    document.getElementById("btnModalUpdate").classList.add("hide");
    document.getElementById("btnModalCreate").classList.remove("hide");

    let name = document.getElementById("mTxtName").value;
    let age = document.getElementById("mTxtAge").value;
    let phone = document.getElementById("mTxtPhone").value;
    let hobbies = document.getElementById("mTxtHobbies").value;

    let maxID = findMaxId(students) + 1;


    let studentNew = new Student(maxID, name, age, phone);
    studentNew.hobbies = hobbies;

    students.push(studentNew);
    saveData(students);
    renderStudents();

    modal.style.display = "none";
}
function handleTrashStudent(id, name) {
    let check = confirm("Are you sure to delete " + name + " ?");
    if (check) {
        deleteStudentById(id);
        saveData(students);
        renderStudents();
    }
}
function deleteStudentById(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students.splice(i, 1);
        }
    }
}
function handleShowEditStudent(id) {
    let s = findStudentByID(id);
    if (s == null) {
        alert("Student not found");
    } else {
        document.getElementById("id-student").value = id;
        document.getElementById("btnModalUpdate").classList.remove("hide");
        document.getElementById("btnModalCreate").classList.add("hide");

        document.getElementById("mTxtName").value = s.name;
        document.getElementById("mTxtAge").value = s.age;
        document.getElementById("mTxtPhone").value = s.phone;
        document.getElementById("mTxtHobbies").value = s.hobbies;

        modal.style.display = "block";
    }
}
function findStudentByID(id) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            return students[i];
        }
    }
    return null;
}
function handleBtnModalUpdate() {
    let id = document.getElementById("id-student").value;

    let name = document.getElementById("mTxtName").value;
    let age = document.getElementById("mTxtAge").value;
    let phone = document.getElementById("mTxtPhone").value;
    let hobbies = document.getElementById("mTxtHobbies").value;

    let student = new Student(id, name, age, phone);
    student.hobbies = hobbies;


    updateStudentById(id, student);
    saveData(students);
    modal.style.display = "none";
    renderStudents();



}
function updateStudentById(id, student) {
    for (let i = 0; i < students.length; i++) {
        if (students[i].id == id) {
            students[i].name = student.name;
            students[i].age = student.age;
            students[i].phone = student.phone;
            students[i].hobbies = student.hobbies;
        }
    }
}
function findMaxId(students) {
    let s1 = [...students]; // Sao chép mảng students thành s1
    s1.sort((a, b) => b.id - a.id);

    return s1[0].id;
}


let btnDelete = document.getElementById("btnDelete");
let idDeleteds = [];
btnDelete.addEventListener("click", (evt) => {          // evt: sự kiện đang tác động
    let btnPresent = evt.target;                        // evt.target: SẼ biết được element nào đang được tác động
    if (!btnPresent.classList.contains('toggle')) {     // btnPresent = btnDelete: class ="btn btn-delete [có toggle hoặc ko]" kiểm tra xem có class toggle không
        // Show ra các checkbox đế xóa
        let cellActions = document.querySelectorAll(".cell-action");        // tìm ra tất cả các ô td xóa của các dòng
        cellActions.forEach((td) => {
            let parentElement = td.parentElement;                           // tìm tới thẻ cha để lấy ID

            let inputElement = document.createElement('input');             // tạo thẻ checkbox
            inputElement.type = "checkbox";
            inputElement.id = parentElement.id;

            td.append(inputElement);        // thêm vô từng  ô td xóa của các dòng
        })
    } else {
        // Thực hiện xóa
        // Reset lại, không hiển thị mấy ô checkbox nữa
        let checkboxs = document.querySelectorAll(".cell-action input[type=checkbox]");         // tìm tới các ô checkbox
        checkboxs.forEach((cb) => {
            if (cb.checked) {
                idDeleteds.push(cb.id);
            }
            cb.remove();
        })

        // idDeleteds: [1,2,4]
        deleteStudentByIds(idDeleteds);
        saveData(students);
        renderStudents();
    }
    btnPresent.classList.toggle('toggle');
})


function deleteStudentByIds(ids) {
    for (let i = 0; i < ids.length; i++) {
        for (let j = 0; j < students.length; j++) {
            if (ids[i] == students[j].id) {
                students.splice(j, 1)
            }
        }
    }
}