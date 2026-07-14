import express from "express";
import {
  createRegistrationInvite,
  listRegistrationReviews,
  linkRegistrationToPatient,
  listRegistrationInvites,
  rejectRegistration,
  reviewRegistration,
  revokeRegistrationInvite,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/registration-invites", createRegistrationInvite);
router.get("/registration-invites", listRegistrationInvites);
router.patch("/registration-invites/:id/revoke", revokeRegistrationInvite);
router.get("/registration-reviews", listRegistrationReviews);
router.patch("/registration-reviews/:submissionId/review", reviewRegistration);
router.patch("/registration-reviews/:submissionId/reject", rejectRegistration);
router.patch("/registration-reviews/:submissionId/link-existing", linkRegistrationToPatient);

export default router;
