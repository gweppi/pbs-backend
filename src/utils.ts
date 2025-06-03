import { parseHTML } from "linkedom";

export default async function getDocument(url: string) {
   const fetched = await fetch(url);
   const html = await fetched.text();
   return parseHTML(html).window.document;
}