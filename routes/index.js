var express = require('express');
var router = express.Router();
var user = require('../models/user');

//get login
router.get('/',function(req, res, next){
  return res.render('final',{title:'HOME'});
});

//post login
router.post('/', function(req, res, next){

  if(req.body.userid  && req.body.password){
    user.authenticate(req.body.userid, req.body.password, function(error, user){
      if(error || !(user))
      {
        var err = new Error('wrong userid or passord:');
        err.status = 401;
        console.log(req.body.userid);
        console.log(err);
        return next(err);
      }else{
     req.session.userid = user._id;
        return res.redirect('/login.html');
      }
    });
  }else{

    var err = new Error('userid and Password required.');
    err.status = 401;
    console.log(req.body.userid);
    console.log(err);
    return next(err);
  }
});

//get registration
router.get('/signup.html',function(req, res, next){
    return res.render('signup.html');
});

//post registration
router.post('/signup.html', function(req, res, next){

  if(req.body.email &&
req.body.userid &&
 req.body.password){
   if(req.body.password !== req.body.confirmPassword)
   {
     var err = new Error('Password do not match');
     err.status = 400;
     return next(err);
   }
   //create object with fporm input
   var userData = {
     userid: req.body.userid,
     fname: req.body.fname,
     lname: req.body.lname,
     password: req.body.password,
     daddy: req.body.daddy,
     email: req.body.email,
     accno: req.body.accno,
     rupee: req.body.rup
     };
     // use sche,'s create method to insert document into mongo'
     user.create(userData, function(error, user){
       if(error){
         console.log(error);
         return next(error);
       }else {
         req.session.userid = user._id;
         return res.redirect('/')
        }
     });
 }
 else{
   var err = new Error('All fileds are required');
   err.status =400;
   return next(err);
 }
});

//login page
router.get('/login.html',function(req, res, next){
  if(! req.session.userid ){
    var err = new Error("You are not authorised to view this page");
    err.status = 403;
    console.log(req.session.userid);
    return next(err);

  }
  user.findById(req.session.userid)
    .exec(function (error, user){
      if(error)
      {
        return next(error);
        console.log(error);
      } else{
        console.log(user.fname);
        return res.render('login.html',{
          name : user
        });
      }
    });

});

//depoite get
router.get('/deposite.html',function(req, res, next){
    return res.render('deposite.html');
});

//post deposite
router.post('/deposite.html',function(req, res, next){
  if(req.body.accno && req.body.pcard && req.body.rupee)
  {
    user.findOne({accno : req.body.accno},function(err,user){
        var amount=req.body.rupee;
        if(user.rupee!=0)
        {
        amount= parseInt(amount) + parseInt(user.rupee);
}else{
  amount=parseInt(amount);
}
        var userData = {
          rupee: amount,
          };
        user.update(userData, function(err, user){
          if(err)
          {
            console.log("not updated");
            err = new Error("Something is INCORRECT!! TRY AGAIN");
            err.status= 401;

            return next(err);
          }else {
            console.log("data updated");
            return res.redirect('/login.html');
          }
        });
      });
}else{
  err = new Error("Something is INCORRECT!! TRY AGAIN");
  err.status= 401;
  return next(err);
}
});


//withdrawl get
router.get('/withdraw.html',function(req, res, next){
  return res.render('withdraw.html');
});

router.post('/withdraw.html', function(req, res, next){

  if(req.body.accno && req.body.rupee && req.body.fname )
  {
      user.findOne({accno: req.body.accno},function(err, user){
        var amount= user.rupee;
        if(amount >= req.body.rupee)
        {
          amount = parseInt(amount) - parseInt(req.body.rupee)
          var userData={
            rupee: amount
          };
          user.update(userData,function(err, user){
            if(err)
            {
              err = new Error("NOT ABLE TO PROCEED");
              err.status= 401;
              return next(err);
            }else {
              {
                console.log("withdraw successfull");
                //alert("Successful");
                return res.redirect('/login.html');
              }
            }
          });

        }else {
          {
            err = new Error("NOT ENOUGH BALANCE");
            err.status= 401;
            return next(err);
          }
        }
      });
  }else{
    err = new Error("Something is INCORRECT!! TRY AGAIN");
    err.status= 401;
    return next(err);
  }
});

//get moneytransfer
router.get('/moneytrans.html',function(req, res, next){
  return res.render('moneytrans.html');
});

//post money transfer
router.post('/moneytrans.html',function(req, res, next){

  if(req.body.mynum && req.body.onum && req.body.rupee)
  {
    var amount= req.body.rupee;

    user.findOne({accno: req.body.onum}, function(err, user){
      amount= parseInt(user.rupee) + parseInt(req.body.rupee);
    var userData={
      rupee: amount
    }

    user.update(userData,function(err, user){
      if(err)
      {
        err = new Error("NOT ABLE TO PROCEED");
        err.status= 401;
        return next(err);
      }else {

          console.log("amount created successfully");

          user.findById(req.session.userid)
            .exec(function (error, user){
              if(error)
              {
                return next(error);
                console.log(error);
              } else{

                console.log("amount debited");

                amount= parseInt(user.rupee) - parseInt(req.body.rupee);
              var userData={
                rupee: amount
              }


                user.update(userData,function(err, user){
                  if(err)
                  {
                    err = new Error("NOT ABLE TO PROCEED");
                    err.status= 401;
                    return next(err);
                  }else {
                    {
                      console.log("amount debited successfully");
                      return res.send("congratulations");
                    }
                  }
                });

              }
                });




/*
         user.findOne({accno: req.body.mynum}, function(err, user){
            amount= parseInt(user.rupee) - parseInt(req.body.rupee);
          var userData={
            rupee: amount
          }


            user.update(userData,function(err, user){
              if(err)
              {
                err = new Error("NOT ABLE TO PROCEED");
                err.status= 401;
                return next(err);
              }else {
                {
                  console.log("amount debited successfully");
                  return res.send("congratulations");
                }
              }
            });

          });*/
}


    });
    });




  }else {
    {
      return res.redirect('/error.html')
    }
  }
});


module.exports = router;
