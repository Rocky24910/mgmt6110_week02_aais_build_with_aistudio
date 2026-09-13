// Serverless handler for /api/environment
// Deployed as Vercel Serverless Function and used in Vite dev middleware

const TEMP_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/air-temperature';
const HUMIDITY_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/relative-humidity';
const TARGET_STATION_ID = 'S111';
const DEFAULT_STATION_NAME = 'Scotts Road';
const SOURCE_ATTRIBUTION = 'NEA / data.gov.sg';

function sendJson(res, statusCode, data, headers = {}) {
  for (const [key, value] of Object.entries(headers)) {
    if (typeof res.setHeader === 'function') {
      res.setHeader(key, value);
    }
  }

  // Support Vercel Serverless Function helper
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }

  // Support standard Node HTTP / Connect / Vite middleware
  res.statusCode = statusCode;
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'application/json');
  }
  res.end(JSON.stringify(data));
}

export default async function handler(req, res) {
  // Only allow GET / HEAD
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    return sendJson(res, 405, {
      error: 'method_not_allowed',
      message: 'Method Not Allowed'
    });
  }

  let tempRes;
  let humidityRes;

  try {
    [tempRes, humidityRes] = await Promise.all([
      fetch(TEMP_API_URL, {
        headers: { 'User-Agent': 'HydroCrop-Monitor/2.4' }
      }),
      fetch(HUMIDITY_API_URL, {
        headers: { 'User-Agent': 'HydroCrop-Monitor/2.4' }
      })
    ]);
  } catch (err) {
    // Upstream unreachable / network failure
    return sendJson(
      res,
      502,
      {
        error: 'upstream_unreachable',
        message: 'The environmental data service cannot be reached right now. Facility sensor monitoring is unaffected.',
        reason: err?.message || 'Network failure reaching upstream service'
      },
      {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    );
  }

  // Check response.ok before attempting to parse the body
  if (!tempRes.ok || !humidityRes.ok) {
    return sendJson(
      res,
      502,
      {
        error: 'upstream_refusal',
        message: 'External conditions are temporarily unavailable from data.gov.sg.',
        upstreamStatus: {
          airTemperature: tempRes.status,
          relativeHumidity: humidityRes.status
        },
        reason: `Upstream service returned non-2xx status (air-temperature: ${tempRes.status}, relative-humidity: ${humidityRes.status})`
      },
      {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    );
  }

  try {
    const tempJson = await tempRes.json();
    const humidityJson = await humidityRes.json();

    // Verify station information
    const tempStations = tempJson?.data?.stations || [];
    const humidityStations = humidityJson?.data?.stations || [];
    const stationInfo =
      tempStations.find((s) => s.id === TARGET_STATION_ID) ||
      humidityStations.find((s) => s.id === TARGET_STATION_ID);
    const stationName = stationInfo?.name || DEFAULT_STATION_NAME;

    // Find S111 in latest air temperature reading
    const tempReadings = tempJson?.data?.readings || [];
    const latestTempReading =
      tempReadings.length > 0 ? tempReadings[tempReadings.length - 1] : null;
    const stationTempData = latestTempReading?.data?.find(
      (d) => d.stationId === TARGET_STATION_ID
    );
    const temperature =
      stationTempData && typeof stationTempData.value === 'number'
        ? stationTempData.value
        : null;
    const temperatureObservedAt = stationTempData
      ? latestTempReading?.timestamp || null
      : null;
    const temperatureUnit = tempJson?.data?.readingUnit || 'deg C';

    // Find S111 in latest relative humidity reading
    const humidityReadings = humidityJson?.data?.readings || [];
    const latestHumidityReading =
      humidityReadings.length > 0
        ? humidityReadings[humidityReadings.length - 1]
        : null;
    const stationHumidityData = latestHumidityReading?.data?.find(
      (d) => d.stationId === TARGET_STATION_ID
    );
    const humidity =
      stationHumidityData && typeof stationHumidityData.value === 'number'
        ? stationHumidityData.value
        : null;
    const humidityObservedAt = stationHumidityData
      ? latestHumidityReading?.timestamp || null
      : null;
    const humidityUnit = humidityJson?.data?.readingUnit || 'percentage';

    // If station S111 is absent from an otherwise successful response, return explicit empty-data
    if (temperature === null && humidity === null) {
      return sendJson(
        res,
        200,
        {
          stationId: TARGET_STATION_ID,
          station: stationName,
          temperature: null,
          temperatureUnit,
          temperatureObservationTimestamp: null,
          relativeHumidity: null,
          humidityUnit,
          humidityObservationTimestamp: null,
          source: SOURCE_ATTRIBUTION,
          empty: true,
          message: 'No recent external readings are available from this station.'
        },
        {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
          'Content-Type': 'application/json'
        }
      );
    }

    const payload = {
      stationId: TARGET_STATION_ID,
      station: stationName,
      temperature,
      temperatureUnit,
      temperatureObservationTimestamp: temperatureObservedAt,
      relativeHumidity: humidity,
      humidityUnit,
      humidityObservationTimestamp: humidityObservedAt,
      source: SOURCE_ATTRIBUTION
    };

    return sendJson(res, 200, payload, {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      'Content-Type': 'application/json'
    });
  } catch (err) {
    return sendJson(
      res,
      502,
      {
        error: 'upstream_parse_error',
        message: 'External conditions are temporarily unavailable from data.gov.sg.',
        reason: err?.message || 'Failed to parse upstream response payload'
      },
      {
        'Cache-Control': 'no-store',
        'Content-Type': 'application/json'
      }
    );
  }
}
