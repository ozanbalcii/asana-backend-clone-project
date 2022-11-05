const express = require('express');




const router = express.Router(); // express'in router'ını kullanıyoruz.




// router.get("/", index); 

router.get("/", (req, res) => {
    res.status(200).send("Working..");
});



module.exports = router; 

