const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin } = require("./verifyToken");
const User = require('../models/User')
const router = require("express").Router();
// const CryptoJS = require("crypto-js");


router.put("/:id", verifyTokenAndAuthorization,async (req,res)=>{
   if(req.body.password){
    req.body.password =  CryptoJS.AES.encrypt(
            req.body.password,
        process.env.PASS_SEC
      ).toString();
   }

   try {
    const { username } = req.body
    const updateUser =  await User.findByIdAndUpdate(
        { _id: req.params.id }, { username }
    )
    res.status(200).send({ msg: 'success', updateUser });
    
    } catch (err) {
        res.status(500).json(err); 
    }
});  


// delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try {
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Tài khoản đã được xoá!");
    } catch (error) {
        res.status(500).json(err)
    }
});

// GET USer 
router.get("/find/:id", verifyTokenAndAdmin, async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(err)
    }
});


// GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    const query = req.query.new
     try {
         const users =query ? await User.find().sort({_id: -1}).limit(5) : await User.find();
         res.status(200).json(users);
     } catch (error) {
         res.status(500).json(err)
     }
 });


 // GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await User.aggregate([
            {$match: {createdAt:{$gte: lastYear } } },
            {
                $project:{
                    month: {$month: "$createdAt"},
                },
            },
            {
                $group:{
                    _id: "$month",
                    total:{$sum: 1},
                }
            }
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
});
 

module.exports = router;