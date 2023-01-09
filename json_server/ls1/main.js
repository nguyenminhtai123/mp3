var courseApi =   'http://localhost:3000/courses'

function start() {
    getCourse(renderCourse);

    handleCreateCourse();

}
start()


// function



function getCourse (callback){
    fetch(courseApi)
    .then (function (response) {
        return response.json();
    })
    .then (callback)
}


function postCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    };
    fetch(courseApi, options) 
        .then(function(response) {
            response.json();
        })
        .then(callback)
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    };
    fetch(courseApi + "/" + id, options)
        .then(function(response) {
            response.json();
        })
        .then(function(){
            var courseItem = document.querySelector('.course-item-' + id)
            if (courseItem) {
                courseItem.remove();
            }
        })

    }

function editCourse(id, data, callback) {
    var options = {
        method: 'PUT',
        header: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    fetch(url + '/' + id, options)
    .then(function(response) {
        response.json();
    }
    .then(callback)
)}

function handleEditCourse(id){
    fetch(courseApi + "/" + id)
        .then(function(response){
            response.json();
        }
        .then(function(courses){
            document.querySelector('input[name="name"]').value = courses.name;
            document.querySelector('input[name="description"]').value = courses.description;
            document.querySelector('#create').add('hidden');
            document.querySelector('#edit').remove('hidden');
            var btnEdit = document.querySelector('#edit')
            btnEdit.onclick = function() {
                var formData = {
                    name: document.querySelector('input[name="name"]').value,
                    description: document.querySelector('input[name="description"]').value
                }
                editCourse(id, formData, function(){
                    getCourse(function(course){
                        renderCourse(course);
                    })
                })
            }
        })
)}

function renderCourse (course){
    var listCourseBlocks = document.querySelector('#list-courses')
    var htmls = course.map(function (course){ 
        return `
        <li class="course-item-id">
            <h4>${course.name}</h4>
            <p>${course.description}</p>
            <button onclick="handleDeleteCourse(${course.id})">Xóa</button>
            <button onclick="handleEditCourse(${course.id})" id="edit">Chỉnh sửa</button>
        </li>
        `
    })
    listCourseBlocks.innerHTML=htmls.join('');

}


function handleCreateCourse () {
    var createCourses = document.querySelector('#create');

    createCourses.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        console.log(name);
        var description = document.querySelector('input[name="description"]').value;

        var formData = {
            name:name, 
            description:description

        }

        postCourse(formData, function(){
            getCourse(renderCourse);

        })
    }

}

