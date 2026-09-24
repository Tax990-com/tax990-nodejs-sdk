import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Tax990Client } from '../src/index';

const PORT = Number(process.env.BRIDGE_PORT) || 4100;

const client = new Tax990Client({
  clientId: process.env.TAX990_CLIENT_ID || '',
  clientSecret: process.env.TAX990_CLIENT_SECRET || '',
  userToken: process.env.TAX990_USER_TOKEN || '',
});

const app = express();
app.use(cors());
app.use(express.json());

function sendError(res: express.Response, e: any) {
  const status = e.statusCode ?? 500;
  res.status(status).json(e.responseData ?? { StatusCode: status, StatusMessage: e.message });
}

// ─── Auth ────────────────────────────────────────────────────────

app.post('/api/auth/token', async (_req, res) => {
  try { res.json(await client.utility.ping()); } catch (e) { sendError(res, e); }
});

app.get('/api/auth/server-time', async (_req, res) => {
  try { res.json(await client.utility.ping()); } catch (e) { sendError(res, e); }
});

// ─── Form 990-N ──────────────────────────────────────────────────

app.post('/api/form990n/create', async (req, res) => {
  try { res.json(await client.form990n.create(req.body)); } catch (e) { sendError(res, e); }
});

app.get('/api/form990n/get', async (req, res) => {
  try {
    const { SubmissionId, RecordId } = req.query as Record<string, string>;
    res.json(await client.form990n.get({ SubmissionId, RecordId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/form990n/list', async (req, res) => {
  try {
    const { SubmissionId, BusinessId } = req.query as Record<string, string>;
    res.json(await client.form990n.list({ SubmissionId, BusinessId }));
  } catch (e) { sendError(res, e); }
});

app.post('/api/form990n/update', async (req, res) => {
  try { res.json(await client.form990n.update(req.body)); } catch (e) { sendError(res, e); }
});

app.delete('/api/form990n/delete', async (req, res) => {
  try {
    const { SubmissionId, RecordId } = req.query as Record<string, string>;
    res.json(await client.form990n.delete({ SubmissionId, RecordId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/form990n/validate', async (req, res) => {
  try {
    const { SubmissionId, RecordIds } = req.query as Record<string, string>;
    res.json(await client.form990n.validate({
      SubmissionId,
      RecordIds: RecordIds ? RecordIds.split(',') : [],
    }));
  } catch (e) { sendError(res, e); }
});

app.post('/api/form990n/transmit', async (req, res) => {
  try { res.json(await client.form990n.transmit(req.body)); } catch (e) { sendError(res, e); }
});

app.get('/api/form990n/getPDF', async (req, res) => {
  try {
    const { SubmissionId, RecordIds } = req.query as Record<string, string>;
    res.json(await client.form990n.getPDF({
      SubmissionId,
      RecordIds: RecordIds ? RecordIds.split(',') : undefined,
    }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/form990n/status', async (req, res) => {
  try {
    const { SubmissionId, RecordIds } = req.query as Record<string, string>;
    res.json(await client.form990n.status({
      SubmissionId,
      RecordIds: RecordIds ? RecordIds.split(',') : undefined,
    }));
  } catch (e) { sendError(res, e); }
});

// ─── Utility ─────────────────────────────────────────────────────

app.get('/api/utility/ping', async (_req, res) => {
  try { res.json(await client.utility.ping()); } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getAllSubmissionId', async (_req, res) => {
  try { res.json(await client.utility.getAllSubmissionIds()); } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getSubmissionIdByBusinessId', async (req, res) => {
  try {
    const { businessId } = req.query as Record<string, string>;
    res.json(await client.utility.getSubmissionIdByBusinessId({ businessId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getSubmissionIdByRecordId', async (req, res) => {
  try {
    const { recordId } = req.query as Record<string, string>;
    res.json(await client.utility.getSubmissionIdByRecordId({ recordId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getRecordIds', async (_req, res) => {
  try { res.json(await client.utility.getRecordIds()); } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getRecordIdBySubmissionId', async (req, res) => {
  try {
    const { submissionId } = req.query as Record<string, string>;
    res.json(await client.utility.getRecordIdBySubmissionId({ submissionId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getRecordDetailBySubmissionId', async (req, res) => {
  try {
    const { submissionId } = req.query as Record<string, string>;
    res.json(await client.utility.getRecordDetailBySubmissionId({ submissionId }));
  } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getAllBusinessId', async (_req, res) => {
  try { res.json(await client.utility.getAllBusinessIds()); } catch (e) { sendError(res, e); }
});

app.get('/api/utility/getBusinessIdBySubmissionId', async (req, res) => {
  try {
    const { submissionId } = req.query as Record<string, string>;
    res.json(await client.utility.getBusinessIdBySubmissionId({ submissionId }));
  } catch (e) { sendError(res, e); }
});

// ─── Nonprofits ──────────────────────────────────────────────────

app.get('/api/nonprofits/getOrganizationDetailsByEIN', async (req, res) => {
  try {
    const { ein } = req.query as Record<string, string>;
    res.json(await client.nonprofits.getOrganizationDetailsByEIN({ ein }));
  } catch (e) { sendError(res, e); }
});

// ─── Start ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Tax990 Node.js SDK bridge running on http://localhost:${PORT}`);
});
