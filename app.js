

 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
 import { getFirestore, query, collection, addDoc, onSnapshot, doc, deleteDoc, updateDoc , where , orderBy , limit } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
 import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
 
 
 const firebaseConfig = {
     apiKey: "AIzaSyDspTWO119IWDst4GrXDZDiWKbEL88EHss",
     authDomain: "my-project-e5963.firebaseapp.com",
     projectId: "my-project-e5963",
     storageBucket: "my-project-e5963.appspot.com",
     messagingSenderId: "906727194454",
     appId: "1:906727194454:web:5a43d180f0f647733960f7",
     measurementId: "G-MKFDPZ9V5F"
 };
 
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
//  const provider = new GoogleAuthProvider(app);
//  auth.languageCode = 'en';
 const db = getFirestore(app);
 const ids = []  


 
 // ======== TODO =========
 
 async function AddTodo() {
 
     let Getinp = document.querySelector("#GetInp");
     // Getinp.value = '';
     const docRef = await addDoc(collection(db, "todos"), {
         Task: Getinp.value,
         Time: new Date().toLocaleString(),
         population: Math.random() * 22222
         
     });
     Getinp.value = '';
 
 
     console.log("Document written with ID: ", docRef.id);
 
 
 }
 
 
 
 
 
 function getData() {
     let ul = document.querySelector("#getul");
     const data1 = collection(db, 'todos')
 
     if(ul){
     onSnapshot(query(data1, where("status" , "==" ,  "inactive") ,limit() ), (data) => {

    //  onSnapshot(query(data1,orderBy("Time" , "desc")), (data) => {
         data.docChanges().forEach((newData) => {
 
             ids.push(newData.doc.id)
 
             if (newData.type == 'removed') {
 
                 let del = document.getElementById(newData.doc.id)
                 del.remove()
 
             }
             else if (newData.type == 'added'){
                 ul.innerHTML += `
                 <li id=${newData.doc.id}>${newData.doc.data().Task} <br> ${newData.doc.data().Time} <br><button onclick="delTodo('${newData.doc.id}')" >Delete</button> <button  onclick="editTodo(this,'${newData.doc.id}')" >Edit</button> <br><br> </li>
                 `
                 console.log(newData.doc.data())
 
             }
          
 
         })
     })
 
    }
 }
 
 getData();
 
 async function delTodo(id) {
     await deleteDoc(doc(db, "todos", id));
 }
 
 
 async function editTodo(e,id) {
 
     var editVal = prompt("Enter Edit Value");
     e.parentNode.firstChild.nodeValue = editVal;
     // console.log(e); 
 
     await updateDoc(doc(db, "todos", id), {
         Task: editVal,
         Time: new Date().toLocaleString(),
 
     });
 
 }
 
 
 async function DelAll(){
     
     var list = document.getElementById("getul");
     list.innerHTML = "";
     // console.log(ids)
     for(var i = 0 ; i < ids.length ; i++ ){
         await deleteDoc(doc(db, "todos", ids[i]));
     }
 
 
 
 }

 
 // ====== Authentication ======

 let btn = document.querySelector("#Sbtn")

if(btn){
    btn.addEventListener("click", () => {

        let getemail = document.querySelector("#Semail")
        let getpass = document.querySelector("#Spass")
    
        createUserWithEmailAndPassword(auth, getemail.value, getpass.value)
            .then(async(userCredential) => {
                const user = userCredential.user.email;
                console.log(user)
                localStorage.setItem("Email", getemail.value)
                localStorage.setItem("Password", getpass.value)
    
                try {
                    const docRef = await addDoc(collection(db, "users"), {
                        first: getemail.value,
                        last: getpass.value,
                    
                    });
                    console.log("Document written with ID: ", docRef.id);

                    // alert("Are you sure you want to signup");
                   
                
                
                    location.href = "./signin.html"
    
                } catch (e) {
                    console.error("Error adding document: ", e);
                }
    
    
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error)
            });
    
    })
    
}
    


// ============== SIGN IN =================

let btn1 = document.querySelector("#Lbtn")

if(btn1){
    btn1.addEventListener("click" , () =>{

        let getemail = document.querySelector("#Lemail")
        let getpass  = document.querySelector("#Lpass")
    
    signInWithEmailAndPassword(auth, getemail.value , getpass.value)
      .then((userCredential) => {
        const user = userCredential.user.email;
        console.log(user)
        location.href = "./todo.html"
    
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error)
      })
    })
    
}


// =============== logout =================

let logoutbtn = document.querySelector("#LObtn")

if(logoutbtn){
logoutbtn.addEventListener("click", () => {
    localStorage.clear()
    location.href = "./signup.html"
})
}

 
 // ========= WINDOW ===========
 
 
 window.AddTodo = AddTodo
 window.getData = getData
 window.delTodo = delTodo
 window.editTodo = editTodo
 window. DelAll =  DelAll



// ============ Form ================
var allUsers = []
var users = localStorage.getItem("Users")
if (users !== null) {
    allUsers = JSON.parse(users)
}




function signup() {
    var email = document.getElementById("Semail")
    var password = document.getElementById("Spass")

    var obj = {

        email: email.value,

        password: password.value,
    }
    allUsers.push(obj)
    localStorage.setItem('Users', JSON.stringify(allUsers))

if( email.value == '' || password.value  == ''){
   
    alert ("Oops Try Again")  ;

}

else{
 location.href = './signin.html'
}

}



 function signin() {
    var email = document.getElementById("Lemail").value
    var password = document.getElementById("Lpass").value
    var filterusers = allUsers.filter(function (data) {
        return data.email === email && data.password === password


    })

    
    
     if(email == '' || password == '' ){
      alert("Oops Try Again")  
    }
    else if (filterusers.length){
         Swal.fire({
            icon: 'success',
            title: '<h3 style="color: #00AD96 ">Great! You are now Sign up. Click OK to proceed.</h3>',
            confirmButtonColor: "#00AD96",
            // iconColor: '#00AD96',
        }).then(() => {
            if (true) {
                location.href = './todo.html';
            }
        })
        

    }


    else {

        alert('Sorry user not found')

        location.href = ("./signup.html")
    }



}

// function logout() {


//     localStorage.clear()

//     location.href = './signup.html'


// }




// var getrem2 = document.getElementById('reminder2').innerHTML="Please fill all the fields";
// if( email =! ' ' || password != ' '){
//     document.write(getrem2)
// }


// ========== Windows ===========

window.signin = signin
window.signup = signup


// let google = document.querySelector(".google");
// if (google){
 
//        google.addEventListener('click', () => {
     
//          signInWithPopup(auth, provider)
//            .then((result) => {
//              const credential = GoogleAuthProvider.credentialFromResult(result);
//              const user = result.user;
//              console.log(result);
//              window.location = "./todo.html"
     
//            }).catch((error) => {
//              const errorCode = error.code;
//              const errorMessage = error.message;
//              console.log(errorCode)
     
//            });
     
//        });
//      }
