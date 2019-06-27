if (req.url === '/api/v1/cars/key') {
  let h = Object.keys(brandJSON[0]).join(',') + "\n";
  let body = '';
  brandJSON.forEach(o => {
    body += Object.keys(o).map(k => o[k]).join(',') + "\n";
  });
  h += body;
  res.end(h);
} else res.end(JSON.stringify({
  success: false,
  error: 'Error',
  data: null
}));