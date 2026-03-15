exports.handler = async (event) => {
  const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'X-Auth-Token, Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS, body: '' };
  }

  // /api/competitions/PL/matches → /competitions/PL/matches
  const apiPath = event.path.replace(/^\/?api/, '');
  const query   = event.rawQuery ? `?${event.rawQuery}` : '';
  const token   = event.headers['x-auth-token'] || '';
  const url     = `https://api.football-data.org/v4${apiPath}${query}`;

  try {
    const res  = await fetch(url, { headers: { 'X-Auth-Token': token } });
    const body = await res.text();
    return {
      statusCode: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
