export async function GET() {
  return Response.json({
    testVar: process.env.TEST_VAR,
    allEnvKeys: Object.keys(process.env).sort(),
    projectInfo: {
      vercelUrl: process.env.VERCEL_URL,
      vercelEnv: process.env.VERCEL_ENV,
      branch: process.env.VERCEL_BRANCH,
    },
  });
}