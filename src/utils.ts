import { parseHTML } from "linkedom";

export default async function getDocument(url: string) {
   const request = new Request(url)
   const response = await fetch(request);
   if (!response.ok) {
      // Response was not successful, return error
      console.error(`The requested webpage returned a wrong statuscode: ${response.status}`)
      console.debug(`response headers: ${response.headers}`)
      console.debug(`response body: ${await response.text()}`)
      console.debug(`request headers: ${request.headers}`)
      throw new Error("Failed retrieving the document.")
   }
   const html = await response.text();
   return parseHTML(html).window.document;
}