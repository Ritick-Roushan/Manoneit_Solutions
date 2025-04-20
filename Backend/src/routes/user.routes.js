import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken, changeCurrentPassword , getUserStats} from "../controllers/user.controller.js";
import { createJob, getAllJobs, getJobById, deleteJob,closeJob } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/get-user-stats").get(verifyJWT, getUserStats)
// router.route("/current-user").get(verifyJWT, getCurrentUser)
// router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/createJob").post(createJob)
router.route("/getAllJobs").get(getAllJobs)
router.route("/getJobById/:id").get(getJobById)
router.route("/deleteJob/:id").delete(deleteJob)
router.route("/closeJob/:id").patch(closeJob)

export default router