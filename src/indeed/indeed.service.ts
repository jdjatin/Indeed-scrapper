import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import puppeteer from 'puppeteer';

@Injectable()
export class IndeedService {



//   @Cron(CronExpression.EVERY_HOUR)

async scrapeJobListings(scrappingData) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    const allJobListings = [];
    console.log("Scrapping Indeed in progress, If indeed stops changing page , close the indeed window and run API again")
    try {
      for (let i = 0; i < scrappingData.numberOfPages; i++) {
        const url = `https://ca.indeed.com/jobs?q=${scrappingData.jobTitle}&l=${scrappingData.location}&sort=date&start=${i * 10}`;
        await page.goto(url);
        await page.waitForSelector('h2.jobTitle span');

        const jobListings = await page.$$eval('.job_seen_beacon', listings => listings.map(listing => {
          const jobTitle = listing.querySelector('h2.jobTitle span')?.textContent.trim();
          const companyName = listing.querySelector('[data-testid="company-name"]')?.textContent.trim();
          const location = listing.querySelector('[data-testid="text-location"]')?.textContent.trim();
          const datePosted = listing.querySelector('span[data-testid="myJobsStateDate"]').childNodes[1].textContent.trim();
          return { jobTitle, companyName, location, datePosted };
        }));
        

        allJobListings.push(...jobListings);
        console.log(`Page ${i + 1} scraped.`);
      }
      console.log("Scrapping complete")

      return allJobListings;
    } catch (error) {
      console.error('Error while scraping job listings:', error);
    } finally {
      await browser.close();
    }
  }
}