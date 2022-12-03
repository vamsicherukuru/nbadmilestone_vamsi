const model = require('../models/trade');


// GET /

exports.trades = (req,res,next)=>{

    model.find()
    .then(trades=>{
        let category_array = new Set();
        for(var c=0;c<trades.length;c++){
            category_array.add(trades[c].item_category);
        }
        let categories = Array.from(category_array);
        console.log(categories);
        res.render('./trades/trades.ejs',{trades,categories});

    })
    .catch(err=>{
        next(err)
    });

   

};

// update in 2 steps
// GET /trades/:id/edit  get form for existing story

exports.edit = (req,res,next)=>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade ID');
    //     err.status = 400;
    //     req.flash('error','Invalid Trade ID');
    //     return res.redirect('back');
    //     return next(err);

    // }
    model.findById(id)
    .then(item=>{
        if(item){
            res.render('./trades/edit',{item})
    
        }
        else{
            let err = new Error('Cannot Find an item with id: '+id);
            err.status = 404;
            req.flash('error','Cannot Find a trade with id: '+id);
            return res.redirect('back');
            next(err);
        }

    })
    .catch(err=>{
        next(err)
    })
  
};

// PUT /stories/:id update story with id


exports.update = (req,res,next)=>{
    let item = req.body;
    let id = req.params.id;

    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade ID');
    //     err.status = 400;
    //     return next(err);

    // }

    model.findByIdAndUpdate(id,item,{useFindAndModify:false, runValidators:true})
    .then(item=>{
        if(item){
            req.flash('success','Updation is complete');
            res.redirect('/trades/'+id);
        }
        else{
            let err = new Error('Cannot Find a trade with id: '+id);
            err.status = 404;
            req.flash('error','Cannot Find a trade with id: '+id);
            return res.redirect('back');
            next(err);

        }
    })
    .catch(err=>{
        if(err.name==='ValidationError'){
            err.status = 400;
        }
        next(err)})

    console.log(item);
    
};



exports.delete = (req,res,next)=>{
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade ID');
    //     err.status = 400;
    //     req.flash('error','Invalid Trade ID');
    //     return res.redirect('back');
    //     return next(err);

    // }
    model.findByIdAndDelete(id,{useFindAndModify:false})
    .then(story=>{
        if(story){
            req.flash('success','Deletion Successful');

            res.redirect('/trades');
        }else{
            let err = new Error('Deletion Cannot be perfomed on a trade with id: '+id);
            err.status = 404;
            req.flash('error','Deletion Cannot be perfomed on a trade with id: '+id);
            return res.redirect('back');
        }
    })
    .catch(err=>next(err));

 
};


exports.detail = (req,res,next)=>{

    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)){
    //     let err = new Error('Invalid Trade ID');
    //     err.status = 400;
    //     req.flash('error','Invalid Trade ID');
    //     return res.redirect('back');
    //     return next(err);

    // }
    model.findById(id).populate('author','firstName lastName')
    .then(item=>{
        if(item){
            res.render('./trades/trade',{item});
    
        }
        else{
            let err = new Error('Cannot Find an item with id: '+id);
           

            err.status = 404;
            req.flash('error','Cannot Find an item with id: '+id);
            return res.redirect('back');
            next(err);
        }

    })
    .catch(err=>{
        next(err)
    })


};


exports.newtrade = (req,res) =>{

    res.render('./trades/newtrade',{});
};

// POST /stories create a new story

exports.create = (req,res,next)=>{

    // res.send("New story created");
    let item = new model(req.body);
    item.author = req.session.user;
    item.save()
    .then((item)=>{
        console.log(item);
        req.flash('success','Trade is created successfully');

        res.redirect('/trades');
    })
    .catch(err=>{
        if(err.name === 'ValidationError'){
            err.status = 400;
            
        }
        next(err)
    })
    
};
