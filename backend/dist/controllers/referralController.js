import { listReferrals } from "../services/referralService.js";
export async function listReferralsController(req, res) {
    const userId = req.userId;
    const referrals = await listReferrals(userId);
    return res.json({ referrals });
}
