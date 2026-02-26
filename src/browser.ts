import { parseHTML } from "linkedom";
import puppeteer, { Browser, Page } from "puppeteer-core";

let browser: Browser | null = null;
let page: Page | null = null;

export async function setup() {
    browser = await puppeteer.launch({
        executablePath: "/usr/bin/chromium",
        args: ["--no-sandbox"]
    });

    page = await browser.newPage();
}

export default async function getDocument(url: string) {
    if (!browser || !page) throw new Error("Browser and page not initialized.")

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
