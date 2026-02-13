   import type { NextApiRequest, NextApiResponse } from "next";

   const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

   export default async function handler(req: NextApiRequest, res: NextApiResponse) {
     if (req.method !== "GET") {
       res.setHeader("Allow", ["GET"]);
       return res.status(405).json({ error: "Method not allowed" });
     }

     const get = req.query.get;
     if (!get || typeof get !== "string") {
       return res.status(400).json({ error: "Missing `get` query param" });
     }

     if (!REPLICATE_API_TOKEN) {
       return res.status(500).json({ error: "Missing REPLICATE_API_TOKEN" });
     }

     try {
       const upstreamRes = await fetch(get, {
         headers: {
           Authorization: `Token ${REPLICATE_API_TOKEN}`,
           "Content-Type": "application/json",
         },
         cache: "no-store",
       });

       const data = await upstreamRes.json();

       const status: string = data.status ?? "unknown";
       let outputUrl: string | null = null;

       if (status === "succeeded") {
         if (Array.isArray(data.output) && data.output.length > 0) {
           outputUrl = data.output[0];
         } else if (typeof data.output === "string") {
           outputUrl = data.output;
         }
       }

       return res.status(200).json({
         status,
         output: outputUrl,
       });
     } catch (err) {
       console.error(err);
       return res.status(500).json({
         status: "failed",
         output: null,
         error: "Upstream error",
       });
     }
   }
