import express from "express";
import { JSDOM } from "jsdom";

const app = express();

type PB = {
   event: string | null;
   course: string | null;
   time: string | null;
   pts: string | null;
   date: string | null;
   city: string | null;
   name: string | null;
};

type Athlete = {
   id: string | null;
   name: string | null;
   dobYear: string | null;
   sex: "M" | "F" | null;
   country: string | null;
   club: string | null;
};

app.get("/", async (req, res) => {
   const ahtleteId = req.query.athleteId as string;
   if (!ahtleteId) {
      res.status(400).json({ error: "athleteId query parameter is required" });
      return;
   }

   const fetched = await fetch(
      `https://www.swimrankings.net/index.php?page=athleteDetail&athleteId=${ahtleteId}&athletePage=PBEST`,
   );
   const html = await fetched.text();

   const doc = new JSDOM(html).window.document;

   // Check if the athlete exists, if not, td with class 'name' exists. As double check check if contains string specified below.
   if (
      doc.querySelector(".name")?.textContent?.includes("Unknown athlete id")
   ) {
      res.status(404).json({ error: "Athlete not found" });
      return;
   }

   const info = doc.querySelector("#name")?.textContent;

   const name = info?.trim().replace(/[(0-9)]/g, "").trim().split(",") ||
      ["", ""];

   const dobYear = info?.trim().match(/[0-9]*/g)?.filter((v) => v != "")[0];

   const lastName = name[0].trim();
   const firstName = name[1].trim();

   const table = doc.getElementsByClassName(
      "athleteBest",
   )[0] as HTMLTableElement;
   const rows = table.tBodies[0].rows;

   let pbs: PB[] = [];
   for (const row of rows) {
      const obj: PB = {
         event: row.querySelector(".event a")?.textContent?.trim() || null,
         course: row.querySelector(".course")?.textContent?.trim() || null,
         time: row.querySelector(".time")?.textContent?.trim() || null,
         pts: row.querySelector(".code")?.textContent?.trim() || null,
         date: row.querySelector(".date")?.textContent?.trim() || null,
         city: row.querySelector(".city a")?.textContent?.trim() || null,
         name: row.querySelector(".name a")?.textContent?.trim() || null,
      };
      pbs.push(obj);
   }

   pbs.shift(); // First row is table header, remove it

   const resonse = {
      info: {
         id: ahtleteId,
         firstName,
         lastName,
         dobYear,
      },
      pbs: pbs,
   };
   res.status(200).json(resonse);
});

app.get("/search", async (req, res) => {
   const name = req.query.name as string;
   if (!name) {
      res.status(400).json({ error: "name query parameter is required" });
      return;
   }

   // For some reason last name also filters on first name when provided.
   const url = encodeURI(
      `https://www.swimrankings.net/index.php?&internalRequest=athleteFind&athlete_clubId=-1&athlete_gender=-1&athlete_lastname=${name}&athlete_firstname=`,
   );

   const fetched = await fetch(url);
   const html = await fetched.text();

   const doc = new JSDOM(html).window.document;

   const table = doc.getElementsByClassName(
      "athleteSearch",
   )[0] as HTMLTableElement;
   const rows = table.tBodies[0].rows;
   const athletes: Athlete[] = [];
   for (const row of rows) {
      const sex =
         row.querySelector("td img")?.getAttribute("src")?.includes("gender1")
            ? "M"
            : "F";

      const athlete: Athlete = {
         id: row.querySelector(".name a")?.getAttribute("href")?.match(
            /athleteId=(\d+)/,
         )?.[1] || null,
         name: row.querySelector(".name a")?.textContent?.trim() || null,
         dobYear: row.querySelector(".date")?.textContent?.trim() || null,
         sex,
         country: row.querySelector(".code")?.textContent?.trim() || null,
         club: row.querySelector(".club")?.textContent?.replace(/.* /g, "") ||
            null,
      };
      athletes.push(athlete);
   }

   const filtered = athletes.filter((v) => v.name !== null); // Removes first and last row which are table headers (last row onl when still more athletes are available)

   res.status(200).json(filtered);
});

const PORT = 8080;
app.listen(PORT, (e) => {
   if (e) console.error(e);
   else console.log(`Listening on port: ${PORT}`);
});
