const express = require('express');
const router = express.Router();
const { checkLogin } = require('./verify');
const db = require('./dataBase');
const fetch = require("isomorphic-fetch");
const passport = require('passport');
const session = require('express-session');
const razorpay = require('razorpay');
const config = require('./config');
//for payment

//for payment end
//for facebook 
const FacebookStrategy = require('passport-facebook').Strategy;
router.get('/', checkLogin, (req, res) => {
    if (req.name && req.email) {
        res.render('index', {
            name: req.name,
            email: req.email
        });
       
    } else {
        res.render('index');
        
    }

})

//blog Routes//
router.get('/blog', (req, res)=>{
    res.render('blog');
})
router.get('/payment', (req, res)=>{
    res.render('payment'); 
})
//End Blog Routes//
//carrier Page//
router.get('/blog', (req, res)=>{
    res.render('blog');
})
router.get('/terms-of-use', (req, res)=>{
    res.render('terms-of-use');
})
router.get('/policy', (req, res)=>{
    res.render('policy');
})
router.get('/careers', (req, res)=>{
    res.render('careers');
})
router.get('/contacts', (req, res)=>{
    res.render('contacts');
})
//end carrier routes//
router.get('/login', checkLogin, (req, res) => {
    if (!req.name || !req.email) { 
        res.render('login');
    } else 
     if (!req.name || !req.email || req.active != 1) {
        res.status(302).redirect('/register');
    } else  {
        res.status(302).redirect('/home')
    }
})

router.get('/register', checkLogin, (req, res) => {
    if (!req.name || !req.email || req.active != 1) {
        res.render('register', {
            email: req.email
        });
    } else {
        res.status(302).redirect('/home')
    }
})

//admin login register
router.get('/admin', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('admin');
    } else if (!req.name || !req.email || req.active != 1) {
        res.status(302).redirect('/adminreg');
    } else {
        res.status(302).redirect('/admindashboard')
    }
})

router.get('/adminreg', checkLogin, (req, res) => {
    if (!req.name || !req.email || req.active != 1) {
        res.render('adminreg', {
            email: req.email
        });
    } else {
        res.status(302).redirect('/admindashboard')
    }
})
router.get('/admindashboard', checkLogin, (req, res) => {

    db.query('SELECT * FROM users', (err, result) => {
        if (err) throw err
           let data = result;
           db.query('SELECT * FROM blog where status="Active" ORDER BY id DESC', (err, result) => {
            if (err) throw err
            const blog = result
    if (req.name && req.email && req.active == 1) {
        let firstname = req.name.split(' ')
        firstname = firstname[0]
        res.render('admindashboard', {
            firstname,
            name: req.name,
            email: req.email,
            valueData : data,
            valueAata :blog
        });
    } else {
        res.status(302).redirect('/admin')
    }
});
});  
})


//edit//
router.get('/delete/:id', checkLogin, (req, res) => {
          const blogId = parseInt(req.params.id);   
    if (req.name && req.email && req.active == 1) {
        db.query(`UPDATE  blog SET status='Delete' where id=${blogId}`, (err, result) => {
            if (err) throw err
               let deleteData = result; 
               if(deleteData){
                console.log('record Deleted');
                res.redirect('/admindashboard');
               }
            }); 
    } else {
        res.status(302).redirect('/admin')
    } 
})

//post
router.post('/admindashboard',checkLogin, function(req, res) {
    const { head, content, img}  = req.body;
    var sql = `INSERT INTO blog (head, content, img, date) VALUES ("${head}", "${content}", "${img}", NOW())`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      res.redirect('/admindashboard');
      
    });
  });

//end of admin routes

router.get('/recovery', checkLogin, (req, res) => {
    if (!req.name || !req.email) {
        res.render('recovery');
    } else {
        res.status(302).redirect('/home')
    }
})

router.get('/home', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        let firstname = req.name.split(' ')
        firstname = firstname[0]
        res.render('home', {
            firstname,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/dashboard', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('dashboard', {
            userID: req.username,
            name: req.name,
            email: req.email,
            active: function () {
                if (req.active == 1) {
                    return 'active'
                } else {
                    return 'not active'
                }
            }
        });
    } else {
        res.status(302).redirect('/login')
    }
})

router.get('/setting', checkLogin, (req, res) => {
    if (req.name && req.email && req.active == 1) {
        res.render('setting', {
            userID: req.username,
            name: req.name,
            email: req.email
        });
    } else {
        res.status(302).redirect('/login')
    }
})
 //goole signup regristation

//for facebook//
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/dashboard');
  }
);
router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard', failureRedirect: '/login' })
);

module.exports = router;