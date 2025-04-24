import { Router } from 'express';
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword, getUserStats } from '../controllers/user.controller.js';
import { createJob, getAllJobs, getJobById, deleteJob, getClosedJobs, getMyJobs, approveJob, closeJob, getPendingJobs} from '../controllers/job.controller.js';
import { submitResume, getMyApplications, getAllApplications, deleteAllApplicationsForJob, deleteSingleApplication } from '../controllers/application.controller.js';
import { multerMiddleware } from '../middlewares/multer.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { generateOtp } from '../controllers/auth.controller.js';

const router = Router();

// User routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/get-user-stats').get(verifyJWT, getUserStats);
router.route('/submit-resume').post(multerMiddleware, verifyJWT, submitResume);
router.route('/my-applications').get(verifyJWT, getMyApplications);
router.route('/applications/all').get(verifyJWT, getAllApplications);
router.route('/approve/:jobId').patch(verifyJWT, approveJob);
router.route('/delete-application/:jobId').delete(verifyJWT, deleteSingleApplication);
router.route('/delete-all-applications/:jobId').delete(verifyJWT, deleteAllApplicationsForJob);
router.route('/send-otp').post(generateOtp);

// Job routes
router.route('/jobs/createJob').post(verifyJWT, createJob);
router.route('/jobs/getAllJobs').get(getAllJobs);
router.route('/jobs/getClosedJobs').get(getClosedJobs);
router.route('/jobs/getJobById/:id').get(getJobById);
router.route('/jobs/deleteJob/:id').delete(verifyJWT, deleteJob);
router.route('/jobs/closeJob/:id').patch(verifyJWT, closeJob);
router.route('/jobs/my-jobs').get(verifyJWT, getMyJobs);
router.route('/jobs/pending-jobs').get(verifyJWT, getPendingJobs)


export default router;