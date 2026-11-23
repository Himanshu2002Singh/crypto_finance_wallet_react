import { z } from "zod";
import { adminLogin, approveLead, getAdminDashboard, rejectLead, updateLeadRates, requestReupload } from "../services/adminService.js";
import { signAdminToken } from "../utils/jwt.js";
import { listLeads, getLeadById } from "../services/leadService.js";
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});
const approveSchema = z.object({
    bronzeReturnRate: z.coerce.number().positive(),
    silverReturnRate: z.coerce.number().positive(),
    goldReturnRate: z.coerce.number().positive(),
    bronzeReferralRate: z.coerce.number().positive(),
    silverReferralRate: z.coerce.number().positive(),
    goldReferralRate: z.coerce.number().positive()
});
export async function adminLoginController(req, res) {
    const payload = loginSchema.parse(req.body);
    const admin = await adminLogin(payload.email, payload.password);
    if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signAdminToken({ adminId: admin.id });
    return res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
}
export async function adminDashboardController(_req, res) {
    const metrics = await getAdminDashboard();
    return res.json(metrics);
}
export async function adminListLeadsController(req, res) {
    const status = req.query.status;
    const leads = await listLeads(status);
    return res.json({ leads });
}
export async function adminGetLeadController(req, res) {
    const lead = await getLeadById(req.params.id);
    if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
    }
    return res.json({ lead });
}
export async function adminApproveLeadController(req, res) {
    const payload = approveSchema.parse(req.body);
    const adminId = req.adminId;
    const { user, emailSent } = await approveLead({
        leadId: req.params.id,
        adminId,
        bronzeReturnRate: payload.bronzeReturnRate,
        silverReturnRate: payload.silverReturnRate,
        goldReturnRate: payload.goldReturnRate,
        bronzeReferralRate: payload.bronzeReferralRate,
        silverReferralRate: payload.silverReferralRate,
        goldReferralRate: payload.goldReferralRate
    });
    return res.json({
        user,
        emailSent,
        message: emailSent
            ? "Lead approved and account activation email sent."
            : "Lead approved successfully! (Email not sent due to SMTP credentials issue)"
    });
}
export async function adminRejectLeadController(req, res) {
    const adminId = req.adminId;
    await rejectLead({ leadId: req.params.id, adminId });
    return res.json({ success: true });
}
export async function adminUpdateLeadRatesController(req, res) {
    const payload = approveSchema.parse(req.body);
    const updatedLead = await updateLeadRates({
        leadId: req.params.id,
        bronzeReturnRate: payload.bronzeReturnRate,
        silverReturnRate: payload.silverReturnRate,
        goldReturnRate: payload.goldReturnRate,
        bronzeReferralRate: payload.bronzeReferralRate,
        silverReferralRate: payload.silverReferralRate,
        goldReferralRate: payload.goldReferralRate
    });
    return res.json({ lead: updatedLead, message: "Plan rates updated successfully." });
}
export async function adminRequestReuploadController(req, res) {
    const reason = req.body?.reason;
    const lead = await requestReupload({ leadId: req.params.id, reason });
    return res.json({ lead, message: "Re-upload notification requested successfully." });
}
