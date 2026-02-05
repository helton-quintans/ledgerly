export async function GET() {
  return Response.json({
    test: "working",
    timestamp: new Date().toISOString(),
    deployTest: Math.random(),
    GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    allVars: Object.keys(process.env).filter(k => k.includes('GOOGLE'))
  });
}