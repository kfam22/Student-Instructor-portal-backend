const router = require('express').Router();
const Student = require('./students-model.js');
const bcrypt = require('bcryptjs');
const getToken = require('./getStudentToken');
const { checkUsernameExists } = require('./students-middleware')
// const { restricted, only } = require("../auth/auth-middleware.js");

// [POST] students/register
router.post('/register', (req, res, next) =>{
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password, 8)
    Student.insertStudent({ username, password: hash})
    .then(newStudent => {
      res.json({
          message: `${newStudent.username} successfully registered! `
      })
    })
    .catch(next)
  });
  //^^^middleware: check supplied username/password are valid(exists after being trimmed),  check username is available(unique)


// [POST] students/login
router.post('/login', checkUsernameExists, (req, res, next) => {
    if(bcrypt.compareSync(req.body.password, req.student.password, )) {
        const token = getToken(req.student)
        res.json({
          status: 200,
          message: `Welcome ${req.student.username}!`,
          token
        })
      } else {
        next({ status: 401, message: 'Invalid credentials'})
      }
})
//^^^middleware: check that supplied username/password are valid

/**
  [GET] /api/classes

  This endpoint is OPEN: all users
  should have access.
 */
router.get('/classes', (req, res, next) => { 
  Student.getClasses()
    .then(classes => {
      res.json(classes);
    })
    .catch(next);
});

/**
  [GET] /api/classes/:class_id

  This endpoint is RESTRICTED: only authenticated users
  should have access.

  student role only
 */
router.get('/class/:class_id', (req, res, next) => {
    Student.getClassById(req.params.class_id)
    .then(selectedClass => {
        res.json(selectedClass)
    })
    .catch(next)
});

// [GET] /api/student_id/classes

//   This endpoint is RESTRICTED: only authenticated students
//   should have access.
// client role only
router.get('/:student_id/classes', (req, res, next) => {
    console.log('get classes by student\'s id is wired')
})

// [POST] /api/register/:class_id
// restricted/ only authd students can register
router.post('/register/:class_id', (req, res, next) => {
    console.log('student register for class is wired')
})


// [POST] /api/remove/:class_id
// restricted/ only authd students can register
router.delete('/remove/:class_id', (req, res, next) => {
    console.log('remove class is wired')
})


module.exports = router;