import { parseHTML } from "linkedom";
import puppeteer from "puppeteer";

const browser = await puppeteer.launch();
const page = await browser.newPage();

export default async function getDocument(url: string) {
    const response = await page.goto(url);

    if (!response || !response.ok) {
        // Response was not successful, return error
        console.error(`The requested webpage returned a wrong statuscode: ${response?.status || "response was not defined"}`)
        console.debug(`response headers: ${JSON.stringify(response?.headers || "response was not defined")}`)
        throw new Error("Failed retrieving the document.")
    }
    const html = await response.text();
    return parseHTML(html).window.document;
}
