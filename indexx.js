var express = require('express');
const app = express();
var passwordHash = require("password-hash");
const bodyParser = require('body-parser')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static("public"));
const port = 3009

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore, Filter} = require('firebase-admin/firestore');

var serviceAccount = require("./key.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
app.set("view engine", "ejs");

app.get("/", (req,res) => {
    res.render('place');
})

app.get("/signin", (req,res) => {
    res.render('signin');
})
app.get("/book", (req,res) => {
    res.render('book');
})


// app.get("/signinsubmit", (req,res) => {
//     const email = req.query.email;
//     const password = req.query.password;

//     db.collection('personalData')
//         .where("email", "==", email )
//         .where("password", "==", password )
//         .get()
//         .then((docs) => {
//             if(docs.size>0){

//                 //query my database with all the users when login is successfull
//                 const usersData = [];
//                 db.collection('personalData')
//                   .get()
//                   .then((docs) =>{
//                        docs.forEach((doc) => {
//                           usersData.push(doc.data());
//                        });
//                   })
//                   .then(() =>{
//                     //console.log(usersData);
//                     res.render("dashboard" , {usersData:usersData});
                    
//                   })

                 
               
//             }
//             else{
//                 res.send("Login Failed");
//             }
//         });
//     });





    // app.post("/signupsubmit", function(req,res) {
    //     console.log(req.body);
    //     db.collection("personalData")
    //         .where(
    //             Filter.or(
    //                 Filter.where("email", "==", req.body.email),
    //                 Filter.where("user_name", "==", req.body.user_name)
    //             )
    //         )
    //         .get()
    //         .then((docs) => {
    //             if(docs.size > 0) {
    //                 res.send("Hey this account is already exits with email and username")
    //             } else{
    //                 db.collection("personalData")
    //                     .add({
    //                         user_name:req.body.user_name,
    //                         email:req.body.email,
    //                         password:passwordHash.generate(req.body.password),
    //                     })
    //                     .then(() => {
    //                         res.sendFile(__dirname + "/views/" + "signin");
    //                     })
    //                     .catch(() => {
    //                         res.send("Something Went Wrong")
    //                     });
    //             }
    //         });
    // });




    app.post("/signupsubmit", function(req, res) {
        console.log(req.body);
        db.collection("usersData")
            .where(
                Filter.or(
                    Filter.where("email", "==", req.body.email),
                    Filter.where("user_name", "==", req.body.user_name)
                )
            )
            .get()
            .then((docs) => {
                if (docs.size > 0) {
                    res.send("Hey, this account already exists with the email and username.");
                } else {
                    db.collection("usersData")
                        .add({
                            user_name: req.body.user_name,
                            email: req.body.email,
                            password: passwordHash.generate(req.body.password),
                        })
                        .then(() => {
                            // // Specify the correct file path to your "signin" page
                            // res.sendFile(__dirname + "/views/signin");

                            // const filePath = path.join(__dirname, "views", "signin");
                            // res.sendFile(filePath);
                            res.redirect("/signin");
                        })
                        .catch(() => {
                            res.send("Something Went Wrong");
                        });
                }
            });
    });
    
    





    app.post("/signinsubmit", function(req,res){
        db.collection("usersData")
            .where("email", "==",req.body.email)
            .get()
            .then((docs) => {
                let verified = false;
                docs.forEach((doc) => {
                    verified = passwordHash.verify(req.body.password, doc.data().password)
                });

                if(verified){
                    // res.sendFile(__dirname + "/views/" + "dashboard");
                    res.redirect("/dashboard");
                } else{
                    res.send("Fail");
                }
            })
    })




// app.get("/signupsubmit", (req, res) => {
//     const full_name = req.query.full_name;
//     const user_name = req.query.user_name;
//     const email = req.query.email;
//     const password = req.query.password;

//     // Adding new data to the collection
//     db.collection('personalData').add({
//         name: full_name + user_name,
//         email: email,
//         password: password,
//     })
//     .then(() => {
//         // res.send("sign up successfully");
//         res.render('signin');
        
        
//     })
//     // 
// });

app.get("/signup", (req, res) => {
    res.render('signup'); 
});

app.get("/home", (req, res) => {
    res.render('home'); 
});

app.get("/dashboard", (req, res) => {
    res.render('dashboard'); 
});

app.get("/logout", (req, res) => {
    res.render('logout'); 
});

app.get("/place", (req, res) => {
    res.render('place'); 
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 
//app.listen(port, () => {
    //console.log(Server is running on port ${port});
//});