const User = require('../models/user');
const Story = require('../models/trade');


exports.new = (req,res)=>{
    
    res.render('./user/new');
};


exports.create = (req,res,next)=>{
    let user = User(req.body)
    user.save()
    .then(()=>{
        req.flash('success','Your account has been created!');
        res.redirect('/users/login')})
    .catch(err=>{
        if(err.name==='ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/users/new');
        }

        //duplicate
        if(err.code ===11000){
            req.flash('error','Email address has been used');
            return res.redirect('/users/new');

        }
        next(err);
    });
}



// //create a new user



// //login page
exports.login = (req,res)=>{
    // console.log(req.flash());

    res.render('./user/login');
}

exports.loginuser = (req,res,next)=>{
    //authenticate user's login request...

    let email = req.body.email;
    let password = req.body.password;

    //get the user that matches the details

    User.findOne({ email: email})
    .then(user=>{
        if(user){
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id;
                    req.session.username =  user.firstName;
                    req.flash('success','You have successfully logged in,'+user.firstName);
                    res.redirect('/users/profile');
                }
                else{
                    // console.log("wrong password");
                    req.flash('error','Wrong password');
                    res.redirect('/users/login');
                }
            })
        }
        else{
            // console.log("incorrect email address");
            req.flash('error','Wrong email address');

            res.redirect('/users/login');
        }
    })
    .catch(err=>next(err))

};

// //process the login request


exports.profile = (req,res,next)=>{
    let id = req.session.user;
    // console.log(req.flash());
    Promise.all([User.findById(id),Story.find({author:id})])
    .then(results=>{
        const [user, stories] =results;
        res.render('./user/profile',{user, stories});
    })
    
    .catch(err=>next(err));
};

// //profile get


exports.logout = (req,res,next)=>{
    req.session.destroy(err=>{
        if(err){
            return next(err);
        
        }else{
            res.redirect('/');
        }
    });
   
};
// //logout the user
