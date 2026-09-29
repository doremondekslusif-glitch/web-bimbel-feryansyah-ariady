// Supabase connection for the Bimbel web app.
// Only the publishable key is exposed in this browser client.
window.BIMBEL_SUPABASE_CONFIG = {
  url: "https://dydesvcncgizbcczomty.supabase.co",
  publishableKey: "sb_publishable_09GCodMfdnMwDTu4001HJg_CoaEydA0"
};

window.bimbelSupabase = window.supabase.createClient(
  window.BIMBEL_SUPABASE_CONFIG.url,
  window.BIMBEL_SUPABASE_CONFIG.publishableKey
);
