import express from "express";
import {
  createRegistrationInvite,
  listRegistrationReviews,
  listRegistrationInvites,
  reviewRegistration,
  revokeRegistrationInvite,
} from "../controllers/registrationController.js";

const router = express.Router();

router.post("/registration-invites", createRegistrationInvite);
router.get("/registration-invites", listRegistrationInvites);
router.patch("/registration-invites/:id/revoke", revokeRegistrationInvite);
router.get("/registration-reviews", listRegistrationReviews);
router.patch("/registration-reviews/:patientId/review", reviewRegistration);

export default router;
