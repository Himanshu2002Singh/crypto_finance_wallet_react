import { listPlans } from "../services/planService.js";
export async function listPlansController(_req, res) {
    const plans = await listPlans();
    return res.json({ plans });
}
