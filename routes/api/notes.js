var router = require("express").Router();
var noteController = require("../../controllers/note");

router.get("/:id", noteController.findOne);
router.post("/", noteController.create);
router.delete("/:id", headlineController.delete);

module.exports = router;