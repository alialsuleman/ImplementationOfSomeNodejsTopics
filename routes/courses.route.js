const router = require('express').Router();
const courseControllers = require('../controllers/course.controller');
const validationSchema = require('../middlewares/validationSchema');



router.route('/')
    .get(courseControllers.getCourses)
    .post(validationSchema.validationSchema(), courseControllers.addCourse)



router.route('/:courseId')
    .get(courseControllers.getCourse)
    .patch(courseControllers.updateCourse)
    .delete(courseControllers.deleteCourse)
module.exports = router;