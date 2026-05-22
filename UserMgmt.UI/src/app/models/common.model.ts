export class Common {
  API_BASE_URL: string = 'http://localhost:5070/gateway/';
  //API_BASE_URL: string = 'https:scaling-giggle-xgr4jpj7947f9jr-5070.app.github.dev/gateway/';
}

function parseDDMMYYYY(input: string): Date | null {
  if (!input) return null;
  const parts = input.split('/');
  if (parts.length !== 3) return null;
  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1; // JS months are 0-based
  const year = Number(parts[2]);
  const d = new Date(year, month, day);
  return isNaN(d.getTime()) ? null : d;
}
