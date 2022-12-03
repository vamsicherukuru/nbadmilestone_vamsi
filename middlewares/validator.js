


//check if the route parameter is a valid objectId value

exports.validateId = (req,res,next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        // let err = new Error('Invalid story id');
        // err.status = 400;
        req.flash('error','Invalid Story Id');
        return res.redirect('back');
    }else{
        next();
    }
};