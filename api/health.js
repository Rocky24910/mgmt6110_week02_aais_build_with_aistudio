// Health check endpoint for /api/health
// Deployed as Vercel Serverless Function and used in Vite dev middleware

const TEMP_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature';
const HUMIDITY_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity';

function sendJson(res, statusCode, data, headers = {}) {
  for (const [key, value] of Object.entries(headers)) {
    if (typeof res.setHeader === 'function') {
      res.setHeader(key, value);
    }
  }

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }

  res.statusCode = statusCode;
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
  }
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  const checkedAt = new Date().toISOString();
  let airTemperatureUpstreamAnswered = false;
  let airTemperatureUpstreamStatus = null;
  let relativeHumidityUpstreamAnswered = false;
  let relativeHumidityUpstreamStatus = null;

  try {
    const tempRes = await fetch(TEMP_API_URL, {
      method: 'GET',
      headers: { 'User-Agent': 'HydroCrop-Monitor/2.4' }
    });
    airTemperatureUpstreamAnswered = true;
    airTemperatureUpstreamStatus = tempRes.status;
  } catch (err) {
    airTemperatureUpstreamAnswered = false;
    airTemperatureUpstreamStatus = null;
  }

  try {
    const humRes = await fetch(HUMIDITY_API_URL, {
      method: 'GET',
      headers: { 'User-Agent': 'HydroCrop-Monitor/2.4' }
    });
    relativeHumidityUpstreamAnswered = true;
    relativeHumidityUpstreamStatus = humRes.status;
  } catch (err) {
    relativeHumidityUpstreamAnswered = false;
    relativeHumidityUpstreamStatus = null;
  }

  const allHealthy =
    airTemperatureUpstreamAnswered &&
    airTemperatureUpstreamStatus === 200 &&
    relativeHumidityUpstreamAnswered &&
    relativeHumidityUpstreamStatus === 200;

  const statusCode = allHealthy ? 200 : 503;

  return sendJson(
    res,
    statusCode,
    {
      credentialRequired: false,
      airTemperatureUpstreamAnswered,
      airTemperatureUpstreamStatus,
      relativeHumidityUpstreamAnswered,
      relativeHumidityUpstreamStatus,
      checkedAt
    },
    {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Content-Type': 'application/json'
    }
  );
}
