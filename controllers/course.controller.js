const { validationResult } = require('express-validator')
const Course = require('../models/course.model');
const httpstatusText = require('../utils/httpstatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/appError');




const getCourses = asyncWrapper(
    async (req, res) => {

        const query = req.query;
        let limit = +query.limit || 10;
        limit = Math.min(limit, 10);

        const page = +query.page || 1;
        const skip = (page - 1) * limit;

        //get all courses from DB use Course model 
        const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
        res.json({
            status: httpstatusText.SUCCESS,
            data: {
                courses: courses
            }
        });
    }
)


const getCourse = asyncWrapper(
    async (req, res, next) => {

        const course = await Course.findById(req.params.courseId);
        console.log(course);
        if (!course) {
            const error = appError.create('not found course', 404, httpstatusText.FAIL);
            return next(error);
        }
        res.json({
            status: httpstatusText.SUCCESS,
            data: {
                course: course
            }
        });
    }

)

const addCourse = asyncWrapper(
    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = appError.create(errors.array(), 400, httpstatusText.FAIL)
            return next(error);

        }
        const newCourse = new Course(req.body);
        await newCourse.save();

        res.status(201).json({
            status: httpstatusText.SUCCESS,
            data: {
                course: newCourse
            }
        });

    }



)


const updateCourse = asyncWrapper(
    async (req, res) => {
        const updateCourse = await Course.updateOne({ _id: req.params.courseId }, { $set: { ...req.body } });
        return res.status(200).json({
            status: httpstatusText.SUCCESS,
            data: {
                course: updateCourse
            }
        });
    }
)

const deleteCourse = asyncWrapper(
    async (req, res) => {
        const msg = await Course.deleteOne({ _id: req.params.courseId });
        return res.status(200).json({
            status: httpstatusText.SUCCESS,
            data: null
        });
    }
)



module.exports = {

    addCourse,
    updateCourse,
    getCourse,
    getCourses,
    deleteCourse

}