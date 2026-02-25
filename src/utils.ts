import { parseHTML } from "linkedom";

export default async function getDocument(url: string) {
   const request = new Request(url)
   const response = await fetch(request);
   if (!response.ok) {
      // Response was not successful, return error
      console.error(`The requested webpage returned a wrong statuscode: ${response.status}`)
      console.debug(`response headers: ${JSON.stringify(response.headers)}`)
      console.debug(`request headers: ${JSON.stringify(request.headers)}`)
      throw new Error("Failed retrieving the document.")
   }
   const html = await response.text();
   return parseHTML(html).window.document;
}
