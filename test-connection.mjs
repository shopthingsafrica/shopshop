
try {
  const response = await fetch('https://tvtpytbhwvsyfefsufti.supabase.co');
  console.log('Status:', response.status);
} catch (error) {
  console.error('Fetch error:', error.message);
}
